import { SlashCommandBuilder } from "@discordjs/builders";
import { format } from "date-fns";
import { CommandInteraction, MessageAttachment, MessageEmbed } from "discord.js";
import path from "path";

import { DiscordClient, SlashCommandHandler } from "../../client";

export default class WeekCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder()
    .setName("week")
    .setDescription("What week is it again? Man, I wish I had a calendar");

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<void> {
    const attachment = new MessageAttachment(path.resolve(process.cwd(), "assets/blobross.png"));
    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Week number")
      .setDescription(format(new Date(), "I"))
      .setThumbnail("attachment://blobross.png")
      .setTimestamp()
      .setFooter("Don't you have a calendar?");

    return interaction.reply({ embeds: [embed], files: [attachment] });
  }
}
