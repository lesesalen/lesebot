import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import path from "path";

import { DiscordClient, SlashCommandHandler } from "../../client";
import { soundSamples } from "../../utils/utils";

export default class ListSoundCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder().setName("listsound").setDescription("List of all the available 'sounds'");

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<void> {
    const paths = await soundSamples();
    await interaction.reply({ content: "Here are all the sound files:", ephemeral: true });
    const replies = splitToSnippets(
      paths.map((p) => `> ${path.basename(p)}`),
      2000,
    );
    for (const reply of replies) await interaction.followUp({ content: reply, ephemeral: true });

    await interaction.followUp({ content: "To run do `/sound <name>`", ephemeral: true });
  }
}

const splitToSnippets = (args: string[], length: number): string[] => {
  const snippets = [];
  let temp = "";
  for (const arg of args) {
    if (temp.length + arg.length + 1 < length) {
      temp += arg + "\n";
    } else {
      snippets.push(temp);
      temp = "";
    }
  }
  if (temp.length !== 0) snippets.push(temp);

  return snippets;
};
