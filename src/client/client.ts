import { REST } from "@discordjs/rest";
import { Client, ClientOptions } from "discord.js";

import { CommandHandler, Config } from ".";

export class DiscordClient extends Client {
  private commandHandler: CommandHandler;
  public restClient: REST;
  public readonly config: Config;

  constructor(config: Config, options: ClientOptions) {
    super(options);
    this.config = config;
    this.restClient = new REST({ version: "9" }).setToken(this.config.discord.token);
    this.commandHandler = new CommandHandler(this);
  }

  async init() {
    await this.commandHandler.init();

    this.on("ready", () => {
      console.log(`Logged in as ${this?.user?.tag ?? "unknown"}!`);
    });

    await this.login(this.config.discord.token);
  }

  start() {
    this.on("interactionCreate", (interaction) => {
      if (!interaction.isCommand()) return;
      void this.commandHandler.handle(interaction);
    });
  }
}
