import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, GuildChannel, Collection } from "discord.js";
import logger from "../../utils/logger";
import { Course, readPage } from "../../modules/exams";

class RequestCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "request",
      aliases: ["fag", "emne"],
      group: "uib",
      memberName: "request",
      description: "Make channel for course x plz",
      argsPromptLimit: 0,
      args: [
        {
          key: "subject",
          prompt: "The course you need a text channel for",
          type: "string",
          validate: undefined,
          default: "",
        },
      ],
    });
  }

  run = async (message: CommandoMessage, { subject }: { subject: string }): Promise<Message | Message[]> => {
    if (subject === undefined || subject.trim() === "") {
      return await message.reply("You need to specify the subject to ask about");
    }

    const inputSubject = subject.toUpperCase().trim();

    const exams = await readPage();
    if (!exams.has(inputSubject)) {
      logger.warn({
        message: "Missing course",
        userId: message.author.id,
        subject: inputSubject,
      });
      return await message.reply(`Sorry, no course with the code ${inputSubject} found... try again`);
    }

    const course = exams.get(inputSubject) as Course;

    logger.info({
      message: "Subject was inquired about",
      userId: message.author.id,
      subject: inputSubject,
    });

    const guild = message.guild;
    const channelCache = guild.channels.cache; // Cache liste av kanaler
    // Sjekk om det finnes en kanal med samme emnekode
    const channelExits = channelCache.some((channel) => channel.name.toLowerCase() === course.code.toLowerCase());
    if (channelExits) {
      return await message.say(`A channel for ${inputSubject} already exists.`);
    } else {
      const category = this.getCategoryChannel(course, channelCache); // Finn hvilken kategori som er parent av den nye kanalen
      await message.guild.channels.create(course.code.toLowerCase(), { type: "text", parent: category });
      return await message.say(`A channel for ${inputSubject} has been created.`);
    }
    return await message.say("An error has occured");
  };

  getCategoryChannel = (course: Course, channelCache: Collection<string, GuildChannel>): GuildChannel | undefined => {
    // Matte fag
    if (course.code.includes("MAT") || course.code.includes("STAT")) {
      return channelCache.find((category) => category.name === "MAT");

      // INF Fag
    } else if (course.code.substring(0, 3) === "INF") {
      switch (course.code.charAt(3)) {
        case "1":
          return channelCache.find((category) => category.id === "744961179612610700"); // INF1xx Kategori
          break;
        case "2":
          return channelCache.find((category) => category.id === "744961214878056449"); // INF2xx Kategori
          break;
        case "3":
          return channelCache.find((category) => category.id === "744961536367525948"); // INF3xx Kategori
          break;
        default:
          break;
      }
    }
    return channelCache.find((category) => category.id === "744961383380287589"); // Default til other, f.eks med BINF
  };
}

export default RequestCommand;
