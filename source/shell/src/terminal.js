"use strict";
const Commando = require("discord.js-commando");
const path = require("path");
const config = require("../config/config.json");
const prefix = config.prefix;
// const join = require("path");
// const fs = require("fs");
const Discord = require("discord.js");
const { Intents } = require("discord.js");

const client = new Commando.Client({
	owner: "370637638820036608",
	commandPrefix: "?",
	invite: "https://discord.gg/NbqBQbaejS",
	disableMentions: "everyone",
	partials: ["GUILD_MEMBER", "MESSAGE", "REACTION", "USER", "CHANNEL"],
	retryLimit: 2,
	restSweepInterval: 60,
	restRequestTimeout: 15000,
	restTimeOffset: 500,
	restWsBridgeTimeout: 5000,
	fetchAllMembers: false,
	messageEditHistoryMaxSize: -1,
	messageSweepInterval: 0,
	messageCacheLifetime: 0,
	messageCacheMaxSize: 200,
	http: {
		version: 7,
		api: "https://discord.com/api",
		cdn: "https://cdn.discordapp.com",
		invite: "https://discord.gg",
		template: "https://discord.new",
	},
	ws: { intents: [Intents.ALL, "GUILD_MEMBERS"] },
});

client.registry
	.registerDefaultTypes({})
	.registerGroups([
		["test", "..."],
		["information", "..."],
		["moderation", ""],
		["owner", "..."],
		["config", "..."],
		["misc", "..."],
		["economy", "..."],
		["fun", "..."],
		["games", "..."],
		["giveaways", "..."],
		["images", "..."],
		["leveling", "..."],
		["org", "..."],
		["music", "..."],
		["util", "..."],
		["tickets", "..."],
		["webhooks", "..."],
		//	["", ""],
	])
	.registerDefaultGroups()
	.registerDefaultCommands({
		help: false,
		ping: false,
		eval: true,
		prefix: false,
		commandState: true,
		unknownCommand: true,
	})
	.registerCommandsIn(path.join(__dirname, "commands"));

//! Maps
client.queue = new Map();
const { GiveawayCreator, DropCreator } = require("discord-giveaway");
const Creator = new GiveawayCreator(client, config.db);
client.giveaways = Creator;
// client.snipes = new Map();
// client.editsnipes = new Map();
//? Commando Database Struct
const { mongo } = require("mongoose");
const mongoose = require("../config/mongo");
const MongoClient = require("mongodb").MongoClient;
const MongoDBProvider = require("commando-provider-mongo").MongoDBProvider;
client
	.setProvider(
		MongoClient.connect(config.db, {
			useUnifiedTopology: true,
		}).then((client) => new MongoDBProvider(client, "dev-build"))
	)
	.catch(console.error);
// passins the mongo file proporties
client.mongoose = require("../config/mongo");
// Connects to mongo
client.mongoose.init();

client.on("message", async (message) => {
	const Setprefix = message.guild
		? message.guild.commandPrefix
		: client.commandPrefix;

	if (!message.content.startsWith(Setprefix) || message.author.bot) return;
});
//! Function / Events handler
const { loadEvents } = require("./util/functions");
loadEvents(client);

//events

//! When the bot joins a new guild, it will send this message to a random channel.
client.on("guildCreate", (guild) => {
	const channel = guild.channels.cache.find(
		(channel) =>
			channel.type === "text" &&
			channel.permissionsFor(guild.me).has("SEND_MESSAGES")
	);
	const onJoiningNewServer = new Discord.MessageEmbed()
		.setTitle(`Thank you for inviting me to \`\`${guild.name}\`\`!`)
		.addFields(
			{
				name: `Why don't you check out my website?`,
				value: `[Website *coming soon*](${config.website_api})`, // This is optional if you have a website
				inline: true,
			},
			{
				name: `My default prefix is ${prefix}`,
				value: `\`\`(${prefix})\`\` but you can always change it by running (${prefix})prefix (New Prefix)`, // This is optional if you have a have a chane prefix commands
				inline: true,
			},
			{
				name: `My commands`,
				value: `I would recomend trying (${prefix})help or (${prefix})commands!`, // This is optional if you have a help or command commands
				inline: true,
			},
			{
				name: `If you have any problems with me please join are server! And we will try and fix the error!`,
				value: `[Discord Server Link](https://discord.gg/NbqBQbaejS)`, // This is optional if you have a support server
				inline: true,
			},
			{
				name: `If you want to invite me to your server please click Invite me!`,
				value: `[Invite me!](${config.auth})`, // This is optional if you want over people to invite your bot to different servers!
				inline: true,
			}
		)
		.setFooter(
			`And a special thanks from the creator of ${client.user.username} (ThatGuyJamal#2695)`
		);
	channel.send(onJoiningNewServer);
});

// client.on errors
client.on("warn", (info) => console.log(info));
client.on("error", console.error);
// connects to discord client token

//! function to handler sharding
async function start() {
	return await client.login(config.token);
}
start();
