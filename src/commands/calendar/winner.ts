import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";
import { sample } from "../../utils";

class WinnerCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "calendar",
      aliases: ["kalender"],
      group: "fun",
      memberName: "calendar",
      description: "Choose a random member of your voice channel to win!",
    });
  }

  run = async (message: CommandoMessage): Promise<Message | Message[]> => {
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return await message.reply("You need to be in a voice channel to use this command...");
    } else {
      const winner = sample(voiceChannel.members.array());

      const reply = await message.say(`And the winner is... <@${winner.user.id}>`);
      if (reply instanceof Message) {
        const ree = this.client.emojis.cache.find((e) => e.name === "ree");
        await reply.react(ree ?? "🔥");
        await reply.react("🎉");
      }

      return reply;
    }
  };
}

export default WinnerCommand;
