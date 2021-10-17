import { CommandInteraction } from "discord.js";

import { DiscordClient } from "../../client";
import { Command, ICommand } from "../../command";

export default class MeowCommand extends Command implements ICommand {
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
