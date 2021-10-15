import axios from "axios";
import { Message } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";

import logger from "../../utils/logger";

class CatFactsCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "catfact",
      group: "fun",
      memberName: "catfact",
      description: "You know what you need? CAT FACTS",
    });
  }

  run = async (message: CommandoMessage): Promise<Message | Message[]> => {
    const api = await axios.get<Record<string, string>>(`https://catfact.ninja/fact`);
    const fact = api.data.fact;

    logger.info({
      message: "CAT FACT!!!",
      userId: message.author.id,
    });

    return await message.say(`Did you know? ${fact}`);
  };
}

export default CatFactsCommand;
