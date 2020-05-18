import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";
import dateFormat from "dateformat";

import fs from "fs";
import path from "path";

interface Quote {
  quote: string;
  author: string;
  date: Date;
}

class QuoteCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "quote",
      aliases: ["dagenssitat"],
      group: "fun",
      memberName: "quote",
      description: "A random quote from our highly intelligent members",
    });
  }

  run = async (message: CommandoMessage): Promise<Message | Message[]> => {
    const quotes = this.load();
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    const date = dateFormat(new Date(quote.date), "fullDate");

    return await message.say(`${quote.quote} -- ${quote.author} (${date})`);
  };

  load = (): Quote[] => {
    const file = fs.readFileSync(path.resolve(process.cwd(), "data/quotes.json"));
    const quotes = JSON.parse(file.toString());
    return quotes;
  };
}

export default QuoteCommand;
