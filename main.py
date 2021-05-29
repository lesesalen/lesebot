import logging
import os

import discord
from discord.ext import commands
from discord_slash import SlashCommand, SlashCommandOptionType, SlashContext
from discord_slash.model import SlashCommandPermissionType
from discord_slash.utils.manage_commands import create_option, create_permission
from dotenv import load_dotenv

logger = logging.getLogger("discord")
logger.setLevel(logging.INFO)
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

GUILD_ID = 687650156262195217
GUILD_TEST_ID = 848275101434642442
DEV_ID = 848277255147094046
DEV_TEST_ID = 848276010231529542

ADMIN_PERMISSION = {
    GUILD_ID: [create_permission(DEV_ID, SlashCommandPermissionType.ROLE, True)],
    GUILD_TEST_ID: [
        create_permission(DEV_TEST_ID, SlashCommandPermissionType.ROLE, True)
    ],
}


@slash.slash(
    name="reload",
    description="Reload a cog",
    options=[
        create_option(
            name="cog",
            description="Cog to reload",
            option_type=SlashCommandOptionType.STRING,
            required=True,
        )
    ],
    default_permission=False,
    permissions=ADMIN_PERMISSION,
)
async def _reload(ctx: SlashContext, extension: str):
    try:
        client.unload_extension(extension)
        client.load_extension(extension)
        await ctx.send(f"Reloaded {extension} successfully")
        logging.info(f"Reloaded {extension} successfully")
    except Exception as e:
        await ctx.send(f"Reloading {extension} failed: {e}")
        logging.error(f"Reloading {extension} failed: {e}")


for filename in os.listdir("fun"):
    if filename.endswith(".py"):
        client.load_extension(f"fun.{filename[:-3]}")

if __name__ == "__main__":
    print("Bot online!")
    client.run(os.getenv("DISCORD_TOKEN"))
