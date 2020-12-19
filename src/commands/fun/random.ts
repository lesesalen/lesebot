import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, MessageEmbed } from "discord.js";
import logger from "../../utils/logger";
import { randomNumber } from "../../utils";

class RandomNumCommand extends Command {
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
          validate: (val: string) => parseInt(val) >= 0,
          parse: (val: string) => parseInt(val),
        },
        {
          key: "max",
          prompt: "Maximum value",
          type: "integer",
          validate: (val: string) => parseInt(val) >= 0,
          parse: (val: string) => parseInt(val),
        },
      ],
    });
  }

  run = async (message: CommandoMessage, { min, max }: { min: string; max: string }): Promise<Message | Message[]> => {
    const num = await randomNumber(parseInt(min), parseInt(max));

    logger.info({
      message: "A random number was generated",
      userId: message.author.id,
    });

    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .attachFiles(["./assets/blobross.png"])
      .setTitle("Random number")
      .setDescription(num)
      .setThumbnail("attachment://blobross.png")
      .setTimestamp()
      .setFooter("Guaranteed to be random");

    return await message.say(embed);
  };
}

export default RandomNumCommand;
