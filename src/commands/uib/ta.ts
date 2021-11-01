import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, Role } from "discord.js";

import { DiscordClient, SlashCommandHandler } from "../../client";
import { getCourse } from "../../utils/courses";
import logger from "../../utils/logger.js";

export default class TACommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder()
    .setName("gruppeleder") // .setAlias("ta")
    .setDescription("Add me as a TA to a course")
    .addStringOption((option) => option.setName("subject").setDescription("Subject to become TA in").setRequired(true));

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<void> {
    const inputSubject = interaction.options.getString("subject", true).toUpperCase().trim();
    const courseId = inputSubject.toLowerCase();

    const course = await getCourse(inputSubject);
    if (!course) {
      return await interaction.reply({
        content: `Sorry, no course with the code ${inputSubject} found... try again`,
        ephemeral: true,
      });
    }

    const guild = interaction.guild;
    const user = interaction.member;
    if (!(user instanceof GuildMember)) {
      logger.error("User is somehow not a guild member...");
      return;
    }

    let role: Role;
    if (!guild.roles.cache.some((role) => role.name === `gruppeleder-${courseId}`)) {
      role = await guild.roles.create({
        name: `gruppeleder-${courseId}`,
        hoist: true,
        mentionable: true,
        color: "RANDOM",
        reason: `${user.displayName} requested it`,
      });

      logger.info(`Created new role for ${courseId}`);
    } else {
      role = guild.roles.cache.find((role) => role.name === `gruppeleder-${courseId}`);
    }

    if (!role) {
      logger.error({
        message: `Could not get role for ${courseId}`,
      });
      return await interaction.reply({
        content: `Something went wrong... try again or tell an admin :'(`,
        ephemeral: true,
      });
    }

    if (user.roles.cache.has(role.id)) {
      return await interaction.reply(`You're already a TA in ${courseId}... now you're a double TA!`);
    } else {
      await user.roles.add(role);

      logger.info(`Added ${user.displayName} as TA to ${courseId}`);

      return await interaction.reply(`Congrats, you're now a TA in ${courseId}: ${course.name_en}`);
    }
  }
}
