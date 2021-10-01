import axios from "axios";
import cheerio from "cheerio";
import { promises as fs } from "fs";
import path from "path";

import { jsonToMap, strToJsonTyped, writeJson } from "../utils";

// const STRUCTURED_DATA_URL = "https://raw.githubusercontent.com/sondr3/course-explorer/master/structured.json";
const STRUCTURED_DATA_PATH = path.resolve(process.cwd(), "data/structured.json");
const EXAM_URL = "https://www.uib.no/en/student/108687/exam-dates-faculty-mathematics-and-natural-sciences-autumn-2017";
const EXAM_PATH = path.resolve(process.cwd(), "data/exams.json");

export interface Course {
  id: string;
  name: string;
  url: string;
  exams: Exam[];
}

export interface Exam {
  type: string;
  date: string;
  duration: string;
  system: string;
  location?: string;
}

const parseExams = ($: cheerio.Root, element: cheerio.Cheerio): Exam[] => {
  const exams: Exam[] = [];

  const temporaryArray: string[] = [];
  $(element).each((_index, element) => temporaryArray.push($(element).text()));
  const info = temporaryArray.flatMap((element) =>
    element
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== ""),
  );

  let exam = {} as Exam;
  for (let index = 0; index < info.length; index++) {
    if (info[index].toLowerCase().includes("date")) {
      if (Object.prototype.hasOwnProperty.call(exam, "date")) {
        exams.push(exam);
        exam = {} as Exam;
      }

      exam.date = info[index + 1];
    } else if (info[index].toLowerCase().includes("duration")) {
      exam.duration = info[index + 1];
    } else if (info[index].toLowerCase().includes("examination")) {
      exam.system = `${info[index + 1]} ${info[index + 2]}`;
    } else if (info[index].toLowerCase().includes("location")) {
      exam.location = info[index + 1];
    }
  }
  exams.push(exam);

  return exams;
};

const parseCourse = ($: cheerio.Root, element: cheerio.Element): Course => {
  const course = {} as Course;

  const parsedTitle = $(element).find(".exam-list-title").text();
  const [code, title] = parsedTitle.split("/").map((s) => s.trim());
  course.id = code;
  course.name = title;

  const parsedURL = $(element).find(".exam-list-title > a").attr("href")?.trim();
  course.url = parsedURL ?? "";

  const details = $(element).find(".uib-study-exam-assessment");
  course.exams = parseExams($, details);

  return course;
};

interface RoomEntry {
  id: string;
  roomurl: string;
}

interface RoomApiEntry extends RoomEntry {
  name: string;
}

interface RoomApiResponse {
  data: RoomApiEntry[];
}

const getRooms = async (): Promise<RoomApiEntry[]> => {
  const resp = await axios.get<RoomApiResponse>(
    `https://tp.data.uib.no/${process.env.UIB_KEY as string}/ws/room/2.0/allrooms.php`,
    {
      responseType: "json",
    },
  );
  const rooms: RoomApiEntry[] = resp.data.data.map((obj) => ({ id: obj.id, roomurl: obj.roomurl, name: obj.name })); // (。_。)
  return rooms;
};

// Temporarily disabling course loading
// const getCourses = async (): Promise<[string, Course][]> => {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { data } = await axios.get<Record<string, Course>>(STRUCTURED_DATA_URL, { responseType: "json" });
//   // const map = [...new Map(Object.entries(data)).entries()];
//   return {} as [string, Course][];
// };

interface StructuredData {
  rooms: RoomApiEntry[];
}

const createStructuredData = async (): Promise<StructuredData> => {
  // Convert room data
  const rooms = await getRooms();

  return {
    rooms: rooms,
  };
};

export const writeStructuredData = async (): Promise<void> => {
  const cachedData = await createStructuredData();
  await writeJson(STRUCTURED_DATA_PATH, cachedData);
};

export const readStructuredData = async (): Promise<{
  courses: Map<string, Course>;
  rooms: Map<string, RoomEntry>;
}> => {
  const file = await fs.readFile(STRUCTURED_DATA_PATH);
  const obj = strToJsonTyped<StructuredData>(file.toString());

  // Discretize to map (removing duplicates)
  const roomMap = new Map(
    obj?.rooms.map(({ id, name, roomurl }): [string, RoomEntry] => [name, { id: id, roomurl: roomurl }]) ?? [],
  );

  return {
    courses: new Map([]),
    rooms: roomMap,
  };
};

const loadExamPage = async (): Promise<cheerio.Root> => {
  const { data } = await axios.get<string>(EXAM_URL);
  return cheerio.load(data);
};

export const parseExamPage = async (): Promise<Map<string, Course>> => {
  const $ = await loadExamPage();
  const courses = new Map();

  $(".faculty-exam-list > li").each((_index, element) => {
    const course = parseCourse($, element);
    courses.set(course.id, course);
  });

  return courses;
};

export const writeExamPage = async (): Promise<void> => {
  const exams = await parseExamPage();
  const map = [...exams.entries()];
  await writeJson(EXAM_PATH, map);
};

export const readExamPage = async (): Promise<Map<string, Course>> => {
  const file = await fs.readFile(EXAM_PATH);
  return jsonToMap(file.toString());
};
