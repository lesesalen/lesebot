import { REST } from "@discordjs/rest";
import { Client, Intents } from "discord.js";
import { Routes } from "discord-api-types/v9";
import { config } from "dotenv";
import fs from "fs/promises";

import logger from "./utils/logger.js";

class DiscordClient extends Client {
  #commands;
  #rest;

  /**
   * @param {import("discord.js").ClientOptions} options
   */
  constructor(options) {
    super(options);
    this.#commands = new Map();
  }

  async init() {
    this.#rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);
    await this.loadCommands();
    await this.registerCommands();
  }

  async loadCommands() {
    const groups = await fs.readdir(new URL("commands", import.meta.url).pathname);
    for (const group of groups) {
      const commands = await fs.readdir(new URL(`commands/${group}`, import.meta.url).pathname);
      for (const name of commands) {
        const it = await import(`./commands/${group}/${name}`);
        const data = it.data.toJSON();
        logger.debug(`Importing command from './commands/${group}/${name}`);
        this.#commands.set(data.name.toLowerCase(), data);
      }
    }
  }

  async registerCommands() {
    try {
      console.log(`Started refreshing application (/) commands.`);

      await this.#rest.put(Routes.applicationGuildCommands(process.env.DISCORD_APP_ID, process.env.DISCORD_GUILD_ID), {
        body: [...this.#commands.values()],
      });

      console.log(`Successfully refreshed application (/) commands.`);
    } catch (error) {
      console.error(error);
    }
  }

  async runCommand(interaction) {
    if (!this.#commands.has(interaction.commandName.toLowerCase())) return;

    return interaction.reply("Meow!");
  }
}

config();

const client = new DiscordClient({ intents: [Intents.FLAGS.GUILDS] });
await client.init();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_TOKEN);

client.on("interactionCreate", (interaction) => {
  if (!interaction.isCommand()) return;
  client.runCommand(interaction);
});
