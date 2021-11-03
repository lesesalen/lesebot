import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

import { DiscordClient, SlashCommandHandler } from "../../client";
import { formatQuote, loadMergedQuotes } from "../../utils/quotes";

export default class ListQuotesCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder().setName("listquotes").setDescription("List all quotes said by our users");

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<unknown> {
    const quotes = await loadMergedQuotes();

    await interaction.deferReply({ ephemeral: true });

    const reply = `You requested all of our quotes, enjoy! (its limited to the last 25 sadly)\n${quotes
      .slice(-25, quotes.length)
      .map((q) => `> ${formatQuote(q)}\n`)
      .join("\n")}`;

    return interaction.editReply(reply);
  }
}
