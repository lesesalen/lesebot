# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.4.1](https://github.com/sondr3/lesebot/compare/v0.4.0...v0.4.1) (2020-09-14)

### Features

- allow bot on personal server too ([c5d2697](https://github.com/sondr3/lesebot/commit/c5d269785bc142419aa103c482a1912f96d27c96))

## [0.4.0](https://github.com/sondr3/lesebot/compare/v0.3.5...v0.4.0) (2020-09-14)

### ⚠ BREAKING CHANGES

- this will make the bot less annoying

### Features

- you can only play sounds in #Lesesalen now ([5000c13](https://github.com/sondr3/lesebot/commit/5000c13b9422ec66e7efccfdb81da3ccf76b3523))

### [0.3.5](https://github.com/sondr3/lesebot/compare/v0.3.4...v0.3.5) (2020-09-12)

### Features

- add !kenneth as alias for !dadjoke ([b47731a](https://github.com/sondr3/lesebot/commit/b47731abb399de64a9103f141874b7c93fb60efe))
- add @ for !affirm command ([916d17e](https://github.com/sondr3/lesebot/commit/916d17e009aa26826fef3b7d0832d499b567d879))
- make sodium an optional dependency, add note to README ([b12967f](https://github.com/sondr3/lesebot/commit/b12967f309667810c9aa35e94d03af5d261a62c0))
- only deploy if build succeeds ([fbe124d](https://github.com/sondr3/lesebot/commit/fbe124dd2819cf550f41e354f24875e64d68a855))

### Bug Fixes

- ignore JetBrains product dotfiles ([2415522](https://github.com/sondr3/lesebot/commit/2415522a5672d946b1775974537ced27cb9dd2e1))
- pull before running deploy.sh to catch updates to script ([1271af2](https://github.com/sondr3/lesebot/commit/1271af2e5bc56c0e9c07fef2a30f9dd2f92a05fb))

### [0.3.4](https://github.com/sondr3/lesebot/compare/v0.3.3...v0.3.4) (2020-09-11)

### Features

- add GH Action to autodeploy on release ([272633f](https://github.com/sondr3/lesebot/commit/272633f7de1982e5af159391c318e4f854d33abd))
- added [added woah and wah] ([#14](https://github.com/sondr3/lesebot/issues/14)) ([a9629dc](https://github.com/sondr3/lesebot/commit/a9629dca317a204668308e2fa773410dd3e97c50))

### [0.3.3](https://github.com/sondr3/lesebot/compare/v0.3.2...v0.3.3) (2020-09-11)

### [0.3.2](https://github.com/sondr3/lesebot/compare/v0.3.1...v0.3.2) (2020-09-11)

### Features

- added ['i did not hit her' and 'bababooey'] ([eeba473](https://github.com/sondr3/lesebot/commit/eeba473f9afae2177c85d76880d7a4b0cb303fca))

## [0.3.0](https://github.com/sondr3/lesebot/compare/v0.2.0...v0.3.0) (2020-05-22)

### Features

- add a MVP for exam date information ([a67532b](https://github.com/sondr3/lesebot/commit/a67532b0aa0981dacea4760e1328f316946785a0))
- add deploy script for easier redeploying ([af0f8b4](https://github.com/sondr3/lesebot/commit/af0f8b43823add3dd81e1a9e0139d652aad96811))
- make exam information into an embed ([bbf2f4c](https://github.com/sondr3/lesebot/commit/bbf2f4c8ff70dbeb6e5dd336130fece71871baf3))
- merge JSON for quotes again ([ec0db8c](https://github.com/sondr3/lesebot/commit/ec0db8c9053663a0e16e323ea1b9ba6eb1198f07))
- write exam info to disk, read from file ([aadbf13](https://github.com/sondr3/lesebot/commit/aadbf1380c472a2b0d2dcfe933fad1235f38f786))

## [0.2.0](https://github.com/sondr3/lesebot/compare/v0.1.2...v0.2.0) (2020-05-22)

### Features

- add DISCORD_PREFIX to environment vars ([cb70ea2](https://github.com/sondr3/lesebot/commit/cb70ea2f6686e120339e095df19fdd945981daff))
- add logging ([ab3fa18](https://github.com/sondr3/lesebot/commit/ab3fa189fd08f4ac437b7669d682b1c8c2b0ed13)), closes [#1](https://github.com/sondr3/lesebot/issues/1)

### Bug Fixes

- you can only play existing sounds ([4149af8](https://github.com/sondr3/lesebot/commit/4149af81ea8a8317ebd25db7c114ec5df72e20aa)), closes [#5](https://github.com/sondr3/lesebot/issues/5)
- you cannot compliment yourself ([135b1be](https://github.com/sondr3/lesebot/commit/135b1be89688b4a4ffc7ab37210222f3869f6a94)), closes [#4](https://github.com/sondr3/lesebot/issues/4)

### 0.1.2 (2020-05-22)

### Features

- added more sounds ([3b12034](https://github.com/sondr3/lesebot/commit/3b12034789f4eab8ea925132caad93ff7fa69910))

### 0.1.1 (2020-05-19)

### Features

- use ! as prefix ([8ae5655](https://github.com/sondr3/lesebot/commit/8ae5655d228fb6cd45539af5d21ef799c49a3bce))

### Bug Fixes

- add ffmpeg to Docker image ([63321e6](https://github.com/sondr3/lesebot/commit/63321e62a6f694bca8d0267cb135f5f573a36d8f))

## 0.1.0 (2020-05-19)

### Features

- add a command for selecting a winner from a voice channel ([b51a29e](https://github.com/sondr3/lesebot/commit/b51a29e2cf8861435c0b4c02079dcc2b3f4dc457))
- add a gong sound module ([f1d414e](https://github.com/sondr3/lesebot/commit/f1d414e1b442a906c7be41fad791db17dc48f852))
- add a week number command ([38bcc2c](https://github.com/sondr3/lesebot/commit/38bcc2c1e8877eadfb20cfb912683893b58b0061))
- add affirmations and dad yokes ([ac840f0](https://github.com/sondr3/lesebot/commit/ac840f0efc0d6dbeb5060f866ad0138f1da96bb1))
- add cat facts command ([5365fa3](https://github.com/sondr3/lesebot/commit/5365fa33b5d7232c6b5272f402a341b96ddd2549))
- add command for meowing ([a4280a3](https://github.com/sondr3/lesebot/commit/a4280a37f497e653fd428492579ba1c1a9e040e3))
- add commands for insults/compliments ([f55d996](https://github.com/sondr3/lesebot/commit/f55d996396b6507034fb09d4f64ff5e133e99613))
- add CommitLint CI check ([cf21628](https://github.com/sondr3/lesebot/commit/cf216284d3fd038ce72eb38634b7f2bbce551fe6))
- add containerization with Docker ([325560d](https://github.com/sondr3/lesebot/commit/325560dc0554df2a74653bb7d32828b54c05eb5a))
- add quote command, move fun commands to own dir ([5453026](https://github.com/sondr3/lesebot/commit/54530261943ac436dcf74270b1f8c546212d9c74))
- add sound and sound list command ([99a31ee](https://github.com/sondr3/lesebot/commit/99a31ee261d7a6a24e1b201fcb43a7c0f8296a2b))
- add sound when selecting a winner ([8f50dc2](https://github.com/sondr3/lesebot/commit/8f50dc22679f2f8eda6d49f566889bea041a6651))
- add TTS to insults (hidden) ([7c7a44a](https://github.com/sondr3/lesebot/commit/7c7a44ab577a501ea4f4174191b1736ced12ad12))
- added weebsounds ([e785bfd](https://github.com/sondr3/lesebot/commit/e785bfde87ce6633b701bdeb06faa7b48032b4fe))
- commands for adding and listing quotes ([20b8ce3](https://github.com/sondr3/lesebot/commit/20b8ce36ab1d1965a1cee88457326ba7e42b2e51))
- extract common functions to utility files ([fa4de2c](https://github.com/sondr3/lesebot/commit/fa4de2c7cdbe70d446564a9de0b67af2a6e244fa))
- extract quote formatting code ([b644dd2](https://github.com/sondr3/lesebot/commit/b644dd20d2f0fff877789b35c8298f703db2c1ea))
- its rigged :ree: ([dcc72fd](https://github.com/sondr3/lesebot/commit/dcc72fd15852259e260923c6030fd55882ae9362))
- its wednesday my dude ([5e37b4b](https://github.com/sondr3/lesebot/commit/5e37b4b5668162ce79947e1948892a52a90b9cf6))
- use ! as prefix ([8ae5655](https://github.com/sondr3/lesebot/commit/8ae5655d228fb6cd45539af5d21ef799c49a3bce))

### Bug Fixes

- don't list extensions for files ([0b41ef4](https://github.com/sondr3/lesebot/commit/0b41ef4f47067f0d200b6cacf924221e34a189ae))
- hide wednesday.mp3 ([198b3a0](https://github.com/sondr3/lesebot/commit/198b3a0a4eb375dfb04d3bc3dc583b64d70c892d))
- rename mp3 file to be consistent ([e24de39](https://github.com/sondr3/lesebot/commit/e24de397513e411a4d454872e86763f561fefc29))
- running dev server works and the bot is watching you ([435fe46](https://github.com/sondr3/lesebot/commit/435fe467a63d2d9501bb06211940c75e9ca01eed))
- throttle noisy commands to 1 every 10s ([edd0062](https://github.com/sondr3/lesebot/commit/edd00623fabfdfe6d1796a15e97f34a543c8bdb0))
