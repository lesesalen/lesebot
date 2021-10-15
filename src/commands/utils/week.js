import dateformat from "dateformat";
import { MessageEmbed } from "discord.js";
import Commando from "discord.js-commando";

class WeekCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "week",
      aliases: ["uke", "ukenr"],
      group: "util",
      memberName: "week",
      description: "What week is it again? Man, I wish I had a calendar",
    });
  }

  async run(message) {
    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .attachFiles(["./assets/blobross.png"])
      .setTitle("Week number")
      .setDescription(dateformat(new Date(), "W"))
      .setThumbnail("attachment://blobross.png")
      .setTimestamp()
      .setFooter("Don't you have a calendar?");

    return await message.say(embed);
  }
}

export default WeekCommand;
