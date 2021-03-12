const MessageEmbed = require("discord.js");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../config.json");

module.exports = class Command extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "donate",
			aliases: ["donation"],
			group: "info",
			memberName: "donations-cmd",
			description: "Donate and support me!",
			argsType: "single",
			guildOnly: false,
			throttling: {
				usages: 3,
				duration: 240,
			},
			ownerOnly: false,
		});
	}
	async run(message, args) {
		let dlink = config.donationLink;
		let Support = config.client_server_invite;
		let set_email = "deepweb.api.biz@gmail.com";
		let website = config.website_api;

		const embed = new Discord.MessageEmbed()

			.setTitle("Want to Donate and support the bot?")
			.setAuthor(
				`Please Read All Information ${message.author.username}! Be smart ;)`
			)
			.setDescription(
				"Remember that all donations are always optional and do not give you any benefits when using the bot.(ATM) | However to gain server only donation benefits you must join my support / main server. | __**IMPORTANT**__: this is our **ONLY CURRENT** method of donating. If you donate in any other way we are not responsible for anything regarding your payment fees. If you wish to contact our support directly outside of discord check our email below! Thaanks."
			)
			.addField(
				"Website:",
				`[View My Website for more info on donations!](${website})`
			)
			.addField(
				"Donation Link:",
				`[Click here to donate to us!](${dlink})`,
				true
			)
			.addField("Support Server", `[Join Us!](${Support})`, true)
			.addField("Developer Email", ` Email Us Here: (\`${set_email}\`)`)
			.setColor("#c28ada")
			.setFooter(`Command ran by ${message.author.tag}`)
			.setTimestamp()
			.setThumbnail(message.author.displayAvatarURL());
		message.channel.send(embed);
	}
};
