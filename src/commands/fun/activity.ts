import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageActionRow, MessageButton, MessageEmbed, Permissions} from "discord.js";

import { DiscordClient, SlashCommandHandler } from "../../client";

const allApplications: Record<string, string> = {
  youtube: "880218394199220334",
  poker: "755827207812677713",
  betrayal: "773336526917861400",
  fishing: "814288819477020702",
  chess: "832012774040141894",
  lettertile: "879863686565621790",
  wordsnack: "879863976006127627",
  doodlecrew: "878067389634314250",
  awkword: "879863881349087252",
  spellcast: "852509694341283871",
};

export default class ActivityCommand extends SlashCommandHandler {
  builder = new SlashCommandBuilder()
    .setName("activity")
    .setDescription("Generate discord together activity invite")
    .addStringOption((option) => option.setName("name").setDescription("The activity name").addChoices([["Watch Together", "youtube"], ["Poker Night", "poker"], ["Betrayal.io", "betrayal"], ["Chess In The Park", "chess"], ["Fishington.io", "fishing"], ["Poker Night", "poker"], ["Lettertile", "lettertile"], ["Wordsnack", "wordsnack"], ["Doodlecrew", "doodlecrew"], ["Awkword", "awkword"], ["Spellcast", "spellcast"]]).setRequired(true))
    .addChannelOption((option) => option.setName("channel").setDescription("The voice channel").setRequired(false));

  async handle(interaction: CommandInteraction, _client: DiscordClient): Promise<void> {
    const name = interaction.options.getString("name", true);
    const channel = interaction.options.getChannel("channel", false) ?? (interaction.member instanceof GuildMember ? interaction.member : undefined)?.voice?.channel;

    const applicationId = allApplications[name];

    if (!(channel instanceof VoiceChannel))
      return interaction.reply("You have to join or mention a voice channel.");

    if (!channel.viewable)
      return interaction.reply("I need \`View Channel\` permission.");

    if (channel.type !== "GUILD_VOICE")
      return interaction.reply("Provide a valid guild voice channel.");

    if (!channel.permissionsFor(interaction.guild.me)?.has(Permissions.FLAGS.CREATE_INSTANT_INVITE))
      return interaction.reply("I need \`Create Invite\` permission.");

    const invite = await channel.createInvite({
      targetApplication: `${applicationId}`,
      targetType: 2
    });

    const button = new MessageButton()
      .setLabel("Join")
      .setStyle("LINK")
      .setURL(`${invite.url}`);

    const row = new MessageActionRow().addComponents([button]);

    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(`Successfully setup **${name}** game activity to **${channel.name}** channel.`)
      .setURL(`${invite.url}`);

    return interaction.reply({ embeds: [embed], components: [row] }).catch(console.error);
  }
}
