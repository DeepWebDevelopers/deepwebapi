const Discord = require("discord.js");
const config = require("../../config/config.json");

const manager = new Discord.ShardingManager("./terminal.js", {
	totalShards: "auto",
	token: config.token,
});

manager.spawn(manager.totalShards, 10); //set to 5000 after testing

manager.on("shardCreate", (shard) => {
	shard.on("ready", () => {
		console.log(`Shard ${shard.id} launched`);
	});
});
