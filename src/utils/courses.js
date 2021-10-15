import axios from "axios";
import cheerio from "cheerio";
import { promises as fs } from "fs";
import path from "path";

import { getCurrentSemester, strToJsonTyped, writeJson } from "./index.js";
import logger from "./logger.js";

const STRUCTURED_DATA_URL = "https://raw.githubusercontent.com/sondr3/course-explorer/master/structured.json";
const STRUCTURED_DATA_PATH = path.resolve(process.cwd(), "data/structured.json");
const EXAM_URL = "https://www.uib.no/en/student/108687/exam-dates-faculty-mathematics-and-natural-sciences";

let persistentData;

export const getPersistentData = async () => {
  try {
    // 1. Attempt to return local storage
    if (persistentData) return Promise.resolve(persistentData);
    // 2. Attempt to read from file
    persistentData = await readStructuredData();
    if (persistentData) return Promise.resolve(persistentData);
    // 3. If that also doesn't work, regenerate info
    await writeStructuredData();
    persistentData = await readStructuredData();
    if (persistentData) return Promise.resolve(persistentData);
  } catch (error) {
    logger.error(`Unable to fetch course information, reason: ${error}`);
  }
  logger.error("Unable to fetch course information, reason unknown.");

  return undefined;
};

export const getCourse = async (course, message) => {
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

export const getCourseExams = async (course, message) => {
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

const parseExams = ($, element) => {
  const exams = [];
  const temporaryArray = [];

  $(element).each((_index, element) => temporaryArray.push($(element).text()));

  const info = temporaryArray.flatMap((element) =>
    element
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== ""),
  );

  let exam = {};

  for (let index = 0; index < info.length; index++) {
    if (info[index].toLowerCase().includes("date")) {
      if (Object.prototype.hasOwnProperty.call(exam, "date")) {
        exams.push(exam);
        exam = {};
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

const parseCourse = ($, element) => {
  const course = {};

  const parsedTitle = $(element).find(".exam-list-title").text();
  const [code] = parsedTitle.split("/").map((s) => s.trim());
  course.id = code;

  const parsedURL = $(element).find(".exam-list-title > a").attr("href")?.trim();
  course.url = parsedURL;

  const details = $(element).find(".uib-study-exam-assessment");
  course.exams = parseExams($, details);

  return course;
};

const getRooms = async () => {
  const resp = await axios.get(
    `https://tp.data.uib.no/${process.env.UIB_OPENDATA_API_KEY ?? ""}/ws/room/2.0/allrooms.php`,
    {
      responseType: "json",
    },
  );

  return resp.data.data.map((obj) => ({ id: obj.id, roomurl: obj.roomurl, name: obj.name })); // (。_。)
};

const getCourses = async () => {
  const fs_resp = await axios.get(
    `https://fs.data.uib.no/${process.env.UIB_OPENDATA_API_KEY ?? ""}/json/littl_emne/${getCurrentSemester()}`,
    {
      responseType: "json",
    },
  );

  const fs_courses = fs_resp.data.emne.map((obj) => ({
    id: obj.emnekode,
    name_no: obj.emnenavn_bokmal,
    name_en: obj.emnenavn_engelsk,
    curriculum: obj.url,
  }));

  const exp_resp = await axios.get(STRUCTURED_DATA_URL, {
    responseType: "json",
  });

  const exp_courses = Object.entries(exp_resp.data).map(([id, obj]) => ({
    id: id,
    name_no: "",
    name_en: obj.name,
    url: obj.url,
    exams: obj.exams.length > 0 ? obj.exams : undefined,
  }));

  return [...fs_courses, ...exp_courses];
};

const getExams = async () => {
  const $ = await loadExamPage();

  const examInfos = [];

  $(".faculty-exam-list > li").each((_index, element) => {
    examInfos.push(parseCourse($, element));
  });

  return examInfos;
};

const createStructuredData = async () => {
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

export const writeStructuredData = async () => {
  const cachedData = await createStructuredData();
  await writeJson(STRUCTURED_DATA_PATH, cachedData);
};

export const readStructuredData = async () => {
  try {
    const file = await fs.readFile(STRUCTURED_DATA_PATH);
    const obj = strToJsonTyped(file.toString());

    if (obj) {
      // Discretize to map (removing duplicates)
      const roomMap = new Map(obj.rooms.map((obj) => [obj.name, { id: obj.id, roomurl: obj.roomurl }]));

      const courseMap = new Map(
        obj.courses.map((obj) => [
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
          logger.warn(`Failed to find course ${course} with error: ${error}`);
        }
      }

      return {
        rooms: roomMap,
        courses: populateCoursesWithExamInfo(courseMap, obj.exams),
      };
    }
  } catch (error) {
    logger.warn(`Error in reading saved data: ${error}`);
  }

  return undefined;
};

const loadExamPage = async () => {
  const { data } = await axios.get(EXAM_URL);
  return cheerio.load(data);
};

const populateCoursesWithExamInfo = (courses, exams) => {
  for (const exam of exams) {
    const course = courses.get(exam.id);
    if (course) {
      course.url = exam.url;
      course.exams = exam.exams;
    }
  }

  return courses;
};

const queryAdditionalCourseInfo = async (courseId) => {
  const {
    data: {
      emne: { emnenavn_bokmal, emnenavn_engelsk },
    },
  } = await axios.get(
    `https://fs.data.uib.no/${
      process.env.UIB_OPENDATA_API_KEY ?? ""
    }/json/basisinfo/emne/${courseId}/${getCurrentSemester()}`,
    {
      responseType: "json",
    },
  );

  return { name_no: emnenavn_bokmal, name_en: emnenavn_engelsk };
};
