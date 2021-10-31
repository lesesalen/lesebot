import { SlashCommandBuilder, userMention } from "@discordjs/builders";
import axios from "axios";
import { CommandInteraction, GuildMember } from "discord.js";

import { DiscordClient, SlashCommandHandler } from "../../client";

export default class InsultCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder()
    .setName("insult")
    .setDescription("Insult a 'friend'")
    .addUserOption((option) => option.setName("user").setDescription("The user to target").setRequired(false))
    .addBooleanOption((option) => option.setName("tts").setDescription("Play as Text-To-Speech").setRequired(false));

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<void> {
    let { data: insult } = await axios.get<string>(`https://insult.mattbas.org/api/insult`);
    insult = insult.toLowerCase();

    const authorTag = userMention(interaction.user.id);
    const user = interaction.options.getMember("user", false);
    const tts = interaction.options.getBoolean("tts") ?? false;

    if (user instanceof GuildMember) {
      const userTag = userMention(user.id);
      return await interaction.reply({ content: `Hey, ${userTag}! ${authorTag} thinks ${insult}`, tts: tts });
    } else {
      return await interaction.reply({ content: `Wow, ${authorTag}, ${insult}`, tts: tts });
    }
  }
}
