import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageAttachment, MessageEmbed } from "discord.js";
import path from "path";

import { DiscordClient, SlashCommandHandler } from "../../client";
import { randomNumber } from "../../utils/utils";

export default class RandomNumberCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder()
    .setName("random")
    .setDescription("Get a random number between min and max")
    .addIntegerOption((option) => option.setName("min").setDescription("Minimum value").setRequired(true))
    .addIntegerOption((option) => option.setName("max").setDescription("Maximum value").setRequired(true));

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<void> {
    const min = interaction.options.getInteger("min", true);
    const max = interaction.options.getInteger("max", true);

    if (min >= max || max < min) {
      return interaction.reply({ content: `That's illegal, yo`, ephemeral: true });
    }

    const number = await randomNumber(min, max);

    const attachment = new MessageAttachment(path.resolve(process.cwd(), "assets/blobross.png"));
    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Random number")
      .setDescription(`${number}`)
      .setThumbnail("attachment://blobross.png")
      .setTimestamp()
      .setFooter("Guaranteed to be random");

    return interaction.reply({ embeds: [embed], files: [attachment] });
  }
}
