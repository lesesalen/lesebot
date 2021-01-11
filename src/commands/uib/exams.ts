import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, MessageEmbed } from "discord.js";
import { Course } from "../../modules/exams";
import dateFormat from "dateformat";
import { getCourse } from "../utils/courses";

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

    const course = await getCourse(inputSubject, message);
    if (course === null) {
      return await message.reply(`Sorry, no course with the code ${inputSubject} found... try again`);
    }

    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(course?.code)
      .setURL(course?.url ?? "")
      .setDescription(course?.title)
      .addField("Assessment", course.assessment);

    this.buildExamEmbed(course, embed);

    return await message.say(embed);
  };

  buildExamEmbed = (course: Course, embed: MessageEmbed): void => {
    for (const exam of course.exams) {
      let fields = [];
      if (Object.prototype.hasOwnProperty.call(exam, "date")) {
        fields.push({ name: "Date", value: dateFormat(exam.date, "fullDate"), inline: true });
      }
      if (Object.prototype.hasOwnProperty.call(exam, "duration")) {
        fields.push({ name: "Duration", value: exam.duration, inline: true });
      }
      if (Object.prototype.hasOwnProperty.call(exam, "location")) {
        fields.push({ name: "Location", value: exam.location, inline: true });
      }
      if (Object.prototype.hasOwnProperty.call(exam, "system")) {
        fields.push({ name: "System", value: exam.system, inline: true });
      }
      embed.addFields(fields);
      fields = [];
    }
  };
}

export default ExamCommand;
