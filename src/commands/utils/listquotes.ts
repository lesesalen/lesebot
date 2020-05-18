import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";

import { loadMergedQuotes, formatQuote } from "../../modules/quotes";

class ListQuotesCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "listquotes",
      aliases: ["lq"],
      group: "fun",
      memberName: "listquotes",
      description: "List all quotes said by our users",
    });
  }

  run = async (message: CommandoMessage): Promise<Message | Message[]> => {
    const quotes = await loadMergedQuotes();

    await message.say("Alright! Sneaking the list into your DMs");

    await message.author.send(`You requested all of our quotes, enjoy! (its limited to the last 25 sadly)\n`);
    const reply = quotes
      .slice(quotes.length - 25, quotes.length)
      .map((q) => `> ${formatQuote(q)}\n`)
      .join("\n");
    return await message.author.send(reply);
  };
}

export default ListQuotesCommand;
