import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";
import globby from "globby";
import path from "path";

class ListSoundCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "listsound",
      aliases: ["ls"],
      group: "sound",
      memberName: "listsound",
      description: "List of all the available 'sounds'",
    });
  }

  run = async (message: CommandoMessage): Promise<Message | Message[]> => {
    await message.direct("Here are all the sound files!");
    const paths = await globby(`${path.resolve(process.cwd(), "assets")}/*.mp3`);
    const reply = paths
      .map((p) => {
        const { name, ext } = path.parse(p);
        return `> ${name}${ext}`;
      })
      .join("\n");
    return await message.direct(reply);
  };
}

export default ListSoundCommand;
