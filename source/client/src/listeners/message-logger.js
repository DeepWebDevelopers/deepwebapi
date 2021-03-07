module.exports = (client, instance, isEnabled) => {
	// Listen for messages
	client.on("message", (message) => {
		// Access the guild, required to see if this is enabled
		const { guild } = message;

		// If the guild exists and we are enabled within this guild
		// Remove the guild checek if you want this to be enabled in DMs
		if (guild && isEnabled(guild.id)) {
			// If this is enabled then log the content to the console
			console.log(message.content);
		}
	});
};

module.exports.config = {
	displayName: "Test",
	dbName: "TEST",
	loadDBFirst: true,
	testOnly: true, // Will now only work on test servers
};
