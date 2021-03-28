const db = require("../../db/blacklist");
const mongo = require("../../../config/mongo");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "blacklist",
			aliases: ["bl"],
			group: "owner",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			memberName: "",
			description: "",
			argsType: "multiple",
			guildOnly: true,
			ownerOnly: true,
			throttling: {
				usages: 3,
				duration: 25,
			},
		});
	}
	async run(message, args, client) {
		const prefix = message.guild.commandPrefix;

		message.reply("comming soon...");
	}
};
