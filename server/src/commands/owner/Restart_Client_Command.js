const commando = require("discord.js-commando");

module.exports = class Command extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "restart",
			group: "owner",
			memberName: "restart",
			description: "restarts the bot with 1 command!",
			argsType: "single",
			guildOnly: false,
			throttling: {
				usages: 1,
				duration: 120,
			},
			ownerOnly: true,
		});
	}
	async run(message, args) {
		await message.channel.send(`Restarting bot...`);
		process.exit();
	}
};
