import axios from "axios";
import cheerio from "cheerio";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

const EXAM_URL = "https://www.uib.no/en/student/108687/exam-dates-faculty-mathematics-and-natural-sciences-autumn-2017";
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

interface Exams {
  title: string;
  courses: Map<string, Course>;
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

export const parsePage = async (): Promise<Exams> => {
  const $ = await loadPage();
  const exams: Exams = { title: "", courses: new Map() };

  exams.title = $("h2").text();
  $(".faculty-exam-list > li").each((_i, elem) => {
    const course = parseCourse($, elem);
    exams.courses.set(course.code, course);
  });

  return exams;
};
