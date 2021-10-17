import axios from "axios";
import { promises as fs } from "fs";
import { globby } from "globby";
import path from "path";

import { RandomGenerateIntegers } from "../types";
import { logger } from "./logger";

export * from "./courses";
export * from "./logger";

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

export const soundSamples = async (): Promise<string[]> => {
  const paths = await globby(`${path.resolve(process.cwd(), "assets")}/*.mp3`);
  return paths.map((p) => {
    const { name } = path.parse(p);
    return name;
  });
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
      apiKey: process.env.RANDOM_KEY,
      n: 1,
      min: min,
      max: max,
      replacement: false,
    },
    id: 42,
  });

  return request.data.result.random.data[0];
};
