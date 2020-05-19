import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, User } from "discord.js";
import axios from "axios";

class ComplimentCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "compliment",
      group: "fun",
      memberName: "compliment",
      description: "Give your dear friends a nice little compliment",
      argsPromptLimit: 0,
      args: [
        {
          key: "target",
          prompt: "The user to target",
          type: "user",
          validate: undefined,
          default: "",
        },
      ],
    });
  }

  run = async (message: CommandoMessage, { target }: { target: User | string }): Promise<Message | Message[]> => {
    const api = await axios.get(`https://complimentr.com/api`);
    let compliment: string = api.data.compliment.toLowerCase();
    compliment = compliment.charAt(0).toUpperCase() + compliment.slice(1);

    if (typeof target === "string") {
      return await message.say(`Wow, <@${message.author.id}>, ${compliment.toLowerCase()}`);
    } else {
      const response = `Hey, <@${target.id}>! ${compliment}. (from <@${message.author.id}>)`;
      return await message.say(response);
    }
  };
}

export default ComplimentCommand;
