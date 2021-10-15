import Commando from "discord.js-commando";

import { ADDED_QUOTES_PATH } from "../../modules/quotes.js";
import { mergeJson, writeJson } from "../../utils/index.js";
import logger from "../../utils/logger.js";

class AddQuoteCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "addquote",
      aliases: ["aq"],
      group: "fun",
      memberName: "addquote",
      description: "Add a quote to the servers memory bank",
      hidden: true,
      args: [
        {
          key: "id",
          prompt: "The authors glorious quote, identifiyed by Discord ID",
          type: "string",
        },
      ],
    });
  }

  async run(message, { id }) {
    const lastMessage = await message.channel.messages.fetch(id);
    const quote = { quote: lastMessage.content, author: lastMessage.author.username, date: new Date() };
    const mergedQuotes = await mergeJson(ADDED_QUOTES_PATH, quote);
    await writeJson(ADDED_QUOTES_PATH, mergedQuotes);

    logger.info({
      message: `Adding a new quote from ID`,
      userId: message.author.id,
      messageId: id,
    });

    return await message.say(`Thanks! Added a new quote to the memory bank...`);
  }
}

export default AddQuoteCommand;
