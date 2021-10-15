import { MessageEmbed } from "discord.js";
import { Command } from "discord.js-commando";

import { getPersistentData } from "../../utils/courses.mjs";

class WhereRoomCommand extends Command {
  constructor(client) {
    super(client, {
      name: "where",
      aliases: ["room", "hvor"],
      group: "uib",
      memberName: "where",
      description: "Locates a room's position",
      argsPromptLimit: 0,
      args: [
        {
          key: "room",
          prompt: "Room to inquire about",
          type: "string",
          validate: undefined,
          default: "",
        },
      ],
    });
  }

  async run(message, { room }) {
    if (room === "") {
      return await message.reply("You need to specify the room to locate");
    }

    const data = await getPersistentData();
    if (data === undefined) {
      return await message.reply(`Sorry, cannot find any rooms.`);
    }

    const roomKeys = [...data.rooms.keys()];

    let roomKey;
    // Search normally first, just to make search more precise
    roomKey = roomKeys.find((element) => room === element);

    // Bit more general search:
    if (!roomKey) {
      roomKey = roomKeys.map((s) => s.toUpperCase()).find((element) => element.includes(room.toUpperCase()));
    }

    const roomEntry = [...data.rooms.entries()].find(([key]) => key.toUpperCase() === roomKey);
    if (roomEntry === undefined) {
      return await message.reply(`Sorry, couldn't find the room "${room}".`);
    }

    const embed = new MessageEmbed().setColor("#0099ff").setTitle(roomEntry[0]).setURL(roomEntry[1].roomurl);

    return await message.say(embed);
  }
}

export default WhereRoomCommand;
