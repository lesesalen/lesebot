import Commando from "discord.js-commando";

import { getPersistentData } from "../../utils/courses.js";
import logger from "../../utils/logger.js";

class UpdateExamsCommand extends Commando.Command {
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