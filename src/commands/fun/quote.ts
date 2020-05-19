import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";

import { Quote } from "../../types";
import { loadMergedQuotes, formatQuote } from "../../modules/quotes";
import { sample } from "../../utils";

class QuoteCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "quote",
      aliases: ["dagenssitat"],
      group: "fun",
      memberName: "quote",
      description: "A random quote from our highly intelligent members",
    });
  }

  run = async (message: CommandoMessage): Promise<Message | Message[]> => {
    const quotes = await this.load();
    const quote = sample(quotes);

    return await message.say(formatQuote(quote));
  };

  load = async (): Promise<Quote[]> => {
    return await loadMergedQuotes();
  };
}

export default QuoteCommand;
