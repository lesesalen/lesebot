import { SlashCommandBuilder, userMention } from "@discordjs/builders";
import axios from "axios";
import { CommandInteraction, GuildMember } from "discord.js";

import { DiscordClient, SlashCommandHandler } from "../../client";

interface ComplimentApiResponse {
  compliment: string;
}

export default class ComplimentCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder()
    .setName("compliment")
    .setDescription("Give your dear friends a nice little compliment")
    .addUserOption((option) => option.setName("user").setDescription("The user to target").setRequired(false));

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<void> {
    const resp = await axios.get<ComplimentApiResponse>(`https://complimentr.com/api`);
    let compliment = resp.data.compliment.toLowerCase();
    compliment = compliment.charAt(0).toUpperCase() + compliment.slice(1);

    const user = interaction.options.getMember("user", false);
    const authorTag = userMention(interaction.user.id);

    if (user instanceof GuildMember) {
      const userTag = userMention(user.id);
      if (user.id === interaction.user.id) return interaction.reply("Wow, you're really fishing for compliments...");
      else return interaction.reply(`Hey, ${userTag}! ${compliment}. (from ${authorTag})`);
    } else {
      return interaction.reply(`Wow, ${authorTag}, ${compliment.toLowerCase()}`);
    }
  }
}
