module.exports = (client) => {
	const config = require("../../../../config/config.json");

	console.log(
		`< < < | | | ${client.user.username} is available now! | | | > > >`
	);
	let totalUsers = client.guilds.cache.reduce(
		(acc, value) => acc + value.memberCount,
		0
	);
	var activities = [
			`${client.guilds.cache.size} servers`,
			`${totalUsers} users!`,
		],
		i = 0;
	setInterval(
		() =>
			client.user.setActivity(
				`My Development`, // ${config.prefix}help | ${activities[i++ % activities.length]}
				{ type: "WATCHING" }
			),
		5000
	);

	// let serverText = "servers";
	// if (client.guilds.cache.size === 1) serverText = "server";

	// client.user.setPresence({
	// 	activity: {
	// 		name: `@help | ${client.guilds.cache.size} ${serverText}`,
	// 		type: "STREAMING",
	// 		url: `https://www.youtube.com/watch?v=AhT83rwwF44`, //get noobed
	// 	},
	// 	status: "online",
	// });

	// console.log(`Logged in as [${client.user.tag}]`);
};

module.exports.config = {
	displayName: "ready",
	dbName: "Terminal",
	loadDBFirst: false,
};
