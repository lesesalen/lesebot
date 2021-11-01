import { SlashCommandBuilder, userMention } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";

import { DiscordClient, SlashCommandHandler } from "../../client";

export default class SlapCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder()
    .setName("slap")
    .setDescription("Slap a poor (potentially random) member of our server")
    .addUserOption((option) => option.setName("user").setDescription("The user to target").setRequired(false));

  async handle(interaction: CommandInteraction, client: DiscordClient): Promise<void> {
    const user = interaction.options.getMember("user");
    const authorId = userMention(interaction.user.id);

    if (user === null) {
      let randomUser = client.guild.members.cache.random();

      while (randomUser?.presence?.status !== "online" || randomUser.id === interaction.user.id) {
        randomUser = client.guild.members.cache.random();
      }

      const randomUserId = userMention(randomUser.id);
      await interaction.reply(`${authorId} slaps ${randomUserId}! Ouch...`);
    } else if (!(user instanceof GuildMember)) {
      await interaction.reply("Something went wrong");
    } else {
      const userId = userMention(user.id);
      await interaction.reply(`${authorId} slaps ${userId}! Ouch...`);
    }
  }
}
