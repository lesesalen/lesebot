import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";

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
    return await message.say("Meow!");
  };
}

export default MeowCommand;
