import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";

import { DiscordClient, SlashCommandHandler } from "../../client";
import { getPersistentData } from "../../utils/courses";
import logger from "../../utils/logger";

export default class WhereRoomCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder()
    .setName("where") // .setAlias("room", "hvor")
    .setDescription("Locates a room's position")
    .addStringOption((option) => option.setName("room").setDescription("Room to inquire about").setRequired(true));

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<void> {
    const room = interaction.options.getString("room", true);

    const data = await getPersistentData();
    if (!data) {
      logger.error("Cannot find any rooms data...");
      return interaction.reply({ content: `Sorry, cannot find any rooms.`, ephemeral: true });
    }

    const roomKeys = [...data.rooms.keys()];

    // Search normally first, just to make search more precise
    let roomKey = roomKeys.find((element) => room === element);

    // Bit more general search:
    if (!roomKey) {
      roomKey = roomKeys.map((s) => s.toUpperCase()).find((element) => element.includes(room.toUpperCase()));
    }

    const roomEntry = [...data.rooms.entries()].find(([key]) => key.toUpperCase() === roomKey);
    if (!roomEntry) {
      return interaction.reply({ content: `Sorry, couldn't find the room "${room}".`, ephemeral: true });
    }

    const embed = new MessageEmbed().setColor("#0099ff").setTitle(roomEntry[0]).setURL(roomEntry[1].roomurl);

    return interaction.reply({ embeds: [embed] });
  }
}
