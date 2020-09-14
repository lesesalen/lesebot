import { promises as fs } from "fs";
import globby from "globby";
import path from "path";
import logger from "./logger";

export const writeJson = async <T>(filePath: string, content: T): Promise<void> => {
  const filepath = path.resolve(filePath);
  try {
    await fs.stat(filepath);
  } catch (e) {
    logger.warn({
      message: `404: File not found`,
      file: filePath,
    });
    await fs.writeFile(filepath, "");
  }

  await fs.writeFile(path.resolve(filepath), JSON.stringify(content));
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
  } catch (e) {
    contents = [];
    logger.warn({
      message: `File had no contents`,
    });
  }
  contents.push(content);

  return contents;
};

export const sample = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const soundSamples = async (): Promise<string[]> => {
  const paths = await globby(`${path.resolve(process.cwd(), "assets")}/*.mp3`);
  return paths.map((p) => {
    const { name } = path.parse(p);
    return name;
  });
};

export const jsonToMap = <V>(jsonStr: string): Map<string, V> => {
  return new Map(JSON.parse(jsonStr));
};
