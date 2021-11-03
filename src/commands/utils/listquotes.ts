import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

import { DiscordClient, SlashCommandHandler } from "../../client";
import { formatQuote, loadMergedQuotes } from "../../utils/quotes";
import { concatToMaxLengthSegments } from "../../utils/utils";

export default class ListQuotesCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder().setName("listquotes").setDescription("List all quotes said by our users");

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<unknown> {
    const quotes = await loadMergedQuotes();

    await interaction.deferReply({ ephemeral: true });

    const formattedQuotes = concatToMaxLengthSegments(
      quotes.map((q) => `> ${formatQuote(q)}`),
      2000,
    );

    await interaction.editReply(`You requested all of our quotes, enjoy!`);
    const messageResults = formattedQuotes.map(
      async (message) => await interaction.followUp({ content: message, ephemeral: true }),
    );

    return messageResults.at(-1);
  }
}
