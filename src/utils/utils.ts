import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioResource,
  entersState,
  joinVoiceChannel,
  StreamType,
  VoiceConnection,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import axios from "axios";
import { VoiceChannel } from "discord.js";
import { promises as fs } from "fs";
import path from "path";

import { RandomGenerateIntegers } from "../types";
import { createDiscordJSAdapter } from "./adapter";
import logger from "./logger";

export const writeJson = async <T>(filePath: string, content: T): Promise<void> => {
  const filepath = path.resolve(filePath);
  try {
    await fs.stat(filepath);
  } catch {
    logger.warn({
      message: `404: File not found`,
      file: filePath,
    });
    await fs.writeFile(filepath, "");
  }

  await fs.writeFile(filepath, JSON.stringify(content));
};

export const loadJson = async <T>(filePath: string): Promise<T[]> => {
  const file = await fs.readFile(filePath);
  return JSON.parse(file.toString()) as Promise<T[]>;
};

export const mergeJson = async <T>(filePath: string, content: T): Promise<T[]> => {
  const file = await fs.readFile(filePath);

  let contents: T[];
  try {
    contents = JSON.parse(file.toString()) as T[];
  } catch {
    contents = [];
    logger.warn({
      message: `File had no contents`,
    });
  }
  contents.push(content);

  return contents;
};

export const sample = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getPathsByExtension = async (folder: string, extension: string): Promise<string[]> => {
  const dir = await fs.readdir(folder);
  return dir.filter((p) => path.extname(p) === extension).map((p) => path.resolve(process.cwd(), folder, p));
};

export const soundSamples = async (): Promise<string[]> => {
  return getPathsByExtension("assets", ".mp3");
};

export const jsonToMap = <V>(jsonString: string): Map<string, V> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return new Map(JSON.parse(jsonString));
};

// Checks if object is instance of T (only works on non-nullable types)
const isInterface = <T>(param: unknown): param is T => {
  return Object.entries(param as T).every(([, value]) => value !== "undefined");
};

// Takes a typeguard and safely parses the string to json
export const strToJsonTyped = <T>(jsonString: string): T | undefined => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const result = JSON.parse(jsonString);
  return isInterface<T>(result) ? result : undefined;
};

export const getCurrentSemester = (): string => {
  const current = new Date();
  const m = current.getMonth();
  const y = current.getFullYear();
  return `${y}${m < 6 ? "H" : "V"}`;
};

export const randomNumber = async (min: number, max: number): Promise<number> => {
  const request = await axios.post<RandomGenerateIntegers>("https://api.random.org/json-rpc/2/invoke", {
    jsonrpc: "2.0",
    method: "generateIntegers",
    params: {
      apiKey: process.env.RANDOM_ORG_KEY,
      n: 1,
      min: min,
      max: max,
      replacement: false,
    },
    id: 42,
  });

  return request.data.result.random.data[0];
};

export const createVoiceChannelConnection = async (voiceChannel: VoiceChannel): Promise<VoiceConnection> => {
  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: createDiscordJSAdapter(voiceChannel),
    debug: true,
  });

  console.log(connection.state);

  try {
    /**
     * Allow ourselves 30 seconds to join the voice channel. If we do not join within then,
     * an error is thrown.
     */
    await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
    /**
     * At this point, the voice connection is ready within 30 seconds! This means we can
     * start playing audio in the voice channel. We return the connection so it can be
     * used by the caller.
     */
    return connection;
  } catch (error) {
    /**
     * At this point, the voice connection has not entered the Ready state. We should make
     * sure to destroy it, and propagate the error by throwing it, so that the calling function
     * is aware that we failed to connect to the channel.
     */
    connection.destroy();
    throw error;
  }
};

export const playSong = (player: AudioPlayer, songpath: string) => {
  const resource = createAudioResource(songpath, {
    inputType: StreamType.Arbitrary,
  });
  if (!resource || !resource.readable) throw `Cannot read ${songpath}`;
  player.play(resource);
  console.log(player.checkPlayable());
  return entersState(player, AudioPlayerStatus.Playing, 5e3);
};
