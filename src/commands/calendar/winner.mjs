import { Message, MessageEmbed } from "discord.js";
import Commando from "discord.js-commando";
import fs from "fs";
import path from "path";

import { randomNumber } from "../../utils/index.mjs";
import logger from "../../utils/logger.mjs";

class WinnerCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "calendar",
      aliases: ["kalender"],
      group: "fun",
      memberName: "calendar",
      description: "Choose a random member of your voice channel to win!",
    });
  }

  async run(message) {
    const voiceChannel = message.member?.voice.channel;

    if (!voiceChannel) {
      logger.warn({
        message: "User was not in sound channel for calendar",
        userId: message.author.id,
      });

      return await message.reply("You need to be in a voice channel to use this command...");
    } else {
      const members = voiceChannel.members.array();

      if (members.length === 1) {
        return await message.reply("Trying to win on your own, eh? You lost.");
      }

      const number = await randomNumber(0, members.length - 1);
      const winner = members[number];

      logger.info({
        message: "Selected a new calendar winner!",
        userId: message.author.id,
        winner: winner.user.id,
      });

      const connection = await voiceChannel.join();

      const dispatcher = connection.play(
        fs.createReadStream(path.resolve(process.cwd(), "assets/restricted/hes_the_winner.mp3")),
      );

      dispatcher.on("error", console.error);
      dispatcher.on("start", () => console.log("hes_the_winner.mp3 is now playing"));
      dispatcher.on("finish", () => {
        console.log("hes_the_winner.mp3 is done playing");
        dispatcher.destroy();
        voiceChannel.leave();
      });

      const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("The Winner")
        .setDescription(`<@${winner.user.id}>`)
        .setThumbnail(
          winner.user.avatarURL() ?? "https://www.dictionary.com/e/wp-content/uploads/2018/03/PogChamp-300x300.jpg",
        )
        .setTimestamp()
        .setFooter("Better luck next time");

      const reply = await message.say(embed);

      if (reply instanceof Message) {
        const ree = this.client.emojis.cache.find((emoji) => emoji.name === "ree");
        await reply.react(ree ?? "🔥");
        await reply.react("🎉");
      }

      return reply;
    }
  }
}

export default WinnerCommand;
