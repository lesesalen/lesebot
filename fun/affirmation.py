from typing import Optional

import requests
from discord import User
from discord.ext import commands
from discord_slash import SlashCommandOptionType, SlashContext, cog_ext
from discord_slash.utils.manage_commands import create_option

from utils.utils import mention_to_id

options = [
    create_option(
        name="target",
        description="User to target",
        option_type=SlashCommandOptionType.USER,
        required=False,
    )
]


async def make(ctx, target):
    res = requests.get("https://www.affirmations.dev/")
    affirm = res.json()["affirmation"]

    if target is None:
        return await ctx.send(f"{affirm}.")
    elif ctx.author == target:
        return await ctx.send(f"Need a little lift, <@{target.id}>? {affirm}")
    else:
        return await ctx.send(f"<@{target.id}>: {affirm}. (from <@{ctx.author.id}>)")


class Affirmation(commands.Cog):
    def __init__(self, client: commands.Bot):
        self.client = client

    @commands.command()
    async def affirm(self, ctx: SlashContext, target=None):
        """We all need that little friendly push"""
        target = self.client.get_user(mention_to_id(target))
        await make(ctx, target)

    @cog_ext.cog_slash(
        name="affirm",
        description="We all need that little friendly push",
        options=options,
    )
    async def _affirm(self, ctx: SlashContext, target: Optional[User] = None):
        await make(ctx, target)


def setup(client: commands.Bot):
    client.add_cog(Affirmation(client))
