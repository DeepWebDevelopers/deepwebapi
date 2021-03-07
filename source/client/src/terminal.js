const DiscordJS = require("discord.js");
const WOKCommands = require("wokcommands");
const discordXP = require("discord-xp");
const cleverbot = require("cleverbot-free");
const config = require("../../config/config.json");

const client = new DiscordJS.Client({
	partials: [
		"MESSAGE",
		"REACTION",
		"CHANNEL",
		"GUILD_MEMBER",
		"MESSAGE",
		"USER",
	],
	retryLimit: 1,
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
});

const { GiveawayCreator, DropCreator } = require("discord-giveaway");
discordXP.setURL(`${config.db}`);
const Creator = new GiveawayCreator(client, config.db);
const Creator2 = new DropCreator(client, config.db);

client.queue = new Map();
client.giveaways = Creator;
client.drops = Creator2;

client.config = client;

client.on("ready", () => {
	// See the "Language Support" section of this documentation
	// An empty string = ignored
	const messagesPath = "../../config/message.json";

	// Used to configure the database connection.
	// These are the default options but you can overwrite them
	const dbOptions = {
		keepAlive: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	};

	// If you want to disable built in commands you can add them to this array. Simply uncomment the strings to disable that command.

	const disabledDefaultCommands = [
		// 'help',
		// 'command',
		// 'language',
		// 'prefix',
		// 'requiredrole'
	];

	// Initialize WOKCommands with specific folders and MongoDB
	new WOKCommands(client, {
		commandsDir: "commands",
		featureDir: "listeners",
		showWarns: true, // Show start up warnings
		dbOptions,
		messagesPath,
		disabledDefaultCommands,
		testServers: [""],
	})
		.setMongoPath(config.db)
		.setColor("RANDOM")
		.setBotOwner(config.owner)
		.setDefaultPrefix("?")
		.setCategorySettings([
			{
				name: "Bot Owner",
				emoji: "🤖",
				hidden: true,
			},
			{
				name: "Fun & Games",
				emoji: "🎮",
			},
			{
				name: "Economy",
				emoji: "💵",
			},
			{
				name: "Moderation",
				emoji: "🔨",
			},
			{
				name: "Utility",
				emoji: "🧠",
			},
			{
				name: "Images",
				emoji: "📸",
			},
			{
				name: "Leveling",
				emoji: "💬",
			},
			{
				name: "Music",
				emoji: "🎵",
			},
			{
				name: "Information",
				emoji: "ℹ",
			},
			{
				name: "Giveaways",
				emoji: "🎉",
			},
		]);

	let serverText = "servers";
	if (client.guilds.cache.size === 1) serverText = "server";

	client.user.setPresence({
		activity: {
			name: `@help | ${client.guilds.cache.size} ${serverText}`,
			type: "STREAMING",
			url: `https://www.youtube.com/watch?v=AhT83rwwF44`, //get noobed
		},
		status: "online",
	});

	console.log(`Logged in as [${client.user.tag}]`);
});

let recentMsg = new Set();

client.on("message", async (message) => {
	//Check if the person who sent the message is registered as a Discord Bot
	if (message.author.id === client.user.id || message.author.bot) return;

	//Bot commands only work in servers, so add this to prevent permission errors originating from the DM
	if (!message.guild)
		return cleverbot(message.content).then((response) =>
			message.channel.send(response)
		);

	//Points system
	if (recentMsg.has(message.author.id)) return;
	else {
		recentMsg.add(message.author.id);

		//Generates a random amount of points to add to the member, and adds it to the database
		let earnedXP = Math.floor(Math.random() * 9) + 1;
		let hasLeveledUp = await discordXP.appendXp(
			message.author.id,
			message.guild.id,
			earnedXP
		);

		//Checks if the user leveled up, and notify the member
		if (hasLeveledUp) {
			let XPuser = await discordXP.fetch(message.author.id, message.guild.id);
			message.reply(`GG! You leveled up to level **${XPuser.level}**!`);
		}

		setTimeout(() => {
			// Removes the user from the set after a minute
			recentMsg.delete(message.author.id);
		}, 45000);
	}
});

client.login(config.token);
