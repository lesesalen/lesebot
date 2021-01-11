import { CommandoMessage } from "discord.js-commando";

import { Course, readPage } from "../../modules/exams";
import logger from "../../utils/logger";

export const getCourse = async (course: string, message: CommandoMessage): Promise<Course | undefined> => {
  const exams = await readPage();

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
