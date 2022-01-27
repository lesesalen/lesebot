import { Intents } from "discord.js";
import { config } from "dotenv";

import { DiscordClient, getConfig } from "./client";

config();

const botIntents = [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MEMBERS,
  Intents.FLAGS.GUILD_PRESENCES,
  Intents.FLAGS.GUILD_VOICE_STATES,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.DIRECT_MESSAGES,
];

const client = new DiscordClient(getConfig(), { intents: botIntents });

void client.init();
