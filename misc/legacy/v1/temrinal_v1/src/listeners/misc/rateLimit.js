const Discord = require("discord.js");
module.exports = (client) => {
	client.on("rateLimit", (limit) => {
		console.log(`RATELIMITED:\n\n${JSON.stringify(limit, null, 4)}`);
	});
};

module.exports.config = {
	displayName: "Rate Limit",
	dbName: "Terminalrate",
	loadDBFirst: true,
};
