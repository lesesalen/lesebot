import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import path from "path";

import { DiscordClient, SlashCommandHandler } from "../../client";
import { concatToMaxLengthSegments, soundSamples } from "../../utils/utils";

export default class ListSoundCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder().setName("listsound").setDescription("List of all the available 'sounds'");

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<unknown> {
    const paths = await soundSamples();
    await interaction.reply({ content: "Here are all the sound files:", ephemeral: true });
    const replies = concatToMaxLengthSegments(
      paths.map((p) => `> ${path.basename(p)}`),
      2000,
    );
    console.log(replies.length);
    for (const reply of replies) await interaction.followUp({ content: reply, ephemeral: true });

    return interaction.followUp({ content: "To run do `/sound <name>`", ephemeral: true });
  }
}
