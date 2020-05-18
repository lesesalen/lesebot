import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";

import { loadMergedQuotes } from "../../modules/quotes";

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

    let reply = "";
    reply += `You requested all of our quotes, enjoy!\n`;
    for (const quote of quotes) {
      reply += `> ${quote.quote} -- ${quote.author} (${quote.date})\n\n`;
    }

    await message.say("Alright! Sneaking the list into your DMs");
    return await message.author.send(reply);
  };
}

export default ListQuotesCommand;
