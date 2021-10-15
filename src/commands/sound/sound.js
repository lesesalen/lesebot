import Commando from "discord.js-commando";
import fs from "fs";
import path from "path";

import { ALLOWED_VOICE_CHANNEL } from "../../constants.js";
import { getState, setPlayingState } from "../../state.js";
import { soundSamples } from "../../utils/index.js";
import logger from "../../utils/logger.js";

class SoundCommand extends Commando.Command {
  constructor(client) {
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
      throttling: {
        usages: 1,
        duration: 10,
      },
    });
  }

  async run(message, { file }) {
    if (file === "") {
      return await message.reply("You need to specify the file to play...");
    }

    const paths = await soundSamples();
    const hasMatch = paths.includes(file);

    if (!hasMatch) {
      logger.warn({
        message: "Request for missing file",
        userId: message.author.id,
        file: file,
      });

      return await message.reply(
        `No matching sound clip found, try again!\nFor a look at the list of samples see \`${
          process.env.DISCORD_PREFIX ?? "!"
        } listsound\``,
      );
    }

    const voiceChannel = message.member?.voice.channel;
    if (!voiceChannel) {
      logger.warn({
        message: "User was not in sound channel for sound request",
        userId: message.author.id,
      });
      return await message.reply("You need to be in a voice channel first...");
    }

    if (!ALLOWED_VOICE_CHANNEL.includes(voiceChannel.id)) {
      logger.info({
        message: "User attempted to annoy in the wrong voice channel",
        userId: message.author.id,
        file: file,
      });

      return await message.say(`You can only annoy others in <#${ALLOWED_VOICE_CHANNEL[0]}>, behave.`);
    }

    if (getState().playingSound) {
      logger.info({
        message: "Attempting to play audio multiple times, aborting",
        userId: message.author.id,
      });

      return await message.say(`I can only do so much at a time, please wait for me to finish...`);
    }

    logger.info({
      message: "Sound played and users annoyed",
      userId: message.author.id,
      file: file,
    });

    const connection = await voiceChannel.join();
    const dispatcher = connection.play(fs.createReadStream(path.resolve(process.cwd(), `assets/${file}.mp3`)));

    dispatcher.on("error", console.error);
    dispatcher.on("start", () => {
      console.log(`${file}.mp3 is now playing`);
      setPlayingState(true);
    });
    dispatcher.on("finish", () => {
      console.log(`${file}.mp3 is done playing`);
      dispatcher.destroy();
      voiceChannel.leave();
      setPlayingState(false);
    });

    return await message.direct("I hope you're happy now...");
  }
}

export default SoundCommand;
