import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";

import { DiscordClient, SlashCommandHandler } from "../../client";
import { getCourse } from "../../utils/courses";
import logger from "../../utils/logger";

export default class EndTaCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder()
    .setName("sluttgruppeleder")
    .setDescription("Remove me as a group leader for a course")
    .addStringOption((option) =>
      option.setName("subject").setDescription("Subject to end TA status in").setRequired(true),
    );

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<void> {
    const inputSubject = interaction.options.getString("subject", true).toUpperCase().trim();
    const courseId = inputSubject.toLowerCase();

    const course = await getCourse(inputSubject);
    if (!course) {
      return interaction.reply({
        content: `Sorry, no course with the code ${inputSubject} found... try again`,
        ephemeral: true,
      });
    }

    const guild = interaction.guild;
    if (!guild) {
      logger.error("Command was somehow performed outside of guild");
      return;
    }
    const user = interaction.member;
    if (!(user instanceof GuildMember)) {
      logger.error("User is somehow not a guild member");
      return;
    }

    const role = guild.roles.cache.find((role) => role.name === `gruppeleder-${courseId}`);
    if (!role) {
      logger.error({
        message: `Could not get role for ${courseId}`,
      });
      return interaction.reply({
        content: `It seems no one is a TA in this course, please make sure you wrote it correctly or tell an admin`,
        ephemeral: true,
      });
    }

    if (!user.roles.cache.has(role.id)) {
      return interaction.reply(`You're not a TA in ${courseId}`);
    } else {
      await user.roles.remove(role);

      logger.info(`Removed ${user.displayName} as a TA from ${courseId}`);

      return interaction.reply(`You are now no longer a TA in ${courseId}: ${course.name_en}`);
    }
  }
}
