import { promises as fs } from "fs";
import globby from "globby";
import path from "path";
import logger from "./logger";

export const writeJson = async <T>(filePath: string, content: T): Promise<void> => {
  const quotesPath = path.resolve(filePath);
  try {
    await fs.stat(quotesPath);
  } catch (e) {
    logger.warn({
      message: `404: File not found`,
      file: filePath,
    });
    await fs.writeFile(quotesPath, "");
  }

  await fs.writeFile(path.resolve(quotesPath), JSON.stringify(content));
};

export const loadJson = async <T>(filePath: string): Promise<T[]> => {
  const file = await fs.readFile(filePath);
  return JSON.parse(file.toString());
};

export const sample = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const soundSamples = async (): Promise<string[]> => {
  const paths = await globby(`${path.resolve(process.cwd(), "assets")}/*.mp3`);
  const fileNames = paths.map((p) => {
    const { name } = path.parse(p);
    return name;
  });

  return fileNames;
};

export const jsonToMap = <V>(jsonStr: string): Map<string, V> => {
  return new Map(JSON.parse(jsonStr));
};
