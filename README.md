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

<!-- markdown-toc start - Don't edit this section. Run M-x markdown-toc-refresh-toc -->

**Table of Contents**

- [Installation](#installation)
  - [Configuration](#configuration)
  - [Production](#production)
  - [Developing](#developing)
- [Inspiration, help](#inspiration-help)
- [License](#license)

<!-- markdown-toc end -->

</details>

## What

Because of the global Covid19 crisis our university shut down our reading halls
and I decided to create my own virtual reading hall ~with blackjack and
hookers~. As the server has grown we've added a couple utility bots here and
there, some doing this and some doing that. I figured instead of having a
growing problem of bots and their rights, we could instead just pile onto a
single bot.

# Installation

## Configuration

Before any of the next steps, it's important to look at the `.env.example` file
and see what you need to change. At the very least you must get a new Discord
token. You can follow this
[guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html)
and copy the `.env.example` file to `.env`. Then you can simply change the token
in the file from `abcde` to your actual key.

**NB:** The `.env` is ignored by `git` by default so that you never accidentally
expose your application secrets, so make sure it is never added to your repo.

## Production

### Automatically

For a very quick and easy deploy of your bot, you can quickly edit the
`deploy.sh` file and change the name from `lesebot` to whatever you want it to
be and then just run it from the command line `./deploy.sh`.

**NOTE:** This bot is automatically deployed whenever a tag is pushed, so to
automatically deploy simply run `yarn release` and then `git push` and it'll
automagically be updated in about five minutes (depending on whether it has to
reinstall dependencies).

### Manually

For production I recommend hosting the bot in a Docker container and running
that. It is fairly straight forward:

```sh
$ docker build -t <name> .
$ docker run --env-file .env -itd --restart unless-stopped --name <name> <name>
```

**Note:** You should probably omit the `-d` flag if you are developing locally
as this launches it headless. Otherwise you have to find the process ID and then
view its logs.

## Developing

For development you need a good TypeScript IDE (Visual Studio Code or WebStorm
are my recommendations) and Node (version 12 and above), then simply run:

```sh
$ git clone git@github.com:sondr3/lesebot.git
$ cd lesebot
$ yarn install
```

**NOTE:** If you don't care about the test bot being able to run voice commands
you can install it without the optional dependency `sodium` like so: `yarn install --ignore-optional`.

Once you have everything installed you can start developing. The easiest way to
do this is to start the TypeScript compiler with `yarn dev` to automatically
compile your code and then in a separate terminal window run `yarn dev:run` to
actually run the Discord bot. This will compile and reload the bot whenever the
compiled code changes.

Once you are satisified with your work you can commit it to this repo, however
note that to commit something you need to follow the
[commitlint-conventional](https://github.com/conventional-changelog/commitlint/blob/master/%40commitlint/config-conventional/README.md)
style of commits (e.g. `feat: added foo command`).

# Inspiration, help

- [Eivind Dagsland Halderaker](https://github.com/Eivinddh/Discord-bots) and his
  small calendar bot.
- [Ståle Jacobsen](https://github.com/stalejacobsen-uib/) for his quotes, week
  number and assorted bot.

# License

MIT.
