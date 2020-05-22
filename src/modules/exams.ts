import axios from "axios";
import cheerio from "cheerio";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import path from "path";
import { promises as fs } from "fs";

import { writeJson, jsonToMap } from "../utils";

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

const parseExams = ($: CheerioStatic, elem: Cheerio): Exam[] => {
  const exams: Exam[] = [];

  const tempArr: string[] = [];
  $(elem).each((_i, elem) => tempArr.push($(elem).text()));
  const info = tempArr.flatMap((e) =>
    e
      .split("\n")
      .map((e) => e.trim())
      .filter((e) => e !== ""),
  );

  let exam = {} as Exam;
  for (let i = 0; i < info.length; i++) {
    if (info[i].toLowerCase().includes("date")) {
      if (Object.prototype.hasOwnProperty.call(exam, "date")) {
        exams.push(exam);
        exam = {} as Exam;
      }

      exam.date = dayjs(info[i + 1], "DD.MM.YYYY, HH:mm").toDate();
    } else if (info[i].toLowerCase().includes("duration")) {
      exam.duration = info[i + 1];
    } else if (info[i].toLowerCase().includes("examination")) {
      exam.system = `${info[i + 1]} ${info[i + 2]}`;
    } else if (info[i].toLowerCase().includes("location")) {
      exam.location = info[i + 1];
    }
  }
  exams.push(exam);

  return exams;
};

const parseCourse = ($: CheerioStatic, elem: CheerioElement): Course => {
  const course = {} as Course;

  const parsedTitle = $(elem).find(".exam-list-title").text();
  const [code, title] = parsedTitle.split("/").map((s) => s.trim());
  course.code = code;
  course.title = title;

  const parsedURL = $(elem).find(".exam-list-title > a").attr("href")?.trim();
  course.url = parsedURL ?? "";

  const parsedAssesment = $($(elem).find("h3")[1]).text();
  course.assessment = parsedAssesment.slice(parsedAssesment.lastIndexOf(":") + 1, parsedAssesment.length).trim();

  const details = $(elem).find(".uib-study-exam-assessment");
  course.exams = parseExams($, details);

  return course;
};

const loadPage = async (): Promise<CheerioStatic> => {
  const { data } = await axios.get(EXAM_URL);
  return cheerio.load(data);
};

export const parsePage = async (): Promise<Map<string, Course>> => {
  const $ = await loadPage();
  const courses = new Map();

  $(".faculty-exam-list > li").each((_i, elem) => {
    const course = parseCourse($, elem);
    courses.set(course.code, course);
  });

  return courses;
};

export const writePage = async (): Promise<void> => {
  const exams = await parsePage();
  const map = Array.from(exams.entries());
  await writeJson(EXAM_PATH, map);
};

export const readPage = async (): Promise<Map<string, Course>> => {
  const file = await fs.readFile(EXAM_PATH);
  return jsonToMap(file.toString());
};
