import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";

import { SlashCommandHandler } from "../../client";

export default class DadJokeCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder().setName("dadjoke").setDescription("DAD YOKE, ha ha ha"); //.setAlias("kenneth")

  handle(interaction, _client) {
    axios.get(`https://icanhazdadjoke.com/`, {
      headers: {
        "User-Agent": "lesebot (https://github.com/lesesale/lesebot)",
        Accept: "application/json",
      },
    }).then(({ data: { joke }}) => {
      return interaction.reply(joke);
    });
  }
}
