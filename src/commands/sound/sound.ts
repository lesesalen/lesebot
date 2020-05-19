import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";
import fs from "fs";
import path from "path";

class SoundCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "sound",
      aliases: ["audio", "noise"],
      group: "sound",
      memberName: "sound",
      description: "Play some nice, calming sounds for your channel",
      argsPromptLimit: 0,
      args: [
        {
          key: "file",
          prompt: "MP3 to play",
          type: "string",
          validate: undefined,
          default: "",
        },
      ],
    });
  }

  run = async (message: CommandoMessage, { file }: { file: string }): Promise<Message | Message[]> => {
    if (file === "") {
      return await message.reply("You need to specify the file to play...");
    }

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return await message.reply("You need to be in a voice channel for THE GONG");
    } else {
      const connection = await voiceChannel.join();
      const dispatcher = connection.play(fs.createReadStream(path.resolve(process.cwd(), `assets/${file}.mp3`)));
      dispatcher.on("error", console.error);
      dispatcher.on("start", () => console.log(`${file}.mp3 is now playing`));
      dispatcher.on("finish", () => {
        console.log(`${file}.mp3 is done playing`);
        dispatcher.destroy();
        voiceChannel.leave();
      });
    }

    return await message.direct("I hope you're happy now...");
  };
}

export default SoundCommand;
