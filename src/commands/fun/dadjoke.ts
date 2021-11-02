import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import { CommandInteraction } from "discord.js";

import { DiscordClient, SlashCommandHandler } from "../../client";

interface DadJokeApiResponse {
  joke: string;
}

export default class DadJokeCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder().setName("dadjoke").setDescription("DAD YOKE, ha ha ha"); //.setAlias("kenneth")

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<void> {
    const {
      data: { joke },
    } = await axios.get<DadJokeApiResponse>(`https://icanhazdadjoke.com/`, {
      headers: {
        "User-Agent": "lesebot (https://github.com/lesesale/lesebot)",
        Accept: "application/json",
      },
    });
    return interaction.reply(joke);
  }
}
