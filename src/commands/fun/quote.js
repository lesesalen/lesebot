import { Command } from "discord.js-commando";
import { formatQuote, loadMergedQuotes } from "../../modules/quotes";
import { sample } from "../../utils";
import logger from "../../utils/logger";
class QuoteCommand extends Command {
  constructor(client) {
    super(client, {
      name: "quote",
      aliases: ["dagenssitat"],
      group: "fun",
      memberName: "quote",
      description: "A random quote from our highly intelligent members",
    });
    this.run = async (message) => {
      const quotes = await loadMergedQuotes();
      const quote = sample(quotes);
      logger.info({
        message: "Quote requested",
        userId: message.author.id,
      });
      return await message.say(formatQuote(quote));
    };
  }
}
export default QuoteCommand;
