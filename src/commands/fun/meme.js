import axios from "axios";
import Commando from "discord.js-commando";

import logger from "../../utils/logger.js";

class MemeCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "meme",
      group: "fun",
      memberName: "meme",
      description: "Funny meme, ha ha",
    });
  }

  async run(message) {
    const api = await axios.get(`https://meme-api.herokuapp.com/gimme`, {
      headers: {
        "User-Agent": "lesebot (https://github.com/lesesale/lesebot)",
        Accept: "application/json",
      },
    });

    const joke = api.data.url;

    logger.info({
      message: "Funny meme, ha ha",
      userId: message.author.id,
    });

    return await message.say(url);
  }
}

export default MemeCommand;
