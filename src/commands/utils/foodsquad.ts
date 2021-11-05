import { SlashCommandBuilder } from "@discordjs/builders";
import { CategoryChannel, CommandInteraction, GuildMember, Permissions } from "discord.js";

import { DiscordClient, SlashCommandHandler } from "../../client";
import logger from "../../utils/logger";

export default class FoodSuadCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder()
    .setName("foodsquad")
    .setDescription("Foodsquad™ - for people who loves ordering food");

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<unknown> {
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.guild) {
      logger.error("Couldn't fetch guild?");
      return interaction.editReply("Something went wrong...");
    }
    let role = (await interaction.guild.roles.fetch()).find((role) => role.name === "Foodsquad™");
    if (!role) {
      const pizzaEmoji = interaction.guild.emojis.cache.find((emoji) => emoji.name === "pizza");
      role = await interaction.guild.roles.create({
        name: "Foodsquad™",
        mentionable: true,
        icon: pizzaEmoji,
        color: "#627c7c",
      });

      await interaction.guild.channels.create("Foodsquad™", {
        type: "GUILD_TEXT",
        parent: (
          await interaction.guild.channels.fetch()
        ).find((category) => category.type === "GUILD_CATEGORY" && category.name.toUpperCase().includes("GENERAL")) as
          | CategoryChannel
          | undefined,
        topic: "Talks about ordering food and/or food in general",
        permissionOverwrites: [
          { id: interaction.guild.id, deny: [Permissions.FLAGS.VIEW_CHANNEL] },
          { id: role.id, allow: [Permissions.FLAGS.VIEW_CHANNEL] },
        ],
      });
    }

    if (!(interaction.member instanceof GuildMember)) {
      logger.error("User somehow not a member.");
      return interaction.editReply("But how did you... ?");
    }

    const hasRole = interaction.member.roles.cache.has(role.id);
    if (hasRole) {
      await interaction.member.roles.remove(role);
      return interaction.editReply("You've left the Foodsquad™ :sob:");
    } else {
      await interaction.member.roles.add(role);
      return interaction.editReply("Welcome to the Foodsquad™. :sunglasses:");
    }
  }
}
