import Commando from "discord.js-commando";
import random from "lodash/random.js";

import logger from "../../utils/logger.js";

class SlapCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "slap",
      group: "fun",
      memberName: "slap",
      description: "Slap a poor (potentially random) member of our server",
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
      ],
    });
  }

  async run(message, { target }) {
    logger.info({
      message: "Slapping some poor sod...",
      userId: message.author.id,
      targetId: target.toString,
    });

    if (typeof target === "string") {
      const randomUser = [...(message.member?.guild.members.valueOf().values() ?? [])];
      let user = randomUser[random(0, randomUser.length)];

      while (user.presence.status !== "online") {
        user = randomUser[random(0, randomUser.length)];
      }

      return await message.say(`<@${message.author.id}> slaps <@${user.id}>! Ouch...`);
    } else {
      return await message.say(`<@${message.author.id}> slaps <@${target.id}>! Ouch...`);
    }
  }
}

export default SlapCommand;
