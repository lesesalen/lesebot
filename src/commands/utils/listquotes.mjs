import Commando from "discord.js-commando";

import { formatQuote, loadMergedQuotes } from "../../modules/quotes.mjs";

class ListQuotesCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "listquotes",
      aliases: ["lq"],
      group: "fun",
      memberName: "listquotes",
      description: "List all quotes said by our users",
    });
  }

  async run(message) {
    const quotes = await loadMergedQuotes();

    await message.say("Alright! Sneaking the list into your DMs");

    await message.author.send(`You requested all of our quotes, enjoy! (its limited to the last 25 sadly)\n`);
    const reply = quotes
      .slice(-25, quotes.length)
      .map((q) => `> ${formatQuote(q)}\n`)
      .join("\n");

    return await message.author.send(reply);
  }
}

export default ListQuotesCommand;
