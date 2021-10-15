import Commando from "discord.js-commando";

import logger from "../../utils/logger.js";

class MeowCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "meow",
      group: "fun",
      memberName: "meow",
      description: "Replies with a meaw, kitty cat",
    });
  }

  async run(message) {
    logger.info({
      message: "M E O W",
      userId: message.author.id,
    });

    return await message.say("Meow!");
  }
}

export default MeowCommand;
