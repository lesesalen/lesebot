import axios from "axios";
import Commando from "discord.js-commando";

import logger from "../../utils/logger.js";

class DadJokeCommand extends Commando.Command {
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
        "User-Agent": "lesebot (https://github.com/lesesale/lesebot)",
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
