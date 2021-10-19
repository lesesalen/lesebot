import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import type { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v9";

import { DiscordClient } from "./client";

export type CommandData = RESTPostAPIApplicationCommandsJSONBody;
export type CommandConstructor = { default: { new (): SlashCommand } };

export interface SlashCommand {
  data: SlashCommandBuilder;
  handle(interaction: CommandInteraction, client: DiscordClient): Promise<void>;
  toJSON(): CommandData;
  getName(): string;
}

export abstract class SlashCommandHandler implements SlashCommand {
  data: SlashCommandBuilder;

  protected constructor(data: SlashCommandBuilder) {
    this.data = data;
  }

  public abstract handle(interaction: CommandInteraction, client: DiscordClient): Promise<void>;

  public getName(): string {
    return this.data.name.toLowerCase();
  }

  public toJSON(): CommandData {
    return this.data.toJSON();
  }
}
