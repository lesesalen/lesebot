import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";

import { DiscordClient, SlashCommandHandler } from "../../client";
import { Exam, getCourse } from "../../utils/courses";

export default class ExamCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder()
    .setName("exam")
    .setDescription("When and where is my exam again?")
    .addStringOption((option) =>
      option.setName("subject").setDescription("Subject to inquire about").setRequired(true),
    );

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<unknown> {
    const inputSubject = interaction.options.getString("subject", true).toUpperCase().trim();
    const courseId = inputSubject.toLowerCase();

    const course = await getCourse(inputSubject);
    if (!course) {
      return interaction.reply({
        content: `Sorry, no course with the code ${inputSubject} found... try again`,
        ephemeral: true,
      });
    }

    if (!course.exams?.length) {
      return interaction.reply({
        content: `There doesn't seem to be any exams for ${inputSubject}.`,
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(courseId)
      .setURL(course.url ?? "")
      .setDescription(course.name_en);

    this.buildExamEmbed(course.exams, embed);

    return interaction.editReply({ embeds: [embed] });
  }

  buildExamEmbed(exams: Exam[], embed: MessageEmbed) {
    for (const exam of exams) {
      let fields = [];

      if (Object.prototype.hasOwnProperty.call(exam, "date")) {
        fields.push({ name: "Dato", value: exam.date, inline: true });
      }

      if (Object.prototype.hasOwnProperty.call(exam, "duration")) {
        fields.push({ name: "Varighet", value: exam.duration, inline: true });
      }

      // if (Object.prototype.hasOwnProperty.call(exam, "location")) {
      //   fields.push({ name: "Location", value: exam.location, inline: true });
      // }

      if (Object.prototype.hasOwnProperty.call(exam, "system")) {
        fields.push({ name: "Eksamensystem", value: exam.system, inline: true });
      }

      embed.addFields(fields);
      fields = [];
    }
  }
}
