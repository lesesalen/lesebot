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
  });

  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
    return connection;
  } catch (error) {
    connection.destroy();
    throw error;
  }
};

export const playSong = (player: AudioPlayer, songpath: string): Promise<AudioPlayer> => {
  const resource = createAudioResource(songpath, {
    inputType: StreamType.Arbitrary,
  });
  if (!resource || !resource.readable) return Promise.reject(`Cannot read ${songpath}`);
  player.play(resource);
  return entersState(player, AudioPlayerStatus.Playing, 5e3);
};

/**
 * Concatinates a list of strings into string sequences which are no longer than length.
 * Essentially takes every element, compares itself to the previous one, and if the combined length
 * is less than `length`, it concatines them into one.
 * [[a],b,c] => if a.length + b.length <= length+1 then [[a,b],c] else [[a],[b],c]
 * 
 * @param args list of strings to be concatinated with '\n'
 * @param length Max length of each resulting string segment
 * @returns List of strings where each string is no longer than `length`
 */
export const concatToMaxLengthSegments = (args: string[], length: number): string[] =>
  args.reduce((prev: string[], curr: string) => {
    if (prev.length !== 0 && (prev.at(-1)?.length ?? 0) + curr.length + 1 < length) {
      prev[prev.length - 1] = `${prev.at(-1) ?? ""}\n${curr}`;
      return prev;
    } else {
      return [...prev, curr];
    }
  }, []);
