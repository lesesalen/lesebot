import { SlashCommandBuilder } from "@discordjs/builders";
import { AudioPlayerStatus, VoiceConnectionStatus } from "@discordjs/voice";
import { format } from "date-fns";
import { CommandInteraction, GuildMember, VoiceChannel } from "discord.js";
import path from "path";

import { DiscordClient, SlashCommandHandler } from "../../client";
import logger from "../../utils/logger";
import { createVoiceChannelConnection, playSong } from "../../utils/utils";

export default class WednesdayCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder().setName("wednesday").setDescription("It is Wednesday my Dudes");

  async handle(interaction: CommandInteraction, client: DiscordClient): Promise<void> {
    if (format(new Date(), "EEEE") !== "Wednesday") {
      return await interaction.reply({ content: "It is **NOT** Wednesday my Dudes", ephemeral: true });
    }

    if (!(interaction.member instanceof GuildMember)) {
      throw "Member is somehow not a member of the server...";
    }

    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel || !(voiceChannel instanceof VoiceChannel)) {
      return await interaction.reply({ content: "You need to be in a voice channel for wednesday", ephemeral: true });
    }

    if (client.audioPlayer.state.status === AudioPlayerStatus.Playing) {
      return await interaction.reply({
        content: "Please wait until Jimmy's done screaming.",
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    try {
      await playSong(client.audioPlayer, path.resolve(process.cwd(), "assets/restricted/wednesday.mp3"));

      const connection = await createVoiceChannelConnection(voiceChannel);
      connection.subscribe(client.audioPlayer);

      client.audioPlayer.on(AudioPlayerStatus.Idle, () => {
        client.audioPlayer.stop();
        if (connection && connection.state.status != VoiceConnectionStatus.Destroyed) connection.destroy();
      });
    } catch (err) {
      logger.error(err);
    }

    await interaction.editReply("It is Wednesday my Dudes");
  }
}
