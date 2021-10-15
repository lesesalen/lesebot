import { Command } from "discord.js-commando";
import logger from "../../utils/logger";
class MeowCommand extends Command {
  constructor(client) {
    super(client, {
      name: "meow",
      group: "fun",
      memberName: "meow",
      description: "Replies with a meaw, kitty cat",
    });
    this.run = async (message) => {
      logger.info({
        message: "M E O W",
        userId: message.author.id,
      });
      return await message.say("Meow!");
    };
  }
}
export default MeowCommand;
