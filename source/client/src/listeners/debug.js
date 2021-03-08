const Discord = require("discord.js");
module.exports = (client) => {
	client.on("debug", (data) => console.log(data));
};

module.exports.config = {
	displayName: "Debug",
	dbName: "Terminaldebug",
	loadDBFirst: true,
};
