const DiscordJS = require("discord.js");
const WOKCommands = require("wokcommands");
const cleverbot = require("cleverbot-free");
const { Intents } = require("discord.js");
const config = require("../../config/config.json");
const prefix = config.prefix;

const client = new DiscordJS.Client({
	partials: [
		"MESSAGE",
		"REACTION",
		"CHANNEL",
		"GUILD_MEMBER",
		"MESSAGE",
		"USER",
	],
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

const { GiveawayCreator, DropCreator } = require("discord-giveaway");
const Creator = new GiveawayCreator(client, config.db);
const Creator2 = new DropCreator(client, config.db);

client.queue = new Map();
client.giveaways = Creator;
client.drops = Creator2;
// client.snipes = new Map();
// client.editsnipes = new Map();
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
		// "help",
		// 'command',
		// 'language',
		// 'prefix',
		// 'requiredrole'
		// "ping",
	];

	// Initialize WOKCommands with specific folders and MongoDB
	new WOKCommands(client, {
		commandsDir: "commands",
		featureDir: "listeners",
		showWarns: true, // Show start up warnings
		dbOptions,
		messagesPath,
		disabledDefaultCommands,
		testServers: ["771507203647209482"],
	})
		.setMongoPath(config.db)
		.setColor("RANDOM")
		.setBotOwner(config.owner)
		.setDefaultPrefix(config.prefix)
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
});

// client.on errors
client.on("warn", (info) => console.log(info));
client.on("shardError", (error) => {
	console.error("A websocket connection encountered an error:", error);
});
client.on("error", console.error);
client.login(config.token);
