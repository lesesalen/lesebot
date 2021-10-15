import axios from "axios";
import { promises as fs } from "fs";
import globby from "globby";
import path from "path";

import logger from "./logger.js";

export const writeJson = async (filePath, content) => {
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

export const loadJson = async (filePath) => {
  const file = await fs.readFile(filePath);
  return JSON.parse(file.toString());
};

export const mergeJson = async (filePath, content) => {
  const file = await fs.readFile(filePath);
  let contents;

  try {
    contents = JSON.parse(file.toString());
  } catch {
    contents = [];
    logger.warn({
      message: `File had no contents`,
    });
  }

  contents.push(content);

  return contents;
};

export const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};
export const soundSamples = async () => {
  const paths = await globby(`${path.resolve(process.cwd(), "assets")}/*.mp3`);
  return paths.map((p) => {
    const { name } = path.parse(p);
    return name;
  });
};

export const jsonToMap = (jsonString) => {
  return new Map(JSON.parse(jsonString));
};

// Checks if object is instance of T (only works on non-nullable types)
const isInterface = (param) => {
  return Object.entries(param).every(([, value]) => value !== "undefined");
};

// Takes a typeguard and safely parses the string to json
export const strToJsonTyped = (jsonString) => {
  const result = JSON.parse(jsonString);
  return isInterface(result) ? result : undefined;
};

export const getCurrentSemester = () => {
  const current = new Date();
  const m = current.getMonth();
  const y = current.getFullYear();
  return `${y}${m < 6 ? "H" : "V"}`;
};

export const randomNumber = async (min, max) => {
  const request = await axios.post("https://api.random.org/json-rpc/2/invoke", {
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
