import { REST } from "@discordjs/rest";
import { Client, ClientOptions, Guild } from "discord.js";

import logger from "../utils/logger";
import { CommandHandler } from "./command_handler";
import { Config } from "./config";

export class DiscordClient extends Client {
  private commandHandler: CommandHandler;
  public restClient: REST;
  public readonly config: Config;
  public guild!: Guild;

  constructor(config: Config, options: ClientOptions) {
    super(options);
    this.config = config;
    this.restClient = new REST({ version: "9" }).setToken(this.config.discord.token);
    this.commandHandler = new CommandHandler(this);
  }

  async init() {
    await this.commandHandler.init();
    this.guild = await this.guilds.fetch(this.config.discord.guildId);

    this.on("ready", () => {
      logger.info(`Logged in as ${this?.user?.tag ?? "unknown"}!`);
    });

    await this.login(this.config.discord.token);
  }

  start() {
    this.on("interactionCreate", (interaction) => {
      if (!interaction.isCommand()) return;
      logger.debug(`Received command ${interaction.commandName}`);
      void this.commandHandler.handle(interaction);
    });
  }
}
