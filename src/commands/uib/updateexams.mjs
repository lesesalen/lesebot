import { Command } from "discord.js-commando";

import { getPersistentData } from "../../utils/courses.mjs";
import logger from "../../utils/logger.mjs";

class UpdateExamsCommand extends Command {
  constructor(client) {
    super(client, {
      name: "updateexams",
      group: "uib",
      memberName: "updateexams",
      description: "Update the JSON file for exam information",
      hidden: true,
    });
  }

  async run(message) {
    logger.info({
      message: `Updating exam database`,
      userId: message.author.id,
    });

    await getPersistentData();

    return await message.say(`Okay! Exam information updated.`);
  }
}

export default UpdateExamsCommand;
