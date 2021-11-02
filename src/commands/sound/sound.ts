import { SlashCommandBuilder } from "@discordjs/builders";
import { AudioPlayerStatus, VoiceConnectionStatus } from "@discordjs/voice";
import { CommandInteraction, GuildMember, VoiceChannel } from "discord.js";
import path from "path";

import { DiscordClient, SlashCommandHandler } from "../../client";
import logger from "../../utils/logger";
import { createVoiceChannelConnection, playSong, soundSamples } from "../../utils/utils";

export default class SoundCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder()
    .setName("sound")
    .setDescription("Play some nice, calming sounds for your channel")
    .addStringOption((option) => option.setName("file").setDescription("MP3 to play").setRequired(true));

  async handle(interaction: CommandInteraction, client: DiscordClient): Promise<unknown> {
    const file = interaction.options.getString("file");
    if (file === null || file === "")
      return interaction.reply({ content: "You need to specify the file to play...", ephemeral: true });

    const paths = await soundSamples();
    const match = paths.map((p) => path.basename(p)).find((el) => el.toUpperCase().includes(file.toUpperCase()));

    if (!match) {
      return interaction.reply({
        content: `No matching sound clip found, try again!\nFor a look at the list of samples see \`/listsound\``,
        ephemeral: true,
      });
    }

    if (!(interaction.member instanceof GuildMember)) {
      logger.error("Member is somehow not a member of the server...");
      return interaction.reply({ content: "You're somehow not a member of the server?", ephemeral: true });
    }

    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel || !(voiceChannel instanceof VoiceChannel)) {
      return interaction.reply({ content: "You need to be in a voice channel first...", ephemeral: true });
    }

    const allowedSoundChannel = process.env["SOUND_ALLOWED_VOICE_CHANNEL_ID"];
    if (allowedSoundChannel && allowedSoundChannel !== voiceChannel.id) {
      return interaction.reply({
        content: `You can only annoy others in \`${
          (await interaction.guild?.channels.fetch(allowedSoundChannel))?.name ?? "NO CHANNELS"
        }\`, behave.`,
        ephemeral: true,
      });
    }

    if (client.audioPlayer.state.status === AudioPlayerStatus.Playing) {
      return interaction.reply({
        content: `I can only do so much at a time, please wait for me to finish...`,
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    logger.info(`Sound ${match} played by ${interaction.user.username} and users annoyed`);

    try {
      await playSong(client.audioPlayer, path.resolve(process.cwd(), `assets/${match}`));

      const connection = await createVoiceChannelConnection(voiceChannel);
      connection.subscribe(client.audioPlayer);

      client.audioPlayer.on(AudioPlayerStatus.Idle, () => {
        client.audioPlayer.stop();
        if (connection && connection.state.status != VoiceConnectionStatus.Destroyed) connection.destroy();
      });
    } catch (err) {
      logger.error(err);
      return interaction.editReply("Failed to play sound. :(");
    }

    return interaction.editReply("I hope you're happy now...");
  }
}
