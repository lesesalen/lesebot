import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";

import { loadMergedQuotes, formatQuote } from "../../modules/quotes";
import { sample } from "../../utils";
import logger from "../../utils/logger";

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
    const quotes = await loadMergedQuotes();
    const quote = sample(quotes);

    logger.info({
      message: "Quote requested",
      userId: message.author.id,
    });

    return await message.say(formatQuote(quote));
  };
}

export default QuoteCommand;
