import { ApplicationCommandPermissionData, CommandInteraction } from "discord.js";
import { Routes } from "discord-api-types/v9";
import fs from "node:fs/promises";
import path from "node:path";

import logger from "../utils/logger";
import { DiscordClient } from "./client";
import { CommandConstructor, SlashCommand } from "./command";
import { Handler } from "./handler";

export class CommandHandler implements Handler<CommandInteraction> {
  private commands: Map<string, SlashCommand>;
  private readonly client: DiscordClient;

  constructor(client: DiscordClient) {
    this.client = client;
    this.commands = new Map();
  }

  async init() {
    await this.loadCommands();
    await this.registerCommands();
  }

  async handle(interaction: CommandInteraction) {
    if (!this.commands.has(interaction.commandName.toLowerCase())) return;
    const command = this.commands.get(interaction.commandName.toLowerCase());

    return command?.handle(interaction, this.client);
  }

  private async loadCommands() {
    const groups = await fs.readdir(path.join(__dirname, "../commands"));
    for (const group of groups) {
      const commands = await fs.readdir(path.join(__dirname, `../commands/${group}`));
      for (const name of commands) {
        const { default: Constructor } = (await import(`../commands/${group}/${name}`)) as CommandConstructor;
        const command: SlashCommand = new Constructor();
        logger.debug(`Importing command from './commands/${group}/${name}`);
        this.commands.set(command.getName(), command);
      }
    }
  }

  private async registerCommands() {
    try {
      logger.info(`Started refreshing application (/) commands.`);

      await this.client.restClient.put(
        Routes.applicationGuildCommands(this.client.config.discord.appId, this.client.config.discord.guildId),
        {
          body: [...this.commands.values()].map((it) => it.toJSON()),
        },
      );

      // Permissions:
      const guild = this.client.guilds.cache.get(this.client.config.discord.guildId);
      const roles = (await guild?.roles?.fetch())?.filter((role) => role.name.toUpperCase() === "ADMIN");
      const rolePermissions: ApplicationCommandPermissionData[] =
        roles?.map((role) => ({
          id: role.id,
          type: "ROLE",
          permission: true,
        })) ?? [];

      const restrictedCommands = Array.from(
        (await guild?.commands?.fetch())?.filter((value) => !value.defaultPermission).values() ?? [],
      );
      for (const command of restrictedCommands) {
        await command.permissions.add({ permissions: rolePermissions });
      }

      logger.info(`Successfully refreshed application (/) commands.`);
    } catch (error) {
      logger.error(error);
    }
  }
}
