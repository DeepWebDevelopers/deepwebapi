const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
const profileSchema = require("../../db/profile");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "shop",
			// aliases: [""],
			group: "economy",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			memberName: "shop_eco_command",
			description: "Shop for something",
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 25,
			},
		});
	}
	async run(message, args, client) {
		const prefix = message.guild.commandPrefix;
		const foodItems = [
			{
				name: "Banana",
				cost: 30,
				worth: 20,
			},
			{
				name: "Apple",
				cost: 30,
				worth: 20,
			},
			{
				name: "Orange",
				cost: 30,
				worth: 20,
			},
			{
				name: "Coffee",
				cost: 60,
				worth: 40,
			},
			{
				name: "Iced Tea",
				cost: 60,
				worth: 40,
			},
			{
				name: "Soda",
				cost: 90,
				worth: 60,
			},
			{
				name: "Ice Cream",
				cost: 150,
				worth: 100,
			},
			{
				name: "Cookie",
				cost: 120,
				worth: 80,
			},
			{
				name: "Cake",
				cost: 180,
				worth: 120,
			},
		];

		const funItems = [
			{
				name: "Basketball",
				cost: 600,
				worth: 400,
			},
			{
				name: "Soccer Ball",
				cost: 600,
				worth: 400,
			},
			{
				name: "Football",
				cost: 600,
				worth: 400,
			},
			{
				name: "BB Gun",
				cost: 2500,
				worth: 2000,
			},
			{
				name: "RC Car",
				cost: 3500,
				worth: 3000,
			},
			{
				name: "RC Drone",
				cost: 5000,
				worth: 4000,
			},
		];

		const techItems = [
			{
				name: "Phone",
				cost: 10000,
				worth: 6000,
			},
			{
				name: "Laptop",
				cost: 20000,
				worth: 12000,
			},
			{
				name: "Smart Watch",
				cost: 7500,
				worth: 5000,
			},
			{
				name: "Headphones",
				cost: 5000,
				worth: 3000,
			},
			{
				name: "Music Player",
				cost: 6500,
				worth: 4000,
			},
			{
				name: "Virtual Reality Headset",
				cost: 12500,
				worth: 8000,
			},
			{
				name: "Tablet",
				cost: 15000,
				worth: 10000,
			},
			{
				name: "Gaming PC",
				cost: 50000,
				worth: 40000,
			},
			{
				name: "Game Console",
				cost: 10000,
				worth: 5000,
			},
			{
				name: "Game Controller",
				cost: 3000,
				worth: 1000,
			},
		];

		const flexItems = [
			{
				name: "N-Word Pass",
				cost: 69420,
				worth: 1,
			},
			{
				name: "Guinea Pig",
				cost: 100000,
				worth: 95000,
			},
			{
				name: "Expensive Air",
				cost: 1000000,
				worth: 0,
			},
		];

		let str = "";

		if (args[0].toLowerCase() === "food") {
			for (let i = 0; i < foodItems.length; i++) {
				str += `${foodItems[i].name} | ${formatNumber(
					foodItems[i].cost
				)} | ${formatNumber(foodItems[i].worth)}\n`;
			}
		} else if (args[0].toLowerCase() === "fun") {
			for (let i = 0; i < funItems.length; i++) {
				str += `${funItems[i].name} | ${formatNumber(
					funItems[i].cost
				)} | ${formatNumber(funItems[i].worth)}\n`;
			}
		} else if (args[0].toLowerCase() === "tech") {
			for (let i = 0; i < techItems.length; i++) {
				str += `${techItems[i].name} | ${formatNumber(
					techItems[i].cost
				)} | ${formatNumber(techItems[i].worth)}\n`;
			}
		} else if (args[0].toLowerCase() === "flex") {
			for (let i = 0; i < flexItems.length; i++) {
				str += `${flexItems[i].name} | ${formatNumber(
					flexItems[i].cost
				)} | ${formatNumber(flexItems[i].worth)}\n`;
			}
		} else return message.channel.send("Invalid category");

		let embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle("Name | Cost | Sell Value")
			.setAuthor(
				message.author.tag,
				message.author.avatarURL({
					format: "png",
					dynamic: true,
				})
			)
			.setDescription(str)
			.setThumbnail(message.client.user.avatarURL())
			.setTimestamp()
			.setFooter(`${prefix}buy <name> to buy an item`);

		message.channel.send(embed);
	}
};
function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
}
