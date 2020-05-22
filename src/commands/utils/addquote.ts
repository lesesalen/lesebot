import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";

import { Quote } from "../../types";
import { writeJson } from "../../utils";
import { ADDED_QUOTES_PATH } from "../../modules/quotes";
import logger from "../../utils/logger";

class AddQuoteCommand extends Command {
  constructor(client: CommandoClient) {
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

  run = async (message: CommandoMessage, { id }: { id: string }): Promise<Message | Message[]> => {
    const lastMessage = await message.channel.messages.fetch(id);
    const quote: Quote = { quote: lastMessage.content, author: lastMessage.author.username, date: new Date() };
    await writeJson(ADDED_QUOTES_PATH, quote);

    logger.info({
      message: `Adding a new quote from ID`,
      userId: message.author.id,
      messageId: id,
    });

    return await message.say(`Thanks! Added a new quote to the memory bank...`);
  };
}

export default AddQuoteCommand;
