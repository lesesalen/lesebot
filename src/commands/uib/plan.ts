import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, MessageEmbed } from "discord.js";
import dateformat from "dateformat";

class RequestCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "plan",
      aliases: ["courseplan"],
      group: "uib",
      memberName: "plan",
      description: "Get this weeks courseplan for a given subject",
      argsPromptLimit: 0,
      args: [
        {
          key: "subject",
          prompt: "The course you want to know about",
          type: "string",
          validate: undefined,
          default: "",
        },
      ],
    });
  }

  run = async (message: CommandoMessage, { subject }: { subject: string }): Promise<Message | Message[]> => {
    if (subject === undefined || subject.trim() === "") {
      return await message.reply("You need to specify a subject.");
    }

    if (subject.toUpperCase() === "INF244") {
      const embeded = new MessageEmbed()
        .setColor("#cf3c3a")
        .setTitle("INF244")
        .setDescription("Courseplan for week " + dateformat(new Date(), "W"))
        .setThumbnail("https://greenice.w.uib.no/files/2014/08/Logo-Uib.jpg")
        .addFields(
          { name: "This week we will go through", value: "Nothing, see you next week" },
          { name: "\u200B", value: "\u200B" },
          { name: "\u200B", value: "\u200B" },
        )
        .setTimestamp();
      return await message.replyEmbed(embeded);
    }
    return await message.say("We don't have any data for that course.");
  };
}

export default RequestCommand;
