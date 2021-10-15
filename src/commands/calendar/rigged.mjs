import Commando from "discord.js-commando";

import logger from "../../utils/logger.mjs";

class RiggedCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "rigged",
      group: "fun",
      memberName: "rigged",
      description: "YOU DIDN'T WIN?! MUST BE A RIGGED SYSTEM",
    });
  }

  async run(message) {
    logger.info({
      message: "REE",
      userId: message.author.id,
    });

    return await message.say(
      `En feil har oppstått. Grunnet lav tilgang på økonomiske ressurser trenger vi hjelp til å ordne opp i feilen. Vi tar imot _frivillige donasjoner_ på **2188** på vipps.`,
    );
  }
}

export default RiggedCommand;
