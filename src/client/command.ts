import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import type { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v9";

import { DiscordClient } from "./client";

export type CommandData = RESTPostAPIApplicationCommandsJSONBody;
export type SlashCommandData =
  | SlashCommandBuilder
  | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
  | SlashCommandSubcommandsOnlyBuilder;
export type CommandConstructor = { default: { new (): SlashCommand } };

export interface SlashCommand {
  builder: SlashCommandData;
  handle(interaction: CommandInteraction, client: DiscordClient): Promise<void>;
  toJSON(): CommandData;
  getName(): string;
}

export abstract class SlashCommandHandler implements SlashCommand {
  public abstract builder: SlashCommandData;
  public abstract handle(interaction: CommandInteraction, client: DiscordClient): Promise<void>;

  getName(): string {
    return this.builder.name.toLowerCase();
  }

  public toJSON(): CommandData {
    return this.builder.toJSON();
  }
}
