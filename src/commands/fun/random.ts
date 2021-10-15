import { Message, MessageEmbed } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";

import { randomNumber } from "../../utils";
import logger from "../../utils/logger";

class RandomNumberCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "random",
      group: "fun",
      memberName: "random",
      description: "Get a random number between min and max",
      args: [
        {
          key: "min",
          prompt: "Minimum value",
          type: "integer",
          validate: (value: string) => Number.parseInt(value) >= 0,
          parse: (value: string) => Number.parseInt(value),
        },
        {
          key: "max",
          prompt: "Maximum value",
          type: "integer",
          validate: (value: string) => Number.parseInt(value) >= 0,
          parse: (value: string) => Number.parseInt(value),
        },
      ],
    });
  }

  run = async (message: CommandoMessage, { min, max }: { min: number; max: number }): Promise<Message | Message[]> => {
    if (min >= max || max < min) {
      return await message.reply(`That's illegal, yo`);
    }

    const number = await randomNumber(min, max);

    logger.info({
      message: "A random number was generated",
      userId: message.author.id,
    });

    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .attachFiles(["./assets/blobross.png"])
      .setTitle("Random number")
      .setDescription(number)
      .setThumbnail("attachment://blobross.png")
      .setTimestamp()
      .setFooter("Guaranteed to be random");

    return await message.say(embed);
  };
}

export default RandomNumberCommand;
