import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";

import { DiscordClient, SlashCommandHandler } from "../../client";
import logger from "../../utils/logger";

export default class SofiaCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder()
    .setName("counterstrike") // .setAlias("sofia")
    .setDescription("CS?")
    .addUserOption((option) => option.setName("user").setDescription("Choose someone play cs with").setRequired(false));

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<void> {
    const user = interaction.options.getMember("user");

    if (user instanceof GuildMember) {
      try {
        await user.send("cs?");
        return interaction.reply({ content: ";)", ephemeral: true });
      } catch (err) {
        logger.error(err);
        return interaction.reply({ content: ":(", ephemeral: true });
      }
    } else return interaction.reply("please cs?");
  }
}
