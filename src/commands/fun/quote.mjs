import { Command } from "discord.js-commando";

import { formatQuote, loadMergedQuotes } from "../../modules/quotes.mjs";
import { sample } from "../../utils/index.mjs";
import logger from "../../utils/logger.mjs";

class QuoteCommand extends Command {
  constructor(client) {
    super(client, {
      name: "quote",
      aliases: ["dagenssitat"],
      group: "fun",
      memberName: "quote",
      description: "A random quote from our highly intelligent members",
    });
  }

  async run(message) {
    const quotes = await loadMergedQuotes();
    const quote = sample(quotes);

    logger.info({
      message: "Quote requested",
      userId: message.author.id,
    });

    return await message.say(formatQuote(quote));
  }
}

export default QuoteCommand;
