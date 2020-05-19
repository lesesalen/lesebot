import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";

class RiggedCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "rigged",
      group: "fun",
      memberName: "rigged",
      description: "YOU DIDN'T WIN?! MUST BE A RIGGED SYSTEM",
    });
  }

  run = async (message: CommandoMessage): Promise<Message | Message[]> => {
    return await message.say(
      `En feil har oppstått. Grunnet lav tilgang på økonomiske ressurser trenger vi hjelp til å ordne opp i feilen. Vi tar imot _frivillige donasjoner_ på **2188** på vipps.`,
    );
  };
}

export default RiggedCommand;
