import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";
import axios from "axios";
import logger from "../../utils/logger";

class AffirmationCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "affirmation",
      aliases: ["affirm"],
      group: "fun",
      memberName: "affirmation",
      description: "We all need that little friendly push",
    });
  }

  run = async (message: CommandoMessage): Promise<Message | Message[]> => {
    const api = await axios.get<Record<string, string>>(`https://www.affirmations.dev/`);
    const affirm = api.data.affirmation;

    logger.info({
      message: "Someone needed some affirmation...",
      userId: message.author.id,
    });

    return await message.say(affirm);
  };
}

export default AffirmationCommand;
