import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";
import fs from "fs";
import path from "path";

class GongCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "gong",
      group: "sound",
      memberName: "gong",
      description: "GONG",
    });
  }

  run = async (message: CommandoMessage): Promise<Message | Message[]> => {
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return await message.reply("You need to be in a voice channel for THE GONG");
    } else {
      const connection = await voiceChannel.join();
      const dispatcher = connection.play(fs.createReadStream(path.resolve(process.cwd(), "assets/gong.mp3")));
      dispatcher.on("error", console.error);
      dispatcher.on("start", () => console.log("gong.mp3 is now playing"));
      dispatcher.on("finish", () => {
        console.log("gong.mp3 is done playing");
        dispatcher.destroy();
        voiceChannel.leave();
      });
      return await message.reply("GONG!");
    }
  };
}

export default GongCommand;
