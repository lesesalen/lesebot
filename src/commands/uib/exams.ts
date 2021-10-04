import { Message, MessageEmbed } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";

import { Exam, getCourse } from "../../utils/courses";

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
    const courseId = inputSubject.toLowerCase();

    if (inputSubject === "") {
      return await message.reply("You need to specify the subject to ask about");
    }

    const course = await getCourse(inputSubject, message);
    if (course === undefined) {
      return await message.reply(`Sorry, no course with the code ${inputSubject} found... try again`);
    }

    if (course.exams?.length === 0 ?? true) {
      return await message.reply(`There doesn't seem to be any exams for ${inputSubject}.`);
    }

    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(courseId)
      .setURL(course.url ?? "")
      .setDescription(course.name_en);

    if (course.exams) this.buildExamEmbed(course.exams, embed);

    return await message.say(embed);
  };

  buildExamEmbed = (exams: Exam[], embed: MessageEmbed): void => {
    for (const exam of exams) {
      let fields = [];
      if (Object.prototype.hasOwnProperty.call(exam, "date")) {
        fields.push({ name: "Dato", value: exam.date, inline: true });
      }
      if (Object.prototype.hasOwnProperty.call(exam, "duration")) {
        fields.push({ name: "Varighet", value: exam.duration, inline: true });
      }
      // if (Object.prototype.hasOwnProperty.call(exam, "location")) {
      //   fields.push({ name: "Location", value: exam.location, inline: true });
      // }
      if (Object.prototype.hasOwnProperty.call(exam, "system")) {
        fields.push({ name: "Eksamensystem", value: exam.system, inline: true });
      }
      embed.addFields(fields);
      fields = [];
    }
  };
}

export default ExamCommand;
