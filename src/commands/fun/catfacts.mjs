import axios from "axios";
import { Command } from "discord.js-commando";

import logger from "../../utils/logger";

class CatFactsCommand extends Command {
  constructor(client) {
    super(client, {
      name: "catfact",
      group: "fun",
      memberName: "catfact",
      description: "You know what you need? CAT FACTS",
    });

    this.run = async (message) => {
      const api = await axios.get(`https://catfact.ninja/fact`);
      const fact = api.data.fact;

      logger.info({
        message: "CAT FACT!!!",
        userId: message.author.id,
      });

      return await message.say(`Did you know? ${fact}`);
    };
  }
}

export default CatFactsCommand;
