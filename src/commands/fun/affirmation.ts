import { SlashCommandBuilder, userMention } from "@discordjs/builders";
import axios from "axios";
import { CommandInteraction, GuildMember } from "discord.js";

import { DiscordClient, SlashCommandHandler } from "../../client";

interface AffirmationApiResponse {
  affirmation: string;
}

export default class AffirmationCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder()
    .setName("affirmation")
    .setDescription("We all need that little friendly push")
    .addUserOption((option) => option.setName("user").setDescription("The user to target").setRequired(false));

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<void> {
    const {
      data: { affirmation },
    } = await axios.get<AffirmationApiResponse>(`https://www.affirmations.dev/`);
    const user = interaction.options.getMember("user");

    if (user instanceof GuildMember) {
      const userTag = userMention(user.id);
      await interaction.reply(`Need a little lift, ${userTag}? ${affirmation}.`);
    } else {
      await interaction.reply(affirmation);
    }
  }
}
