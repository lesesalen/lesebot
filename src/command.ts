import { ApplicationCommandOptionData, ChatInputApplicationCommandData, CommandInteraction } from "discord.js";
import { ApplicationCommandTypes } from "discord.js/typings/enums";

import { DiscordClient } from "./client";

export interface ICommand {
  handle(interaction: CommandInteraction, client: DiscordClient): Promise<void>;
  toJson(): ChatInputApplicationCommandData;
}

export abstract class Command implements ChatInputApplicationCommandData {
  name: string;
  description: string;
  type?: "CHAT_INPUT" | ApplicationCommandTypes.CHAT_INPUT | undefined;
  options?: ApplicationCommandOptionData[] | undefined;
  defaultPermission?: boolean | undefined;

  constructor(options: ChatInputApplicationCommandData) {
    this.name = options.name;
    this.description = options.description;
    this.type = options.type;
    this.defaultPermission = options.defaultPermission;
    this.options = options.options;
  }

  public abstract handle(interaction: CommandInteraction, client: DiscordClient): Promise<void>;

  public toJson(): ChatInputApplicationCommandData {
    return {
      name: this.name,
      description: this.description,
      type: this.type,
      options: this.options ?? [],
      defaultPermission: this.defaultPermission,
    };
  }
}
