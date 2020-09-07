import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";
import logger from "../../utils/logger";

class MeowCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "meow",
      group: "fun",
      memberName: "meow",
      description: "Replies with a meaw, kitty cat",
    });
  }

  run = async (message: CommandoMessage): Promise<Message | Message[]> => {
    logger.info({
      message: "M E O W",
      userId: message.author.id,
    });

    return await message.say("Meow!");
  };
}

export default MeowCommand;
