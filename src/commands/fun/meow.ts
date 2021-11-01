import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

import { DiscordClient, SlashCommandHandler } from "../../client";

export default class MeowCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder().setName("meow").setDescription("Replies with a meaw, kitty cat");

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<void> {
    await interaction.reply("Meow!");
  }
}
