import { CommandoMessage } from "discord.js-commando";

import { Course, readExamPage, readStructuredData } from "../../modules/exams";
import logger from "../../utils/logger";

export const getCourse = async (course: string, message: CommandoMessage): Promise<Course | undefined> => {
  const exams = await readStructuredData();

  if (!exams.courses.has(course)) {
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
  return exams.courses.get(course) as Course;
};

export const getExams = async (course: string, message: CommandoMessage): Promise<Course | undefined> => {
  const structured = await readStructuredData();
  const exams = await readExamPage();

  if (!exams.has(course)) {
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

  const c1 = structured.courses.get(course);
  const c2 = exams.get(course);

  if (!c1 || !c2) return;

  if (c1?.exams.length < c2?.exams.length) {
    return c2;
  }

  return c1;
};
