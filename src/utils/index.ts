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

  const file = await fs.readFile(quotesPath);
  let contents: T[];
  try {
    contents = JSON.parse(file.toString());
  } catch (e) {
    contents = [];
    logger.warn({
      message: `File had no contents`,
    });
  }
  contents.push(content);

  await fs.writeFile(path.resolve(quotesPath), JSON.stringify(contents));
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
