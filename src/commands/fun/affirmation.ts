import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";
import axios from "axios";

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
    const api = await axios.get(`https://www.affirmations.dev/`);
    const affirm = api.data.affirmation;

    return await message.say(affirm);
  };
}

export default AffirmationCommand;
