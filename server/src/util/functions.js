const fs = require("fs");
function loadEvents(client) {
	//! Event-Handler
	fs.readdir(__dirname + "/events/", (err, files) => {
		if (err) return console.error(err);
		files.forEach((file) => {
			const event = require(__dirname + `/events/${file}`);
			let eventName = file.split(".")[0];
			client.on(eventName, event.bind(null, client));
			console.log("Loading Event: " + eventName);
		});
	});
}

module.exports = {
	loadEvents,
};
