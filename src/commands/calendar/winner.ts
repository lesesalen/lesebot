import { SlashCommandBuilder } from "@discordjs/builders";
import { AudioPlayerStatus } from "@discordjs/voice";
import { CommandInteraction, GuildMember, Message, MessageEmbed, VoiceChannel } from "discord.js";
import path from "path";

import { DiscordClient, SlashCommandHandler } from "../../client";
import logger from "../../utils/logger";
import { createVoiceChannelConnection, playSong } from "../../utils/utils";

export default class WinnerCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder()
    .setName("calendar")
    .setDescription("Choose a random member of your voice channel to win!"); //.setAlias("kalender")

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<void> {
    await interaction.reply("Command is temporarily disabled. :(");
    return;
    if (!interaction.guild) return;

    if (interaction.member instanceof GuildMember) {
      const voiceChannel = interaction.member.voice.channel;
      console.log(voiceChannel);
      if (voiceChannel && voiceChannel instanceof VoiceChannel) {
        const members = Array.from(voiceChannel.members.values());

        // if (members.length === 1) {
        //   return await interaction.reply("Trying to win on your own, eh? You lost.");
        // }

        // const number = await randomNumber(0, members.length - 1);
        const number = 0;
        const winner = members[number];

        await interaction.deferReply();

        // Play audio:
        try {
          const connection = await createVoiceChannelConnection(voiceChannel);
          const sub = connection.subscribe(_client.audioPlayer);
          if (!sub || _client.audioPlayer === undefined || _client.audioPlayer.state === undefined) throw "What?";

          console.log(_client.audioPlayer.state);
          const player = await playSong(
            _client.audioPlayer,
            path.resolve(process.cwd(), "assets/restricted/hes_the_winner.mp3"),
          );
          logger.debug(`Player state: ${player.state.status}`);

          player.on(AudioPlayerStatus.Idle, () => {
            logger.debug("Player stopped!");
            player.stop();
            connection.destroy();
          });
        } catch (err) {
          logger.error(err);
        }

        const embed = new MessageEmbed()
          .setColor("#0099ff")
          .setTitle("The Winner")
          .setDescription(`<@${winner.user.id}>`)
          .setThumbnail(
            winner.user.avatarURL() ?? "https://www.dictionary.com/e/wp-content/uploads/2018/03/PogChamp-300x300.jpg",
          )
          .setTimestamp()
          .setFooter("Better luck next time");

        await interaction.editReply({ embeds: [embed] });

        // Add reactions:
        const message = await interaction.fetchReply();
        if (message instanceof Message) {
          const ree = _client.emojis.cache.find((emoji) => emoji.name === "ree");
          await message.react(ree ?? "🔥");
          await message.react("🎉");
        }
      } else {
        await interaction.reply("You need to be in a voice channel to use this command...");
      }
    } else {
      await interaction.reply("You're somehow not a member of the Server???");
    }
  }
}
