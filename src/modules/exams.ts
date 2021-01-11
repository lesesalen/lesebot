import axios from "axios";
import cheerio from "cheerio";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { promises as fs } from "fs";
import path from "path";

import { jsonToMap, writeJson } from "../utils";

const EXAM_URL = "https://www.uib.no/en/student/108687/exam-dates-faculty-mathematics-and-natural-sciences-autumn-2017";
const EXAM_PATH = path.resolve(process.cwd(), "data/exams.json");

dayjs.extend(customParseFormat);

export interface Course {
  code: string;
  title: string;
  url: string;
  assessment: string;
  exams: Exam[];
}

export interface Exam {
  date: Date;
  duration?: string;
  location?: string;
  system?: string;
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

      exam.date = dayjs(info[index + 1], "DD.MM.YYYY, HH:mm").toDate();
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
  course.code = code;
  course.title = title;

  const parsedURL = $(element).find(".exam-list-title > a").attr("href")?.trim();
  course.url = parsedURL ?? "";

  const parsedAssessment = $($(element).find("h3")[1]).text();
  course.assessment = parsedAssessment.slice(parsedAssessment.lastIndexOf(":") + 1, parsedAssessment.length).trim();

  const details = $(element).find(".uib-study-exam-assessment");
  course.exams = parseExams($, details);

  return course;
};

const loadPage = async (): Promise<cheerio.Root> => {
  const { data } = await axios.get<string>(EXAM_URL);
  return cheerio.load(data);
};

export const parsePage = async (): Promise<Map<string, Course>> => {
  const $ = await loadPage();
  const courses = new Map();

  $(".faculty-exam-list > li").each((_index, element) => {
    const course = parseCourse($, element);
    courses.set(course.code, course);
  });

  return courses;
};

export const writePage = async (): Promise<void> => {
  const exams = await parsePage();
  const map = [...exams.entries()];
  await writeJson(EXAM_PATH, map);
};

export const readPage = async (): Promise<Map<string, Course>> => {
  const file = await fs.readFile(EXAM_PATH);
  return jsonToMap(file.toString());
};
