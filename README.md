<h1 align="center">lesebot</h1>

<p align="center">
   <strong>A small but useful Discord bot.</strong>
</p>

<details>
<summary>Table of Contents</summary>
<br />

<!-- markdown-toc start - Don't edit this section. Run M-x markdown-toc-refresh-toc -->

**Table of Contents**

- [What](#what)
- [Installation](#installation)
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

## Developing

For development you need a good TypeScript IDE (Visual Studio Code or WebStorm
are my recommendations) and Node (version 12 and above), then simply run:

```sh
$ git clone git@github.com:sondr3/lesebot.git
$ cd lesebot
$ yarn install
```

You also need to get a application token, follow this
[guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html)
and copy the `.env.example` file to `.env`. Then you can simply change the token
in the file from `abcde` to your actual key

**NB:** The `.env` is ignored by `git` by default so that you never accidentally
expose your application secrets, so make sure it is never added to your repo.

Once you have everything installed you can start developing. The easiest way to
do this is to start the TypeScript compiler with `yarn dev` to automatically
compile your code and with `yarn dev:run` to actually run the Discord bot. You
can run the `dev:run` command alongside the `dev` command as the latter will
automagically reload the bot whenever the compiled code changes.

Once you are satisified with your work you can commit it to this repo, however
note that to commit something you need to follow the
[commitlint-conventional](https://github.com/conventional-changelog/commitlint/blob/master/%40commitlint/config-conventional/README.md)
style of commits (e.g. `feat: added foo command`).

# Inspiration, help

- [Eivind Dagsland Halderaker](https://github.com/Eivinddh/Discord-bots) and his small calendar bot.
- [Ståle Jacobsen](https://github.com/stalejacobsen-uib/) for his quotes, week number and assorted bot.

# License

MIT.
