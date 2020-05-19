import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, MessageEmbed } from "discord.js";
import dateformat from "dateformat";

class WeekCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "week",
      aliases: ["uke", "ukenr"],
      group: "util",
      memberName: "week",
      description: "A random quote from our highly intelligent members",
    });
  }

  run = async (message: CommandoMessage): Promise<Message | Message[]> => {
    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .attachFiles(["./assets/blobross.png"])
      .setTitle("Week number")
      .setDescription(dateformat(new Date(), "W"))
      .setThumbnail("attachment://blobross.png")
      .setTimestamp()
      .setFooter("Don't you have a calendar?");

    return await message.say(embed);
  };
}

export default WeekCommand;
