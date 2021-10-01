import { Message } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";

import { writeStructuredData } from "../../utils/courses";
import logger from "../../utils/logger";

class UpdateExamsCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "updateexams",
      group: "uib",
      memberName: "updateexams",
      description: "Update the JSON file for exam information",
      hidden: true,
    });
  }

  run = async (message: CommandoMessage): Promise<Message | Message[]> => {
    logger.info({
      message: `Updating exam database`,
      userId: message.author.id,
    });

    await writeStructuredData();

    return await message.say(`Okay! Exam information updated.`);
  };
}

export default UpdateExamsCommand;
