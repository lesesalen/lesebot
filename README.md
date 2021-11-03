<h1 align="center">lesebot</h1>

<p align="center">
   <a href="https://github.com/sondr3/lesebot/actions"><img alt="GitHub Actions Status" src="https://github.com/sondr3/lesebot/workflows/pipeline/badge.svg" /></a>
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
  - [Production](#production)
    - [Automatically](#automatically)
  - [Developing](#developing)
- [Inspiration, help](#inspiration-help)
- [License](#license)

</details>

## What

Because of the global COVID-19 crisis our university shut down our reading halls
and I decided to create my own virtual reading hall ~with blackjack and
hookers~. As the server has grown we've added a couple utility bots here and
there, some doing this and some doing that. I figured instead of having a
growing problem of bots and their rights, we could instead just pile onto a
single bot.

# Installation

## Configuration

Before any of the next steps, it's important to look at the `.env.example` file
and see what you need to change, for more details look at the [CONTRIBUTING](CONTRIBUTING.md)
documentation. You can follow this [guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html) and copy the `.env.example` file to `.env`. Then you can simply change what
you need to.

**NB:** The `.env` is ignored by `git` by default so that you never accidentally
expose your application secrets, so make sure it is never added to your repo.

## Production

**NOTE:** This bot is automatically deployed whenever a new commit is pushed to
`main`, and once it is built and the Docker image is pushed the changes go live.
This takes approximately four minutes from when a commit lands on `main`.

### Automatically

For production, I recommend hosting the bot in a Docker container and running
that. It is fairly straight forward: edit the `deploy.sh` file and change the 
name from `lesebot` to whatever you want it to be and then just run it from 
the command line `./deploy.sh`. This will pull the latest version of the bot
from the GitHub Docker Registry and deploy it.

If you want to do this manually you can look at the commands that are run in 
`deploy.sh` and run them yourself, just remember to build the bot locally first:

```sh
$ docker build -t <name> .
$ docker run --env-file .env -itd --restart unless-stopped --name <name> <name>
```

**Note:** You should probably omit the `-d` flag if you are developing locally
as this launches it headless. Otherwise, you have to find the process ID and then
view its logs.

## Developing

For development, you need a good JavaScript IDE (Visual Studio Code or WebStorm
are my recommendations) and Node (version 16.6 and above, **note:** due to 
requirements for Discord.js you _must_ have at least v16.6), then simply run:

```sh
$ git clone git@github.com:sondr3/lesebot.git
$ cd lesebot
$ npm ci
```

**NOTE:** If you don't care about the test bot being able to run voice commands
you can install it without the optional dependency `sodium` like so: `npm ci --no-optional`.

Once you have everything installed you can start developing. The easiest way to
do this is to start the bot with `npm start` to automatically reload the bot 
whenever the code changes.

# Inspiration, help

- [Eivind Dagsland Halderaker](https://github.com/Eivinddh/Discord-bots) and his
  small calendar bot.
- [Ståle Jacobsen](https://github.com/StaleJ) for his quotes, week
  number and assorted bot.

# License

MIT.
