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

bot = commands.Bot(
    command_prefix=os.getenv("DISCORD_PREFIX"), intents=discord.Intents.all()
)
slash = SlashCommand(bot, sync_commands=True)


@slash.slash(name="test")
async def test_command(ctx: SlashContext):
    embed = discord.Embed(title="Test")
    await ctx.send(content="test", embeds=[embed])


if __name__ == "__main__":
    print("Bot online!")
    bot.run(os.getenv("DISCORD_TOKEN"))
