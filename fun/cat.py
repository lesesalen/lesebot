import requests
import discord
from discord.ext import commands
from discord_slash import SlashContext, cog_ext


async def make(ctx):
    res = requests.get("https://api.thecatapi.com/v1/images/search")
    catUrl = res.json()[0]["url"]
    embed = discord.Embed(title="Cat")
    embed.set_image(url=catUrl)
    return await ctx.send(embed=embed)


class CatCommand(commands.Cog):
    def __init__(self, client: commands.Bot):
        self.client = client

    @commands.command()
    async def cat(self, ctx: SlashContext):
        await make(ctx)

    @cog_ext.cog_slash(
        name="cat",
        description="Caaat",
    )
    async def _cat(self, ctx: SlashContext):
        await make(ctx)


def setup(client: commands.Bot):
    client.add_cog(CatCommand(client))
