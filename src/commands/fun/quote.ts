import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { sample } from "lodash";

import { DiscordClient, SlashCommandHandler } from "../../client";
import { formatQuote, loadMergedQuotes } from "../../utils/quotes";

export default class QuoteCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder()
    .setName("quote") // .setAlias("dagenssitat")
    .setDescription("A random quote from our highly intelligent members")
    .addSubcommand((command) =>
      command.setName("get").setDescription("A random quote from our highly intelligent members"),
    )
    .addSubcommand((command) => command.setName("list").setDescription("List available quotes"))
    .addSubcommand((command) => command.setName("add").setDescription("Add a quote to the servers memory bank"));

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<void> {
    if (interaction.options.getSubcommand() === "list") return await listQuotes(interaction);
    else if (interaction.options.getSubcommand() === "add") return await addQuote(interaction);
    else return await sendQuote(interaction);
  }
}

const addQuote = async (interaction: CommandInteraction): Promise<void> => {
  return await interaction.reply('"Add"');
};

const listQuotes = async (interaction: CommandInteraction): Promise<void> => {
  return await interaction.reply('"List"');
};

const sendQuote = async (interaction: CommandInteraction): Promise<void> => {
  const quotes = await loadMergedQuotes();
  const quote = sample(quotes);

  return await interaction.reply(quote !== undefined ? await formatQuote(quote) : "¯\\_(ツ)_/¯");
};
