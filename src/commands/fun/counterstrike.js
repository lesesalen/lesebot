import Commando from "discord.js-commando";

import logger from "../../utils/logger.js";

class SofiaCommand extends Commando.Command {
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
  }

  async run(message, { target }) {
    logger.info({
      massage: "cs?",
      userId: message.author.id,
    });

    return target ? target.send("cs?") : message.say("please cs?");
  }
}

export default SofiaCommand;
