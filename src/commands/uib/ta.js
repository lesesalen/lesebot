import { DMChannel } from "discord.js";
import Commando from "discord.js-commando";

import { getCourse } from "../../utils/courses.js";
import logger from "../../utils/logger.js";

class TACommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "gruppeleder",
      aliases: ["ta"],
      group: "uib",
      memberName: "gruppeleder",
      description: "Add me as a TA to a course",
      argsPromptLimit: 0,
      args: [
        {
          key: "subject",
          prompt: "Subject to become TA in",
          type: "string",
          validate: undefined,
          default: "",
        },
      ],
    });
  }

  async run(message, { subject }) {
    if (message.channel instanceof DMChannel) {
      return message.reply(`You need to ask for a role from the requests channel.`);
    }

    const inputSubject = subject.toUpperCase().trim();
    const courseId = inputSubject.toLowerCase();

    if (inputSubject === "") {
      return message.reply("You need to specify the subject to ask about");
    }

    const course = await getCourse(inputSubject, message);
    if (course === undefined) {
      return message.reply(`Sorry, no course with the code ${inputSubject} found... try again`);
    }

    const guild = message.guild;

    let role;
    if (!guild.roles.cache.some((role) => role.name === `gruppeleder-${courseId}`)) {
      role = await guild.roles.create({
        data: {
          name: `gruppeleder-${courseId}`,
          hoist: true,
          mentionable: true,
          color: "RANDOM",
        },
        reason: `${message.member?.displayName ?? "unknown"} requested it`,
      });

      logger.info({
        message: `Created new role for ${courseId}`,
        userId: message.author.id,
      });
    } else {
      role = guild.roles.cache.find((role) => role.name === `gruppeleder-${courseId}`);
    }

    if (role === undefined) {
      logger.error({
        message: `Could not get role for ${courseId}`,
      });
      return message.say(`Something went wrong... try again or tell an admin :'(`);
    }

    if (message.member?.roles.cache.has(role.id)) {
      return message.reply(`You're already a TA in ${courseId}... now you're a double TA.`);
    } else {
      await message.member?.roles.add(role);

      logger.info({
        message: `Added ${message.member?.displayName ?? "unknown"} as TA to ${courseId}`,
        userId: message.author.id,
      });

      return message.reply(`Congrats, you're now a TA in ${courseId}: ${course.name_en}`);
    }
  }
}

export default TACommand;
