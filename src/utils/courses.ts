import axios from "axios";
import { promises as fs } from "fs";
import path from "path";

import { getEnvVar } from "../client";
import logger from "./logger";
import { getCurrentSemester, strToJsonTyped, writeJson } from "./utils";

const STRUCTURED_DATA_URL = "https://raw.githubusercontent.com/sondr3/course-explorer/master/structured.json";
const STRUCTURED_DATA_PATH = path.resolve(process.cwd(), "data/structured.json");

export interface Course {
  name_no: string;
  name_en: string;
  url?: string;
  curriculum?: string;
  exams?: Exam[];
}

interface ExtendedCourse extends Course {
  id: string;
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

export const deletePersistentData = (): void => {
  persistentData = undefined;
};

export const getPersistentData = async (): Promise<PersistentData | undefined> => {
  logger.warn(path.resolve(process.cwd(), "data"));
  // 1. Attempt to return local storage
  if (persistentData) return persistentData;

  // 2. Attempt to read from file
  try {
    persistentData = await readStructuredData();
    if (persistentData) return persistentData;
  } catch {
    logger.info("No stored data, attempting update...");
  }

  try {
    // 3. If that also doesn't work, regenerate info
    await writeStructuredData();
    persistentData = await readStructuredData();
    if (persistentData) return persistentData;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    logger.error(`Unable to fetch course information, reason: ${error}`);
  }

  logger.error("Unable to fetch course information, reason unknown.");
  return;
};

export const getCourse = async (course: string): Promise<Course | undefined> => {
  const courseInfo = await getPersistentData();
  const courseResult = courseInfo?.courses.get(course);

  if (courseResult === undefined) {
    logger.warn({
      message: "Missing course",
      // userId: message.author.id,
      subject: course,
    });

    return;
  }

  logger.info({
    message: "Subject was inquired about",
    // userId: message.author.id,
    subject: course,
  });
  return courseResult;
};

export const getCourseExams = async (course: string, message: unknown): Promise<Exam[] | undefined> => {
  const courseInfo = await getPersistentData();
  const exams = courseInfo?.courses.get(course)?.exams;
  console.log(message);

  if (exams === undefined) {
    logger.warn({
      message: "Missing course",
      // userId: message.author.id,
      subject: course,
    });

    return;
  }

  logger.info({
    message: "Subject was inquired about",
    // userId: message.author.id,
    subject: course,
  });

  return exams;
};

interface CourseExamInfo {
  id: string;
  url?: string;
  exams: Exam[];
}

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

interface CourseAPIResponse {
  emne: {
    emnekode: string;
    url?: string;
    emnenavn_bokmal: string;
    emnenavn_engelsk: string;
  }[];
}

interface CourseExplorerAPIResponse {
  id: string;
  name: string;
  url: string;
  exams: {
    type: string;
    date: string;
    duration: string;
    system: string;
  }[];
}

const getRooms = async (): Promise<RoomApiEntry[]> => {
  const key = getEnvVar("UIB_OPENDATA_API_KEY");
  const resp = await axios.get<RoomApiResponse>(`https://tp.data.uib.no/${key}/ws/room/2.0/allrooms.php`, {
    responseType: "json",
  });

  return resp.data.data.map((obj) => ({ id: obj.id, roomurl: obj.roomurl, name: obj.name })); // (。_。)
};

const getCourses = async (): Promise<ExtendedCourse[]> => {
  try {
    const key = getEnvVar("UIB_OPENDATA_API_KEY");
    const fs_resp = await axios.get<CourseAPIResponse>(
      `https://fs.data.uib.no/${key}/json/littl_emne/${getCurrentSemester()}`,
      {
        responseType: "json",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const fs_courses = fs_resp.data.emne.map(
      (obj): ExtendedCourse => ({
        id: obj.emnekode,
        name_no: obj.emnenavn_bokmal,
        name_en: obj.emnenavn_engelsk,
        curriculum: obj.url,
      }),
    );

    const exp_resp = await axios.get<Record<string, CourseExplorerAPIResponse>>(STRUCTURED_DATA_URL, {
      responseType: "json",
    });

    const exp_courses = Object.entries(exp_resp.data).map(
      ([id, obj]): ExtendedCourse => ({
        id: id,
        name_no: "",
        name_en: obj.name,
        url: obj.url,
        exams: obj.exams.length > 0 ? obj.exams : undefined,
      }),
    );

    return [...fs_courses, ...exp_courses];
  } catch (e) {
    logger.error(e);
    return [];
  }
};

interface StructuredData {
  rooms: RoomApiEntry[];
  courses: ExtendedCourse[];
  exams: CourseExamInfo[];
}

const createStructuredData = async (): Promise<StructuredData> => {
  // Convert room data
  try {
    const rooms = await getRooms();
    const courses = await getCourses();

    return {
      rooms: rooms,
      courses: courses,
      exams: [],
    };
  } catch (err: unknown) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    logger.error(`Unable to fetch course information, reason: ${err}`);
    return {
      rooms: [],
      courses: [],
      exams: [],
    };
  }
};

export const writeStructuredData = async (): Promise<void> => {
  const cachedData = await createStructuredData();
  await fs.mkdir(path.resolve(process.cwd(), "data"), { recursive: true });
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
          { name_no: obj.name_no, name_en: obj.name_en, curriculum: obj.curriculum, exams: obj.exams, url: obj.url },
        ]),
      );

      // Fetch missing courses not found by getCourses()
      const missingCourses = obj.exams.map(({ id }) => id).filter((id) => !courseMap.has(id));
      for (const course of missingCourses) {
        try {
          const additionalData = await queryAdditionalCourseInfo(course);
          courseMap.set(course, additionalData);
        } catch (error) {
          logger.warn(`Failed to find course ${course} with error: ${error as string}`);
        }
      }

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

interface SingularCourseAPIResponse {
  emne: {
    emnekode: string;
    emnenavn_bokmal: string;
    emnenavn_engelsk: string;
  };
}

const queryAdditionalCourseInfo = async (courseId: string): Promise<Course> => {
  const {
    data: {
      emne: { emnenavn_bokmal, emnenavn_engelsk },
    },
  } = await axios.get<SingularCourseAPIResponse>(
    `https://fs.data.uib.no/${
      process.env.UIB_OPENDATA_API_KEY ?? ""
    }/json/basisinfo/emne/${courseId}/${getCurrentSemester()}`,
    {
      responseType: "json",
    },
  );

  return { name_no: emnenavn_bokmal, name_en: emnenavn_engelsk };
};
