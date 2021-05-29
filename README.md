<h1 align="center">lesebot</h1>

<p align="center">
   <a href="https://github.com/sondr3/lesebot/actions"><img alt="GitHub Actions Status" src="https://github.com/sondr3/lesebot/workflows/pipeline/badge.svg" /></a>
   <a href="https://results.pre-commit.ci/latest/github/lesesalen/lesebot/master"><img alt="pre-commit.ci" src="https://results.pre-commit.ci/badge/github/lesesalen/lesebot/master.svg" /></a>
   <br />
</p>

<p align="center">
   <strong>A small but useful Discord bot.</strong>
</p>

<details>
<summary>Table of Contents</summary>
<br />

**Table of Contents**

- [Installation](#installation)
  - [Configuration](#configuration)
  - [Developing](#developing)
  - [Production](#production)
- [Inspiration, help](#inspiration-help)
- [License](#license)

</details>

## What

Because of the global COVID-19 crisis our university shut down our reading halls,
and I decided to create my own virtual reading hall ~with blackjack and
hookers~. As the server has grown we've added a couple utility bots here and
there, some doing this and some doing that. I figured instead of having a
growing problem of bots and their rights, we could instead just pile onto a
single bot.

# Installation

## Configuration

Before any of the next steps, it's important to look at the `.env.example` file
and see what you need to change. At the very least you must get a new Discord
token. You should follow the [discord.py setup guide][discpy-setup], and then
the [discord-py-slash-command guide][discslash-setup]. For the specific permissions
that the bot needs, you can see the [screenshots][perms].

**NB:** The `.env` is ignored by `git` by default so that you never accidentally
expose your application secrets, so make sure it is never added to your repo.

## Developing

For development, you need a good Python IDE (Visual Studio Code or Pycharm
are my recommendations) and Python (at least Python 3.9), then simply run:

```sh
$ git clone git@github.com:sondr3/lesebot.git
$ cd lesebot
$ make setup
```

If you don't have make installed, it's still very straight forward to get going:

```shell
$ git clone git@github.com:sondr3/lesebot.git
$ cd lesebot
$ python -m venv .venv
$ source .venv/bin/activate
$ pip install -r requirements.txt
$ pre-commit install
```

You can now start the bot by simply running `python main.py`.

**TIP:** It can be frustrating to have to restart the bot every time you make changes
and want to test them, I recommend installing [`nodemon`](https://github.com/remy/nodemon)
and running the bot with `nodemon main.py`.

## Production

For production, I recommend hosting the bot in a Docker container and running
that. It is fairly straight forward:

```sh
$ docker build -t <name> .
$ docker run --env-file .env -itd --restart unless-stopped --name <name> <name>
```

**Note:** You should probably omit the `-d` flag if you are developing locally
as this launches it headless. Otherwise you have to find the process ID and then
view its logs.

# Inspiration, help

- [Eivind Dagsland Halderaker](https://github.com/Eivinddh/Discord-bots) and his
  small calendar bot.
- [Ståle Jacobsen](https://github.com/StaleJ) for his quotes, week
  number and assorted bot.

# License

MIT.

[discpy-setup]: https://discordpy.readthedocs.io/en/latest/discord.html
[discslash-setup]: https://discord-py-slash-command.readthedocs.io/en/latest/quickstart.html
[perms]: https://github.com/lesesalen/lesebot/blob/python/assets/images
