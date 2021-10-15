import { Command } from "discord.js-commando";
import { ADDED_QUOTES_PATH } from "../../modules/quotes";
import { mergeJson, writeJson } from "../../utils";
import logger from "../../utils/logger";
class ManuallyAddQuoteCommand extends Command {
  constructor(client) {
    super(client, {
      name: "maddquote",
      aliases: ["maq"],
      group: "fun",
      memberName: "maddquote",
      description: "Add a quote to the servers memory bank, just manually",
      hidden: true,
      args: [
        {
          key: "text",
          prompt: "The authors glorious quote",
          type: "string",
        },
        {
          key: "author",
          prompt: "The glorious authors ",
          type: "string",
        },
      ],
    });
    this.run = async (message, { text, author }) => {
      const quote = { quote: text, author: author, date: new Date() };
      const mergedQuotes = await mergeJson(ADDED_QUOTES_PATH, quote);
      await writeJson(ADDED_QUOTES_PATH, mergedQuotes);
      logger.info({
        message: `Manually adding a new quote from ID`,
        userId: message.author.id,
        quote: text,
      });
      return await message.say(`Thanks! Added a new quote to the memory bank...`);
    };
  }
}
export default ManuallyAddQuoteCommand;
