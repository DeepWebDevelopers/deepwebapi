const process = require("child_process");
module.exports = {
	name: "eval",
	minArgs: 1,
	maxArgs: -1,
	expectedArgs: "<command to run>",
	description: "Run a child process in Discord",
	category: "Bot Owner",
	ownerOnly: true,
	run: async ({ message, args, text, client, prefix, instance }) => {
		//Execute command specified and send the result
		process.exec(args.join(" "), (error, stdout) => {
			let response = error || stdout;
			if (response.length > 2000) response = response.substr(0, 1997) + "...";
			message.channel
				.send(response, {
					code: "asciidoc",
					split: "\n",
				})
				.catch((err) => message.channel.send(err));
		});

		return;
	},
};
