import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageAttachment, MessageEmbed } from "discord.js";

import { DiscordClient, SlashCommandHandler } from "../../client";
import { randomNumber } from "../../utils/utils";

export default class RandomNumberCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder()
    .setName("random")
    .setDescription("Get a random number between min and max")
    .addIntegerOption((option) => option.setName("min").setDescription("Minimum value").setRequired(true))
    .addIntegerOption((option) => option.setName("max").setDescription("Maximum value").setRequired(true));

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<void> {
    const min = interaction.options.getInteger("min") ?? 0;
    const max = interaction.options.getInteger("max") ?? 0;

    if (min >= max || max < min) {
      return await interaction.reply({ content: `That's illegal, yo`, ephemeral: true });
    }

    const number = await randomNumber(min, max);

    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Random number")
      .setDescription(`${number}`)
      .setImage("attachment://blobross.png")
      .setThumbnail("attachment://blobross.png")
      .setTimestamp()
      .setFooter("Guaranteed to be random");

    return await interaction.reply({ embeds: [embed], attachments: [new MessageAttachment("./assets/blobross.png")] });
  }
}
