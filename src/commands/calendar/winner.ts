import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";

import fs from "fs";
import path from "path";

import { sample } from "../../utils";
import logger from "../../utils/logger";

class WinnerCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "calendar",
      aliases: ["kalender"],
      group: "fun",
      memberName: "calendar",
      description: "Choose a random member of your voice channel to win!",
    });
  }

  run = async (message: CommandoMessage): Promise<Message | Message[]> => {
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      logger.warn({
        message: "User was not in sound channel for calendar",
        userId: message.author.id,
      });

      return await message.reply("You need to be in a voice channel to use this command...");
    } else {
      const winner = sample(voiceChannel.members.array());

      logger.info({
        message: "Selected a new calendar winner!",
        userId: message.author.id,
        winner: winner,
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

      const reply = await message.say(`And the winner is... <@${winner.user.id}>`);
      if (reply instanceof Message) {
        const ree = this.client.emojis.cache.find((e) => e.name === "ree");
        await reply.react(ree ?? "🔥");
        await reply.react("🎉");
      }

      return reply;
    }
  };
}

export default WinnerCommand;
