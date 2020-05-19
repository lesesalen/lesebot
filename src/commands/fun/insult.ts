import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, User } from "discord.js";
import axios from "axios";

class InsultCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "insult",
      group: "fun",
      memberName: "insult",
      description: "Insult a 'friend'",
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
    const api = await axios.get(`https://insult.mattbas.org/api/insult`);
    const insult: string = api.data.toLowerCase();

    if (typeof target === "string") {
      return await message.say(`Wow, <@${message.author.id}>, ${insult}`);
    } else {
      const response = `Hey, <@${target.id}>! <@${message.author.id}> thinks ${insult}`;
      return await message.say(response);
    }
  };
}

export default InsultCommand;
