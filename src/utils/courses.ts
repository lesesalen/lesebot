import axios from "axios";
import cheerio from "cheerio";
import { CommandoMessage } from "discord.js-commando";
import { promises as fs } from "fs";
import path from "path";

import { getCurrentSemester, strToJsonTyped, writeJson } from ".";
import logger from "./logger";

// const STRUCTURED_DATA_URL = "https://raw.githubusercontent.com/sondr3/course-explorer/master/structured.json";
const STRUCTURED_DATA_PATH = path.resolve(process.cwd(), "data/structured.json");
const EXAM_URL = "https://www.uib.no/en/student/108687/exam-dates-faculty-mathematics-and-natural-sciences-autumn-2017";

export interface Course {
  name_no: string;
  name_en: string;
  url?: string;
  curriculum?: string;
  exams: Exam[];
}

interface CourseApiEntry {
  id: string;
  name_no: string;
  name_en: string;
  curriculum?: string;
}

export interface Exam {
  type: string;
  date: string;
  duration: string;
  system: string;
  location?: string;
}

interface PersistentData {
  courses: Map<string, Course>;
  rooms: Map<string, RoomEntry>;
}

let persistentData: PersistentData | undefined;

export const getPersistentData = async (): Promise<PersistentData | undefined> => {
  // 1. Attempt to return local storage
  if (persistentData) return Promise.resolve(persistentData);

  // 2. Attempt to read from file
  persistentData = await readStructuredData();
  if (persistentData) return Promise.resolve(persistentData);

  // 3. If that also doesn't work, regenerate info
  await writeStructuredData();
  persistentData = await readStructuredData();
  if (persistentData) return Promise.resolve(persistentData);

  logger.error("Unable to fetch course information");
  return undefined;
};

export const getCourse = async (course: string, message: CommandoMessage): Promise<Course | undefined> => {
  const courseinfo = await getPersistentData();
  const courseResult = courseinfo?.courses.get(course);

  if (courseResult === undefined) {
    logger.warn({
      message: "Missing course",
      userId: message.author.id,
      subject: course,
    });

    return;
  }

  logger.info({
    message: "Subject was inquired about",
    userId: message.author.id,
    subject: course,
  });
  return courseResult;
};

export const getCourseExams = async (course: string, message: CommandoMessage): Promise<Exam[] | undefined> => {
  const courseinfo = await getPersistentData();
  const exams = courseinfo?.courses.get(course)?.exams;

  if (exams === undefined) {
    logger.warn({
      message: "Missing course",
      userId: message.author.id,
      subject: course,
    });

    return;
  }

  logger.info({
    message: "Subject was inquired about",
    userId: message.author.id,
    subject: course,
  });

  return exams;
};

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

interface CourseExamInfo {
  id: string;
  url?: string;
  exams: Exam[];
}

const parseCourse = ($: cheerio.Root, element: cheerio.Element): CourseExamInfo => {
  const course = {} as CourseExamInfo;

  const parsedTitle = $(element).find(".exam-list-title").text();
  const [code] = parsedTitle.split("/").map((s) => s.trim());
  course.id = code;

  const parsedURL = $(element).find(".exam-list-title > a").attr("href")?.trim();
  course.url = parsedURL;

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

interface CourseApiResponse {
  emne: {
    emnekode: string;
    url?: string;
    emnenavn_bokmal: string;
    emnenavn_engelsk: string;
  }[];
}

const getRooms = async (): Promise<RoomApiEntry[]> => {
  const resp = await axios.get<RoomApiResponse>(
    `https://tp.data.uib.no/${process.env.UIB_OPENDATA_API_KEY ?? ""}/ws/room/2.0/allrooms.php`,
    {
      responseType: "json",
    },
  );

  return resp.data.data.map((obj) => ({ id: obj.id, roomurl: obj.roomurl, name: obj.name })); // (。_。)
};

// Temporarily disabling course loading
const getCourses = async (): Promise<CourseApiEntry[]> => {
  const resp = await axios.get<CourseApiResponse>(
    `https://fs.data.uib.no/${process.env.UIB_OPENDATA_API_KEY ?? ""}/json/littl_emne/${getCurrentSemester()}`,
    {
      responseType: "json",
    },
  );

  return resp.data.emne.map((obj) => ({
    id: obj.emnekode,
    name_no: obj.emnenavn_bokmal,
    name_en: obj.emnenavn_engelsk,
    curriculum: obj.url,
  }));
};

const getExams = async (): Promise<CourseExamInfo[]> => {
  const $ = await loadExamPage();

  const examInfos: CourseExamInfo[] = [];

  $(".faculty-exam-list > li").each((_index, element) => {
    examInfos.push(parseCourse($, element));
  });

  return examInfos;
};

interface StructuredData {
  rooms: RoomApiEntry[];
  courses: CourseApiEntry[];
  exams: CourseExamInfo[];
}

const createStructuredData = async (): Promise<StructuredData> => {
  // Convert room data
  const rooms = await getRooms();
  const courses = await getCourses();
  const exams = await getExams();

  return {
    rooms: rooms,
    courses: courses,
    exams: exams,
  };
};

export const writeStructuredData = async (): Promise<void> => {
  const cachedData = await createStructuredData();
  await writeJson(STRUCTURED_DATA_PATH, cachedData);
};

export const readStructuredData = async (): Promise<
  | {
      courses: Map<string, Course>;
      rooms: Map<string, RoomEntry>;
    }
  | undefined
> => {
  try {
    const file = await fs.readFile(STRUCTURED_DATA_PATH);
    const obj = strToJsonTyped<StructuredData>(file.toString());
    if (obj) {
      // Discretize to map (removing duplicates)
      const roomMap = new Map(
        obj.rooms.map((obj): [string, RoomEntry] => [obj.name, { id: obj.id, roomurl: obj.roomurl }]),
      );
      const courseMap = new Map(
        obj.courses.map((obj): [string, Course] => [
          obj.id,
          { name_no: obj.name_no, name_en: obj.name_en, curriculum: obj.curriculum, exams: [], url: undefined },
        ]),
      );
      return {
        rooms: roomMap,
        courses: populateCoursesWithExamInfo(courseMap, obj.exams),
      };
    }
  } catch (error: unknown) {
    logger.warn(`Error in reading saved data: ${error as string}`);
  }
  return undefined;
};

const loadExamPage = async (): Promise<cheerio.Root> => {
  const { data } = await axios.get<string>(EXAM_URL);
  return cheerio.load(data);
};

const populateCoursesWithExamInfo = (courses: Map<string, Course>, exams: CourseExamInfo[]) => {
  for (const exam of exams) {
    const course = courses.get(exam.id);
    if (course) {
      course.url = exam.url;
      course.exams = exam.exams;
    }
  }

  return courses;
};
