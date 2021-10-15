import { Command } from "discord.js-commando";

import { soundSamples } from "../../utils";
import logger from "../../utils/logger";

class ListSoundCommand extends Command {
  constructor(client) {
    super(client, {
      name: "listsound",
      aliases: ["ls"],
      group: "sound",
      memberName: "listsound",
      description: "List of all the available 'sounds'",
    });

    this.run = async (message) => {
      logger.info({
        message: `List of sounds requested`,
        userId: message.author.id,
      });

      await message.direct("Here are all the sound files!");

      const paths = await soundSamples();
      const reply = paths.map((p) => `> ${p}`).join("\n");

      await message.direct(reply);

      return await message.reply(`To run do ${process.env.DISCORD_PREFIX ?? "!"}sound <name>`);
    };
  }
}

export default ListSoundCommand;
