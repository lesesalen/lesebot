import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import { CommandInteraction } from "discord.js";

import { DiscordClient, SlashCommandHandler } from "../../client";

interface CatFactApiRespone {
  fact: string;
}

export default class CatFactsCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder().setName("catfact").setDescription("You know what you need? CAT FACTS");

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<void> {
    const {
      data: { fact },
    } = await axios.get<CatFactApiRespone>(`https://catfact.ninja/fact`);
    return interaction.reply(`Did you know? ${fact}`);
  }
}
