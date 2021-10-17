import { Intents } from "discord.js";
import { config } from "dotenv";

import { DiscordClient } from "./client";
import { getConfig } from "./config";

config();

const client = new DiscordClient(getConfig(), { intents: [Intents.FLAGS.GUILDS] });
void client.init();

client.on("ready", () => {
  console.log(`Logged in as ${client?.user?.tag ?? "unknown"}!`);
});

void client.login(process.env.DISCORD_TOKEN);

client.on("interactionCreate", (interaction) => {
  if (!interaction.isCommand()) return;
  void client.runCommand(interaction);
});
