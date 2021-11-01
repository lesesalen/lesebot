import { SlashCommandBuilder } from "@discordjs/builders";
import { CategoryChannel, Collection, CommandInteraction, GuildChannel, ThreadChannel } from "discord.js";

import { DiscordClient, SlashCommandHandler } from "../../client";
import { getCourse } from "../../utils/courses.js";
import logger from "../../utils/logger";

export default class RequestCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder()
    .setName("request") // .setAlias("fag", "emne")
    .setDescription("Make channel for course x plz")
    .addStringOption((option) =>
      option.setName("subject").setDescription("The course you need a text channel for").setRequired(true),
    );

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<void> {
    const subject = interaction.options.getString("subject", true);

    const inputSubject = subject.toUpperCase().trim();
    const courseId = inputSubject.toLowerCase();
    const course = await getCourse(inputSubject);

    if (!course) {
      return await interaction.reply(`Sorry, no course with the code ${inputSubject} found... try again`);
    }

    const guild = interaction.guild;
    const channelCache = guild?.channels.cache; // Cache liste av kanaler
    if (channelCache) {
      // Sjekk om det finnes en kanal med samme emnekode
      const channelExits = channelCache.some((channel) => channel.name.toLowerCase() === courseId);

      if (channelExits) {
        return await interaction.reply(`A channel for ${inputSubject} already exists.`);
      } else {
        const category = getCategoryChannel(inputSubject, channelCache); // Finn hvilken kategori som er parent av den nye kanalen
        if (category) {
          await interaction.deferReply();
          await interaction.guild?.channels.create(courseId, { type: "GUILD_TEXT", parent: category });
          await interaction.editReply(`A channel for ${inputSubject} has been created.`);
        } else {
          logger.error(`Could'nt find channel category for channel ${inputSubject}`);
          return await interaction.reply(`Failed to create channel for ${inputSubject}. :(`);
        }
      }
    } else {
      throw "Could'nt fetch guild channels";
    }
  }
}

const getCategoryChannel = (
  inputSubject: string,
  channelCache: Collection<string, GuildChannel | ThreadChannel>,
): CategoryChannel | undefined => {
  const channels = channelCache.filter(
    (value) => value instanceof GuildChannel && value.type === "GUILD_CATEGORY",
  ) as Collection<string, CategoryChannel>;
  // Matte fag
  if (inputSubject.includes("MAT") || inputSubject.includes("STAT")) {
    return channels.find((category) => category.name === "MAT");
    // INF Fag
  } else if (inputSubject.slice(0, 3) === "INF") {
    const courseLevel = inputSubject.charAt(3);
    return channels.find((category) => category.name.toUpperCase() === `INF${courseLevel}XX`);
  }
  return channels.find((category) => category.name === "OTHER"); // Default til other, f.eks med BINF
};
