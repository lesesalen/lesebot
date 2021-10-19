import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import type { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v9";

import { DiscordClient } from "./client";

export type CommandData = RESTPostAPIApplicationCommandsJSONBody;
export type SlashCommandData = SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
export type CommandConstructor = { default: { new (): SlashCommand } };

export interface SlashCommand {
  data(): SlashCommandData;
  handle(interaction: CommandInteraction, client: DiscordClient): Promise<void>;
  toJSON(): CommandData;
  getName(): string;
}

export abstract class SlashCommandHandler implements SlashCommand {
  private readonly name: string;

  protected constructor(name: string) {
    this.name = name.toLowerCase();
  }

  public abstract data(): SlashCommandData;
  public abstract handle(interaction: CommandInteraction, client: DiscordClient): Promise<void>;

  public getName(): string {
    return this.name;
  }

  public toJSON(): CommandData {
    return this.data().toJSON();
  }
}
