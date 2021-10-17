import { CommandInteraction } from "discord.js";

import { DiscordClient, SlashCommandHandler } from "../../client";

export default class MeowCommand extends SlashCommandHandler {
  constructor() {
    super({
      name: "Meow",
      description: "Replies with a meaw, kitty cat",
    });
  }

  handle(interaction: CommandInteraction, _client: DiscordClient): Promise<void> {
    return interaction.reply("Meow!");
  }
}
