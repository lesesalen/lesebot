import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, User } from "discord.js";
import random from "lodash/random";

import logger from "../../utils/logger";

class SlapCommand extends Command {
  constructor(client: CommandoClient) {
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

  run = async (message: CommandoMessage, { target }: { target: User | string }): Promise<Message | Message[]> => {
    logger.info({
      message: "Slapping some poor sod...",
      userId: message.author.id,
      targetId: target.toString,
    });

    if (typeof target === "string") {
      const randomUser = Array.from(message.member.guild.members.valueOf().values());
      let user = randomUser[random(0, randomUser.length)];
      while (user.presence.status !== "online") {
        user = randomUser[random(0, randomUser.length)];
      }

      return await message.say(`<@${message.author.id}> slaps <@${user.id}>! Ouch...`);
    } else {
      return await message.say(`<@${message.author.id}> slaps <@${target.id}>! Ouch...`);
    }
  };
}

export default SlapCommand;
