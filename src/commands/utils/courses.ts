import { CommandoMessage } from "discord.js-commando";

import { Course, readExamPage, readStructuredData } from "../../modules/exams";
import logger from "../../utils/logger";

export const getCourse = async (course: string, message: CommandoMessage): Promise<Course | undefined> => {
  const exams = await readStructuredData();

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
  return exams.get(course) as Course;
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

  let c = structured.get(course);

  if (!c?.exams || c?.exams.length < 1) {
    c = exams.get(course);
  }

  return c;
};
