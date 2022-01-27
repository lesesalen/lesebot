import { REST } from "@discordjs/rest";
import { AudioPlayer, createAudioPlayer } from "@discordjs/voice";
import { Client, ClientOptions, Guild } from "discord.js";

import { getPersistentData } from "../utils/courses";
import logger from "../utils/logger";
import { CommandHandler } from "./command_handler";
import { Config } from "./config";

export class DiscordClient extends Client {
  private commandHandler: CommandHandler;
  public restClient: REST;
  public readonly config: Config;
  public guild!: Guild;
  public audioPlayer: AudioPlayer;

  constructor(config: Config, options: ClientOptions) {
    super(options);
    this.config = config;
    this.restClient = new REST({ version: "9" }).setToken(this.config.discord.token);
    this.commandHandler = new CommandHandler(this);
    this.audioPlayer = createAudioPlayer();
  }

  init() {
    void this.login(this.config.discord.token);

    this.on("ready", async () => {
      logger.info(`Logged in as ${this?.user?.tag ?? "unknown"}!`);

      await this.commandHandler.init();
      this.guild = await this.guilds.fetch(this.config.discord.guildId);

      // Explicitly call getter of persistent data to force rebuilding of database
      await getPersistentData();
    });

    this.on("interactionCreate", (interaction) => {
      if (!interaction.isCommand()) return;
      logger.debug(`Received command ${interaction.commandName}`);
      void this.commandHandler.handle(interaction);
    });

    this.on("messageCreate", (message) => {
      const cmd = message.content.split(' ')[0];
      if (cmd.startsWith(this.config.discord.prefix)) {
        const cmdContent = cmd.slice(1);
        message.reply(`Commands starting with ${this.config.discord.prefix} are deprecated, try \`/${cmdContent}\` instead.`);
      }
    });
  }
}
