import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, MessageEmbed } from "discord.js";
import logger from "../../utils/logger";
import axios from "axios";

interface giphyrespone {
  data: {
    images: {
      original: {
        url: string;
      };
    };
  };
}

class SpookCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "spook",
      aliases: ["spooky", "spooks", "skeleton"],
      group: "fun",
      memberName: "spook",
      description: "Sends a random spooky skeleton!",
    });
  }

  run = async (message: CommandoMessage): Promise<Message | Message[]> => {
    const gif = await axios.get<giphyrespone>(
      "https://api.giphy.com/v1/gifs/random?tag=skeleton&api_key=oTOIF1WAus5Aftz7BcgD5RJ7MJ24mn3r",
    );
    const url = gif.data.data.images.original.url;
    const embed = new MessageEmbed().setImage(url);

    logger.info({
      message: `Spooked with ${url}`,
      userId: message.author.id,
    });

    return await message.say(embed);
  };
}

export default SpookCommand;
