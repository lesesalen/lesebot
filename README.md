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
token. You should follow the [Discord4J setup guide][discord4j-setup]. For the 
specific permissions that the bot needs, you can see the [screenshots][perms].

**NB:** The `.env` is ignored by `git` by default so that you never accidentally
expose your application secrets, so make sure it is never added to your repo.

## Developing

For development, you need a good

1. Java IDE (IntelliJ IDEA)
2. Java (at least Java 16, though earlier releases may work)

Then simply run:

```sh
$ git clone git@github.com:sondr3/lesebot.git
$ cd lesebot
$ idea . # or open with IntelliJ via your desktop
```

## Running locally

There are two separate ways to run the bot while developing, assuming the above
steps have been followed.

1. You can now start the bot by starting `main` in `src/main/java/no/lesesalen/lesebot/LeseBot` in IDEA.
2. Build the project with `./mwnw package` and run it with `java -jar target/lesebot-1.0-SNAPSHOT.jar`

## Production

For production, I recommend hosting the bot in a Docker container and running
that. It is fairly straight forward, either run `./deploy.sh` or manually:

```sh
$ docker build -t <name> .
$ docker run --env-file .env -itd --restart unless-stopped --name <name> <name>
```

**Note:** You should probably omit the `-d` flag if you are developing locally
as this launches it headless. Otherwise, you have to find the process ID and then
view its logs.

# Inspiration, help

- [Eivind Dagsland Halderaker](https://github.com/Eivinddh/Discord-bots) and his
  small calendar bot.
- [Ståle Jacobsen](https://github.com/StaleJ) for his quotes, week
  number and assorted bot.

# License

MIT.

[discord4j-setup]: https://docs.discord4j.com/discord-application-tutorial
[perms]: https://github.com/lesesalen/lesebot/blob/python/assets/images
