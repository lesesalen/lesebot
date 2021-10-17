import { REST } from "@discordjs/rest";
import { Client, ClientOptions, CommandInteraction } from "discord.js";
import { Routes } from "discord-api-types/v9";
import fs from "node:fs/promises";
import path from "path";

import { CommandConstructor, SlashCommand } from "./command";
import { Config } from "./config";
import logger from "./utils/logger";

export class DiscordClient extends Client {
  private commands: Map<string, SlashCommand>;
  private restClient: REST;
  private readonly config: Config;

  constructor(config: Config, options: ClientOptions) {
    super(options);
    this.config = config;
    this.restClient = new REST({ version: "9" }).setToken(this.config.discord.token);
    this.commands = new Map();
  }

  async init() {
    await this.loadCommands();
    await this.registerCommands();
  }

  async loadCommands() {
    const groups = await fs.readdir(path.join(__dirname, "commands"));
    for (const group of groups) {
      const commands = await fs.readdir(path.join(__dirname, `commands/${group}`));
      for (const name of commands.filter((file) => file.endsWith(".js"))) {
        const { default: Constructor } = (await import(`./commands/${group}/${name}`)) as CommandConstructor;
        const command: SlashCommand = new Constructor();
        logger.debug(`Importing command from './commands/${group}/${name}`);
        this.commands.set(command.name.toLowerCase(), command);
      }
    }
  }

  async registerCommands() {
    try {
      logger.info(`Started refreshing application (/) commands.`);

      await this.restClient.put(
        Routes.applicationGuildCommands(this.config.discord.appId, this.config.discord.guildId),
        {
          body: [...this.commands.values()].map((cmd) => cmd.toJson()),
        },
      );

      logger.info(`Successfully refreshed application (/) commands.`);
    } catch (error) {
      logger.error(error);
    }
  }

  async runCommand(interaction: CommandInteraction) {
    if (!this.commands.has(interaction.commandName.toLowerCase())) return;
    const command = this.commands.get(interaction.commandName.toLowerCase());

    return command?.handle(interaction, this);
  }
}
