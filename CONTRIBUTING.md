# Contributing

## Pre-requisite knowledge

Contributing to this bot does not require much understanding of TypeScript, but
some may be useful. Coming from JS or Python shouldn't be much of a concern for
implementing commands.

## Resources

- [Discord.js Guide](https://discordjs.guide/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

## Creating a new command

To create a new command you can copy one of the existing ones that matches what
you want to do from the `src/commands` directory, for example the `InsultCommand` 
has some simple code for an optional argument that targets a user or otherwise 
randomly selects a member of the guild you're in while the `MeowCommand` is a very 
simple command that simply replies `Meow!` when invoked.

The commands themselves are created by extending an abstract class called `SlashCommandHandler`:

```ts
export interface SlashCommand {
  builder: SlashCommandData;
  handle(interaction: CommandInteraction, client: DiscordClient): Promise<void>;
  toJSON(): CommandData;
  getName(): string;
}

export abstract class SlashCommandHandler implements SlashCommand {
  public abstract builder: SlashCommandData;
  public abstract handle(interaction: CommandInteraction, client: DiscordClient): Promise<void>;

  getName(): string {
    return this.builder.name.toLowerCase();
  }

  public toJSON(): CommandData {
    return this.builder.toJSON();
  }
}
```

Your command only has to implement the `builder` field and the `handle` method, the
rest are automatically inherited by extending the class. If your command does not need
to interact with the `DiscordClient` you can add an underscore to the variable name `_client`
to tell TypeScript and ESLint to ignore the variable.

The implementation for the `MeowCommand` is then simply

```ts
export default class MeowCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder().setName("meow").setDescription("Replies with a meaw, kitty cat");

  handle(interaction: CommandInteraction, _client: DiscordClient): Promise<void> {
    return interaction.reply("Meow!");
  }
}
```

Note that the command has to be the default export from the file and it has to
extend the `SlashCommandHandler` due to how it is loaded via the client itself.