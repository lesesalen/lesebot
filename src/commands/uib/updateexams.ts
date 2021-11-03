import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

import { DiscordClient, SlashCommandHandler } from "../../client";
import { deletePersistentData, getPersistentData } from "../../utils/courses";

export default class UpdateExamsCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder()
    .setName("updateexams")
    .setDescription("Update the JSON file for exam information")
    .setDefaultPermission(false);

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<void> {
    deletePersistentData();
    await getPersistentData();

    return interaction.reply({ content: `Okay! Exam information updated.`, ephemeral: true });
  }
}
