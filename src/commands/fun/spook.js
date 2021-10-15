import axios from "axios";
import { MessageEmbed } from "discord.js";
import Commando from "discord.js-commando";

import logger from "../../utils/logger.js";

class SpookCommand extends Commando.Command {
  constructor(client) {
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

  async run(message, { target }) {
    const gif = await axios.get(
      `https://api.giphy.com/v1/gifs/random?tag=skeleton&api_key=${String(process.env.GIPHY_API_KEY)}`,
    );

    const url = gif.data.data.images.original.url;
    const embed = new MessageEmbed().setImage(url);

    logger.info({
      message: `Spooked with ${url}`,
      userId: message.author.id,
    });

    return target
      ? Promise.resolve(
          [
            await message.direct(new MessageEmbed(embed).setTitle(`Successfully spooked ${target.tag} with this:`)),
            await target.send(embed.setTitle(`Spooked by ${message.author.tag}!`)),
          ].flat(),
        )
      : message.say(embed);
  }
}

export default SpookCommand;
