import { promises as fs } from "fs";
import path from "path";

export const writeJson = async <T>(filePath: string, content: T): Promise<void> => {
  const quotesPath = path.resolve(filePath);
  try {
    await fs.stat(quotesPath);
  } catch (e) {
    await fs.writeFile(quotesPath, "");
  }

  const file = await fs.readFile(quotesPath);
  let contents: T[];
  try {
    contents = JSON.parse(file.toString());
  } catch (e) {
    contents = [];
  }
  contents.push(content);

  await fs.writeFile(path.resolve(quotesPath), JSON.stringify(contents));
};

export const loadJson = async <T>(filePath: string): Promise<T[]> => {
  const file = await fs.readFile(filePath);
  return JSON.parse(file.toString());
};
