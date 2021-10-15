import { Command } from "discord.js-commando";

import logger from "../../utils/logger";

class SofiaCommand extends Command {
  constructor(client) {
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

    this.run = async (message, { target }) => {
      logger.info({
        massage: "cs?",
        userId: message.author.id,
      });

      return await (target ? target.send("cs?") : message.say("please cs?"));
    };
  }
}

export default SofiaCommand;
