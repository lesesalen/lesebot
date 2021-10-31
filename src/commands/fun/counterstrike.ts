import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";

import { DiscordClient, SlashCommandHandler } from "../../client";

export default class SofiaCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder()
    .setName("counterstrike") // .setAlias("sofia")
    .setDescription("CS?")
    .addUserOption((option) => option.setName("user").setDescription("Choose someone play cs with").setRequired(false));

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<void> {
    const user = interaction.options.getMember("user", false);

    if (user instanceof GuildMember)
      await Promise.all([user.send("cs?"), interaction.reply({ content: ";)", ephemeral: true })]);
    else return await interaction.reply("please cs?");
  }
}
