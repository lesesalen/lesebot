import axios from "axios";
import Commando from "discord.js-commando";

import logger from "../../utils/logger.mjs";

class AffirmationCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "affirmation",
      aliases: ["affirm"],
      group: "fun",
      memberName: "affirmation",
      description: "We all need that little friendly push",
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

  async run(message, { target }) {
    const api = await axios.get(`https://www.affirmations.dev/`);

    const affirm = api.data.affirmation;
    logger.info({
      message: "Someone needed some affirmation...",
      userId: message.author.id,
      targetId: target.toString(),
    });

    if (typeof target === "string") {
      return await message.say(`${affirm}.`);
    } else {
      if (target.id === message.author.id) {
        return await message.reply(`Need a little lift, <@${target.id}>? ${affirm}.`);
      }
    }

    return await message.say(`<@${target.id}>: ${affirm}. (from <@${message.author.id}>)`);
  }
}

export default AffirmationCommand;
