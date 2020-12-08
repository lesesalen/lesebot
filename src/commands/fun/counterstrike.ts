import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, User } from "discord.js";
import logger from "../../utils/logger";

class SofiaCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "counterstrike",
      aliases: ["sofia"],
      group: "fun",
      memberName: "counterstrike",
      description: "CS?",
      args: [
        {
          key: "target",
          prompt: "Tag someone play cs with",
          type: "user",
          validate: undefined,
          default: "",
        },
      ],
    });
  }

  run = async (message: CommandoMessage, { target }: { target: User }): Promise<Message | Message[]> => {
    logger.info({
      massage: "cs?",
      userId: message.author.id,
    });

    if (target) {
      return await target.send("cs?");
    } else return await message.say("please cs?");
  };
}

export default SofiaCommand;
