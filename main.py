import logging
import os

import discord
from discord.ext import commands
from discord_slash import SlashCommand, SlashContext
from dotenv import load_dotenv

logger = logging.getLogger("discord")
logger.setLevel(logging.DEBUG)
handler = logging.FileHandler(filename="discord.log", encoding="utf-8", mode="w")
handler.setFormatter(
    logging.Formatter("%(asctime)s:%(levelname)s:%(name)s: %(message)s")
)
logger.addHandler(handler)

load_dotenv()

client = commands.Bot(
    command_prefix=os.getenv("DISCORD_PREFIX"), intents=discord.Intents.all()
)
# client.remove_command("help")
slash = SlashCommand(client, sync_commands=True, sync_on_cog_reload=True)


@slash.slash(name="test")
async def test_command(ctx: SlashContext):
    embed = discord.Embed(title="Test")
    await ctx.send(content="test", embeds=[embed])


for filename in os.listdir("fun"):
    if filename.endswith(".py"):
        client.load_extension(f"fun.{filename[:-3]}")

if __name__ == "__main__":
    print("Bot online!")
    client.run(os.getenv("DISCORD_TOKEN"))
