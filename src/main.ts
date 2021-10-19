import { Intents } from "discord.js";
import { config } from "dotenv";

import { DiscordClient, getConfig } from "./client";

config();

const botIntents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES];

const client = new DiscordClient(getConfig(), { intents: botIntents });

void client.init();
void client.start();
