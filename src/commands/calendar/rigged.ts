import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

import { DiscordClient, SlashCommandHandler } from "../../client";

export default class RiggedCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder().setName("rigged").setDescription("YOU DIDN'T WIN?! MUST BE A RIGGED SYSTEM");

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<void> {
    await interaction.reply(
      `En feil har oppstått. Grunnet lav tilgang på økonomiske ressurser trenger vi hjelp til å ordne opp i feilen. Vi tar imot _frivillige donasjoner_ på **2188** på vipps.`,
    );
  }
}
