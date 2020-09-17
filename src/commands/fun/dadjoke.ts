import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";
import axios from "axios";
import logger from "../../utils/logger";

class DadJokeCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "dadjoke",
      aliases: ["kenneth"],
      group: "fun",
      memberName: "dadjoke",
      description: "DAD YOKE, ha ha ha",
    });
  }

  run = async (message: CommandoMessage): Promise<Message | Message[]> => {
    const api = await axios.get<Record<string, string>>(`https://icanhazdadjoke.com/`, {
      headers: {
        Accept: "application/json",
      },
    });
    const joke = api.data.joke;

    logger.info({
      message: "Dad joke, ha ha",
      userId: message.author.id,
    });

    return await message.say(joke);
  };
}

export default DadJokeCommand;
