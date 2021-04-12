const { ShardingManager } = require("discord.js");
const config = require("./config/config.json");
const manager = new ShardingManager("./src/terminal.js", {
  token: config.token,
});

manager.on(
  "shardCreate",
  async (shard) => await console.log(`< < < Launched shard ${shard.id} > > >`)
);
manager.spawn();

// manager.on("message", (shard, message) => {
// 	console.log(`Shard[${shard.id}] : ${message._eval} : ${message._result}`);
// });
