import { REST } from "@discordjs/rest";
import { AudioPlayer, AudioPlayerStatus, createAudioPlayer } from "@discordjs/voice";
import { Client, ClientOptions, Guild, VoiceChannel } from "discord.js";
import path from "path";

import logger from "../utils/logger";
import { createVoiceChannelConnection, playSong } from "../utils/utils";
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
    });

    this.on("interactionCreate", async (interaction) => {
      if (!interaction.isCommand()) return;
      logger.debug(`Received command ${interaction.commandName}`);
      await this.commandHandler.handle(interaction);
    });
  }
}
