import axios from "axios";
import { Command } from "discord.js-commando";
import logger from "../../utils/logger";
class InsultCommand extends Command {
  constructor(client) {
    super(client, {
      name: "insult",
      group: "fun",
      memberName: "insult",
      description: "Insult a 'friend'",
      argsPromptLimit: 0,
      format: "[target]",
      args: [
        {
          key: "target",
          prompt: "The user to target",
          type: "user",
          validate: undefined,
          default: "",
        },
        {
          key: "tts",
          prompt: "Play as Text-To-Speech",
          type: "boolean",
          validate: undefined,
          default: false,
        },
      ],
    });
    this.run = async (message, { target, tts }) => {
      const api = await axios.get(`https://insult.mattbas.org/api/insult`);
      const insult = api.data.toLowerCase();
      logger.info({
        message: "Someone sent an insult...",
        userId: message.author.id,
        targetId: target.toString(),
        tts: tts,
      });
      if (typeof target === "string") {
        return await message.say(`Wow, <@${message.author.id}>, ${insult}`);
      } else {
        const response = `Hey, <@${target.id}>! <@${message.author.id}> thinks ${insult}`;
        return await message.say(response, { tts: tts });
      }
    };
  }
}
export default InsultCommand;
