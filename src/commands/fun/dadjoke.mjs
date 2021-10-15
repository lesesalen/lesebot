import axios from "axios";
import { Command } from "discord.js-commando";

import logger from "../../utils/logger.mjs";

class DadJokeCommand extends Command {
  constructor(client) {
    super(client, {
      name: "dadjoke",
      aliases: ["kenneth"],
      group: "fun",
      memberName: "dadjoke",
      description: "DAD YOKE, ha ha ha",
    });
  }

  async run(message) {
    const api = await axios.get(`https://icanhazdadjoke.com/`, {
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
  }
}

export default DadJokeCommand;
