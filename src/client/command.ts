import { ApplicationCommandOptionData, ChatInputApplicationCommandData, CommandInteraction } from "discord.js";
import { ApplicationCommandTypes } from "discord.js/typings/enums";

import { DiscordClient } from ".";

export type CommandData = ChatInputApplicationCommandData;
export type CommandConstructor = { default: { new (): SlashCommand } };

export interface SlashCommand extends ChatInputApplicationCommandData {
  handle(interaction: CommandInteraction, client: DiscordClient): Promise<void>;
  toJson(): ChatInputApplicationCommandData;
}

export abstract class SlashCommandHandler implements SlashCommand {
  name!: string;
  description!: string;
  type?: "CHAT_INPUT" | ApplicationCommandTypes.CHAT_INPUT | undefined;
  options?: ApplicationCommandOptionData[] | undefined;
  defaultPermission?: boolean | undefined;

  protected constructor(options: ChatInputApplicationCommandData) {
    Object.assign(this, options);
  }

  public abstract handle(interaction: CommandInteraction, client: DiscordClient): Promise<void>;

  public toJson(): CommandData {
    return {
      name: this.name.toLowerCase(),
      description: this.description,
      type: this.type,
      options: this.options ?? [],
      defaultPermission: this.defaultPermission,
    };
  }
}
