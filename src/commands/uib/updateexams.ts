import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";

import logger from "../../utils/logger";
import { writePage } from "../../modules/exams";

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

    await writePage();

    return await message.say(`Okay! Exam information updated.`);
  };
}

export default UpdateExamsCommand;
