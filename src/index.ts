import { CommandoClient } from "discord.js-commando";
import path from "path";

require("dotenv").config();

const client = new CommandoClient({
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
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, "commands"));

client.once("ready", () => {
  console.log(`Logged in as ${client.user?.tag}! (${client.user?.id})`);
  client.user?.setActivity("STUDENTS", { type: "WATCHING" });
});

client.on("error", console.error);

client.login(process.env.DISCORD_TOKEN);
