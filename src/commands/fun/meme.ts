import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import { CommandInteraction, MessageEmbed } from "discord.js";

import { DiscordClient, SlashCommandHandler } from "../../client";

interface MemeCommandApi {
  url: string;
}

export default class MemeCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder().setName("meme").setDescription("Funny meme, ha ha");

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<void> {
    await interaction.deferReply();

    const api = await axios.get<MemeCommandApi>(`https://meme-api.herokuapp.com/gimme`, {
      headers: {
        "User-Agent": "lesebot (https://github.com/lesesale/lesebot)",
        Accept: "application/json",
      },
    });

    const embed = new MessageEmbed().setColor("#0099ff").setImage(api.data.url).setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
}
