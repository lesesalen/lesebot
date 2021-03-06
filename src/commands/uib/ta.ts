import { DMChannel, Message, Role } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";

import logger from "../../utils/logger";
import { getCourse } from "../utils/courses";

class TACommand extends Command {
  constructor(client: CommandoClient) {
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

  run = async (message: CommandoMessage, { subject }: { subject: string }): Promise<Message | Message[]> => {
    if (message.channel instanceof DMChannel) {
      return await message.reply(`You need to ask for a role from the requests channel.`);
    }
    const inputSubject = subject.toUpperCase().trim();

    if (inputSubject === "") {
      return await message.reply("You need to specify the subject to ask about");
    }

    const course = await getCourse(inputSubject, message);
    if (course === undefined) {
      return await message.reply(`Sorry, no course with the code ${inputSubject} found... try again`);
    }

    const guild = message.guild;
    let role: Role | undefined;
    if (!guild.roles.cache.some((role) => role.name === `gruppeleder-${course.id.toLowerCase()}`)) {
      role = await guild.roles.create({
        data: {
          name: `gruppeleder-${course.id.toLowerCase()}`,
          hoist: true,
          mentionable: true,
          color: "RANDOM",
        },
        reason: `${message.member?.displayName ?? "unknown"} requested it`,
      });

      logger.info({
        message: `Created new role for ${course.id}`,
        userId: message.author.id,
      });
    } else {
      role = guild.roles.cache.find((role) => role.name === `gruppeleder-${course.id.toLowerCase()}`);
    }

    if (role === undefined) {
      logger.error({
        message: `Could not get role for ${course.id}`,
      });
      return await message.say(`Something went wrong... try again or tell an admin :'(`);
    }

    if (message.member?.roles.cache.has(role.id)) {
      return await message.reply(`You're already a TA in ${course.name}... now you're a double TA.`);
    } else {
      await message.member?.roles.add(role);

      logger.info({
        message: `Added ${message.member?.displayName ?? "unknown"} as TA to ${course.id}`,
        userId: message.author.id,
      });

      return await message.reply(`Congrats, you're now a TA in ${course.id}: ${course.name}`);
    }
  };
}

export default TACommand;
