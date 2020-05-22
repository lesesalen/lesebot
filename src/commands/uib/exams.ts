import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";
import logger from "../../utils/logger";
import { parsePage } from "../../modules/exams";

class ExamCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "exam",
      aliases: ["exams", "eksamen"],
      group: "uib",
      memberName: "exam",
      description: "When and where is my exam again?",
      argsPromptLimit: 0,
      args: [
        {
          key: "subject",
          prompt: "Subject to inquire about",
          type: "string",
          validate: undefined,
          default: "",
        },
      ],
    });
  }

  run = async (message: CommandoMessage, { subject }: { subject: string }): Promise<Message | Message[]> => {
    const inputSubject = subject.toUpperCase().trim();

    if (inputSubject === "") {
      return await message.reply("You need to specify the subject to ask about");
    }

    const exams = await parsePage();
    if (!exams.courses.has(inputSubject)) {
      logger.warn({
        message: "Missing course",
        userId: message.author.id,
        subject: inputSubject,
      });

      return await message.reply(`Sorry, no course with the code ${inputSubject} found... try again`);
    }

    const course = exams.courses.get(inputSubject);

    logger.info({
      message: "Subject was inquired about",
      userId: message.author.id,
      subject: inputSubject,
    });

    await message.say(`${course?.code}: ${course?.title}\nAssessment: ${course?.assessment}`);
    return await message.say(
      `Exam: ${course?.exams[0].date} at ${course?.exams[0].location} for ${course?.exams[0].duration}`,
    );
  };
}

export default ExamCommand;
