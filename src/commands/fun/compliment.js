import { SlashCommandBuilder, userMention } from "@discordjs/builders";
import axios from "axios";
import { GuildMember } from "discord.js";

import { SlashCommandHandler } from "../../client";

export default class ComplimentCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder()
    .setName("compliment")
    .setDescription("Give your dear friends a nice little compliment")
    .addUserOption((option) => option.setName("user").setDescription("The user to target").setRequired(false));

  handle(interaction, _client) {
    axios.get(`https://complimentr.com/api`).then((resp) => {
      let compliment = resp.data.compliment.toLowerCase();
      compliment = compliment.charAt(0).toUpperCase() + compliment.slice(1);

      const user = interaction.options.getMember("user", false);
      const authorTag = userMention(interaction.user.id);
      
      if (user instanceof GuildMember) {
        const userTag = userMention(user.id);
        if (user.id === interaction.user.id)
          interaction.reply("Wow, you're really fishing for compliments...");
        else
          interaction.reply(`Hey, ${userTag}! ${compliment}. (from ${authorTag})`);
      } else {
        interaction.reply(`Wow, ${authorTag}, ${compliment.toLowerCase()}`);
      }
    });
  }
}

