import Commando from "discord.js-commando";

import { formatQuote, loadMergedQuotes } from "../../modules/quotes.js";
import { sample } from "../../utils/index.js";
import logger from "../../utils/logger.js";

class QuoteCommand extends Commando.Command {
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
