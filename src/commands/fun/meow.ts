import { CommandInteraction } from "discord.js";

import { DiscordClient } from "../../client";
import { CommandHandler } from "../../command";

export default class MeowCommand extends CommandHandler {
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
