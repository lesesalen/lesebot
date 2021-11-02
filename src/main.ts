import { Intents } from "discord.js";
import { config } from "dotenv";

import { DiscordClient, getConfig } from "./client";

config();

const botIntents = [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MEMBERS,
  Intents.FLAGS.GUILD_PRESENCES,
  Intents.FLAGS.GUILD_VOICE_STATES,
];

const client = new DiscordClient(getConfig(), { intents: botIntents });

void client.init();
