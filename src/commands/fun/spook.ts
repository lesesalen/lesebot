import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import { CommandInteraction, Guild, GuildMember, MessageEmbed, User } from "discord.js";

import { DiscordClient, getEnvVar, SlashCommandHandler } from "../../client";
import logger from "../../utils/logger";

interface SpookyApiResponse {
  data: {
    images: {
      original: {
        url: string;
      };
    };
  };
}

const getNickname = (guild: Guild | null, user: User): string => {
  return guild?.members.resolve(user)?.nickname ?? user.username;
};

export default class SpookCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder()
    .setName("spook") // .setAlias("spooky", "spooks", "skeleton")
    .setDescription("Sends a random spooky skeleton!")
    .addUserOption((option) => option.setName("user").setDescription("Optional user to spook").setRequired(false));

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<unknown> {
    const user = interaction.options.getMember("user");

    // Fetching and building embed may take some time, so tell the user we're doing stuff:
    await interaction.deferReply({ ephemeral: user instanceof GuildMember });

    const api = await axios.get<SpookyApiResponse>(
      `https://api.giphy.com/v1/gifs/random?tag=skeleton&api_key=${getEnvVar("GIPHY_API_KEY")}`,
    );

    const url = api.data.data.images.original.url;
    const embed = new MessageEmbed().setColor("#0099ff").setImage(url).setTimestamp().setFooter("Powered by Giphy");

    const authorNickname = getNickname(interaction.guild, interaction.user);

    if (user instanceof GuildMember) {
      const userNickname = getNickname(interaction.guild, user.user);
      try {
        await user.send({
          embeds: [new MessageEmbed(embed).setTitle(`Spooked by ${authorNickname}!`)],
        });
      } catch (err) {
        logger.error(err);
        return interaction.editReply({
          embeds: [
            embed.setColor("#fe2644").setTitle(`Was going to spook ${userNickname} with this, but it failed. :(`),
          ],
        });
      }
      return interaction.editReply({
        embeds: [embed.setTitle(`Successfully spooked ${userNickname} with this:`)],
      });
    } else {
      return interaction.editReply({ embeds: [embed] });
    }
  }
}
