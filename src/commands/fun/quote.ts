import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { sample } from "lodash";

import { DiscordClient, SlashCommandHandler } from "../../client";
import { formatQuote, loadMergedQuotes } from "../../utils/quotes";

export default class QuoteCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder()
    .setName("quote") // .setAlias("dagenssitat")
    .setDescription("A random quote from our highly intelligent members");

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<void> {
    const quotes = await loadMergedQuotes();
    const quote = sample(quotes);

    return interaction.reply(
      quote !== undefined
        ? formatQuote(quote)
        : {
            content: "¯\\_(ツ)_/¯",
            ephemeral: true,
          },
    );
  }
}
