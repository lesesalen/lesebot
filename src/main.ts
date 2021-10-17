import { Intents } from "discord.js";
import { config } from "dotenv";

import { DiscordClient, getConfig } from "@/client";

config();

const client = new DiscordClient(getConfig(), { intents: [Intents.FLAGS.GUILDS] });

void client.init();
void client.start();
