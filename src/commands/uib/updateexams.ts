import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

import { DiscordClient, SlashCommandHandler } from "../../client";
import { deletePersistenData, getPersistentData } from "../../utils/courses";

export default class UpdateExamsCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder()
    .setName("updateexams")
    .setDescription("Update the JSON file for exam information");

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<void> {
    deletePersistenData();
    await getPersistentData();

    return await interaction.reply({ content: `Okay! Exam information updated.`, ephemeral: true });
  }
}
