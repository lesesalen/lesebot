import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";
import dateformat from "dateformat";
import fs from "fs";
import path from "path";

class WednesdayCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "wednesday",
      group: "sound",
      memberName: "wednesday",
      description: "It is Wednesday my Dudes",
      throttling: {
        usages: 1,
        duration: 10,
      },
    });
  }

  run = async (message: CommandoMessage): Promise<Message | Message[]> => {
    if (dateformat(new Date(), "dddd").toLowerCase() !== "wednesday") {
      return await message.say("It is **NOT** Wednesday my Dudes");
    }

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return await message.reply("You need to be in a voice channel for wednesday");
    } else {
      const connection = await voiceChannel.join();
      const dispatcher = connection.play(
        fs.createReadStream(path.resolve(process.cwd(), "assets/restricted/wednesday.mp3")),
      );
      dispatcher.on("error", console.error);
      dispatcher.on("start", () => console.log("wednesday.mp3 is now playing"));
      dispatcher.on("finish", () => {
        console.log("wednesday.mp3 is done playing");
        dispatcher.destroy();
        voiceChannel.leave();
      });
      return await message.say("It is Wednesday my Dudes");
    }
  };
}

export default WednesdayCommand;
