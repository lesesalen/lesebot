import { SlashCommandBuilder, userMention } from "@discordjs/builders";
import { AudioPlayerStatus, VoiceConnectionStatus } from "@discordjs/voice";
import { CommandInteraction, GuildMember, Message, MessageAttachment, MessageEmbed, VoiceChannel } from "discord.js";
import path from "path";

import { DiscordClient, SlashCommandHandler } from "../../client";
import logger from "../../utils/logger";
import { createVoiceChannelConnection, playSong, randomNumber } from "../../utils/utils";

export default class WinnerCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder()
    .setName("calendar")
    .setDescription("Choose a random member of your voice channel to win!"); //.setAlias("kalender")

  async handle(interaction: CommandInteraction, client: DiscordClient): Promise<unknown> {
    if (!interaction.guild) return;

    if (interaction.member instanceof GuildMember) {
      const voiceChannel = interaction.member.voice.channel;
      if (voiceChannel && voiceChannel instanceof VoiceChannel) {
        const members = Array.from(voiceChannel.members.values());

        if (members.length === 1) {
          return interaction.reply("Trying to win on your own, eh? You lost.");
        }

        const number = await randomNumber(0, members.length - 1);
        const winner = members[number];

        // Wait with reply so we can send result and audio at the same time
        await interaction.deferReply();

        // Play audio:
        try {
          await playSong(client.audioPlayer, path.resolve(process.cwd(), "assets/restricted/hes_the_winner.mp3"));

          const connection = await createVoiceChannelConnection(voiceChannel);
          connection.subscribe(client.audioPlayer);

          client.audioPlayer.on(AudioPlayerStatus.Idle, () => {
            client.audioPlayer.stop();
            if (connection && connection.state.status != VoiceConnectionStatus.Destroyed) connection.destroy();
          });
        } catch (err) {
          logger.error(err);
        }

        // Fancy message embed:
        const avatar = winner.user.avatarURL();
        const attachments =
          avatar === undefined
            ? [new MessageAttachment(path.resolve(process.cwd(), "assets/pogchamp.jpg"))]
            : undefined;
        const embed = new MessageEmbed()
          .setColor("#0099ff")
          .setTitle("The Winner")
          .setDescription(userMention(winner.user.id))
          .setThumbnail(avatar ?? "attachment://pogchamp.jpg")
          .setTimestamp()
          .setFooter("Better luck next time");

        const message = await interaction.editReply({ embeds: [embed], files: attachments });

        // Add reactions:
        if (message instanceof Message) {
          const ree = client.emojis.cache.find((emoji) => emoji.name === "ree");
          await message.react(ree ?? "🔥");
          return message.react("🎉");
        }
        return;
      } else {
        return interaction.reply({
          content: "You need to be in a voice channel to use this command...",
          ephemeral: true,
        });
      }
    } else {
      return interaction.reply({ content: "You're somehow not a member of the Server???", ephemeral: true });
    }
  }
}
