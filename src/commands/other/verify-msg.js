const commando = require("discord.js-commando");
const verifySettings = require("../../db/guildVer");
const Discord = require("discord.js");

module.exports = class Command extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "verify-msg",
			aliases: ["verify-message"],
			group: "other",
			memberName: "v-msg-command",
			description: "...",
			clientPermissions: ["SEND_MESSAGES", "MANAGE_GUILD", "MANAGE_ROLES"],
			userPermissions: ["ADMINISTRATOR"],
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 10,
			},
		});
	}
	async run(message, args) {
		const prefix = message.guild.commandPrefix;
		/**
      *    if(!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send("❌ You do not have permissions to add roles.")
            }
      */

		verifySettings.findOne({ GuildID: message.guild.id }, async (err, data) => {
			if (!data) {
				return message.channel.send(
					`You haven\'t set your verify channel and role yet. Say \`${prefix}v-set\` to do it now!`
				);
			}
			let argsEmbed = new Discord.MessageEmbed()
				.setTitle("Not Enough Args")
				.setDescription(`❌ Please be more descriptive.`)
				.addField("Example:", `\`${prefix}verify-msg <channel mention>\``)
				.setColor("RED");
			let sendchannel = message.mentions.channels.first();
			if (!sendchannel) {
				return message.channel.send(argsEmbed);
			}
			let embed = new Discord.MessageEmbed()
				.setTitle("Verification")
				.setTimestamp()
				.setDescription(
					`To become a member of ${message.guild.name}, say \`${prefix.prefix}verify\` in this channel. Make sure you read the rules!`
				)
				.setThumbnail(message.guild.iconURL())
				.setFooter("Have Fun!")
				.setColor("#c28ada");
			let msg = await sendchannel.send(embed);
			await msg.pin();
		});
	}
};
