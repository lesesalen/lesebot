import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, MessageEmbed, User } from "discord.js";
import logger from "../../utils/logger";
import axios from "axios";

interface GiphyResponse {
  data: { images: { original: { url: string } } };
}

class SpookCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "spook",
      aliases: ["spooky", "spooks", "skeleton"],
      group: "fun",
      memberName: "spook",
      description: "Sends a random spooky skeleton!",
      details: `Returns a random gif from giphy with the "skeleton" tag and sends it in the current channel, or to an optional user if @target is specified.`,
      args: [
        {
          key: "target",
          prompt: "An optional user to spook",
          type: "user",
          validate: undefined,
          default: "",
        },
      ],
    });
  }

  run = async (message: CommandoMessage, { target }: { target: User }): Promise<Message | Message[]> => {
    const gif = await axios.get<GiphyResponse>(
      `https://api.giphy.com/v1/gifs/random?tag=skeleton&api_key=${String(process.env.GIPHY_API_KEY)}`,
    );
    const url = gif.data.data.images.original.url;
    const embed = new MessageEmbed().setImage(url);

    logger.info({
      message: `Spooked with ${url}`,
      userId: message.author.id,
    });

    if (target) {
      return await Promise.all([
        message.direct(new MessageEmbed(embed).setTitle(`Successfully spooked ${target.tag} with this:`)) as Promise<
          Message
        >,
        target.send(embed.setTitle(`Spooked by ${message.author.tag}!`)),
      ]);
    } else return await message.say(embed);
  };
}

export default SpookCommand;
