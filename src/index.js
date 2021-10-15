import CommandoClient from "discord.js-commando";
import { config } from "dotenv";
import fs from "node:fs/promises";

import { getPersistentData } from "./utils/courses.js";
import logger from "./utils/logger.js";

config();

const registerCommands = async (discordClient) => {
  const groups = await fs.readdir(new URL("commands", import.meta.url).pathname);
  for (const group of groups) {
    const commands = await fs.readdir(new URL(`commands/${group}`, import.meta.url).pathname);
    for (const command of commands.filter((dir) => dir.endsWith(".mjs"))) {
      const it = await import(`./commands/${group}/${command}`);
      discordClient.registry.registerCommand(it.default);
    }
  }
};

const client = new CommandoClient.CommandoClient({
  commandPrefix: process.env.DISCORD_PREFIX,
  owner: "217316187032256512",
});

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ["fun", "Small, fun commands"],
    ["sound", "Cover your earholes"],
    ["uib", "Useful commands related to UiB"],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands();

void registerCommands(client);

client.once("ready", () => {
  if (!client.user) throw new Error("User not authenticated");
  console.log(`Logged in as ${client.user?.tag}! (${client.user?.id})`);
  void client.user?.setActivity("STUDENTS", { type: "WATCHING" });

  logger.info({ message: `Creating initial exam information` });
  getPersistentData().catch((error) => {
    logger.error({
      message: error,
    });
  });
});

client.on("error", console.error);

void client.login(process.env.DISCORD_TOKEN);
