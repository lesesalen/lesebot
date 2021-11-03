import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

import { DiscordClient, SlashCommandHandler } from "../../client";
import { ADDED_QUOTES_PATH, formatQuote, loadMergedQuotes } from "../../utils/quotes";
import { mergeJson, writeJson } from "../../utils/utils";

export default class QuoteModCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder()
    .setName("quotemod") // .setAlias("dagenssitat")
    .setDescription("Modify and/or settings related to quotes")
    .setDefaultPermission(false)
    .addSubcommand((command) => command.setName("list").setDescription("List all quotes said by our users"))
    .addSubcommand((command) =>
      command
        .setName("add")
        .setDescription("Add a quote to the servers memory bank")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The authors glorious quote, identifiyed by Discord ID")
            .setRequired(true),
        ),
    )
    .addSubcommand((command) =>
      command
        .setName("madd")
        .setDescription("Add a quote to the servers memory bank, just manually")
        .addStringOption((option) => option.setName("authors").setDescription("The glorious authors"))
        .addStringOption((option) => option.setName("text").setDescription("The authors glorious quote")),
    );

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<unknown> {
    switch (interaction.options.getSubcommand()) {
      case "list":
        return listQuotes(interaction);
      case "add":
        return addQuote(interaction);
      default:
        return manuallyAddQuote(interaction);
    }
  }
}

const addQuote = async (interaction: CommandInteraction): Promise<unknown> => {
  const user = interaction.options.getUser("user");
  if (user) {
    await interaction.deferReply();

    const lastMessage = (await interaction.channel?.messages?.fetch())?.filter((m) => m.author.id === user.id).last();
    if (lastMessage) {
      const quote = { quote: lastMessage.content, author: lastMessage.author.username, date: new Date() };
      const mergedQuotes = await mergeJson(ADDED_QUOTES_PATH, quote);
      await writeJson(ADDED_QUOTES_PATH, mergedQuotes);

      return interaction.editReply({ content: `Thanks! Added a new quote to the memory bank...` });
    } else {
      return interaction.editReply({ content: "Couldn't find user's last message :(" });
    }
  } else {
    return interaction.reply({ content: "Could'nt find user. :(", ephemeral: true });
  }
};

const listQuotes = async (interaction: CommandInteraction): Promise<unknown> => {
  const quotes = await loadMergedQuotes();

  await interaction.deferReply({ ephemeral: true });

  const reply = `You requested all of our quotes, enjoy! (its limited to the last 25 sadly)\n${quotes
    .slice(-25, quotes.length)
    .map((q) => `> ${formatQuote(q)}\n`)
    .join("\n")}`;

  return interaction.editReply(reply);
};

const manuallyAddQuote = async (interaction: CommandInteraction): Promise<unknown> => {
  const authors = interaction.options.getString("authors");
  const text = interaction.options.getString("text");

  if (authors && text && authors.length && text.length) {
    await interaction.deferReply();

    const quote = { quote: text, author: authors, date: new Date() };
    const mergedQuotes = await mergeJson(ADDED_QUOTES_PATH, quote);
    await writeJson(ADDED_QUOTES_PATH, mergedQuotes);

    return interaction.editReply({ content: `Thanks! Added a new quote to the memory bank...` });
  } else {
    return interaction.reply({
      content: "You need to specify authors AND text, neither can be empty.",
      ephemeral: true,
    });
  }
};
