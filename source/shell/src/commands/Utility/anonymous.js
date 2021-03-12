module.exports = {
	name: "anonymous",
	minArgs: 1,
	maxArgs: -1,
	cooldown: "20s",
	expectedArgs: "<message>",
	description: "Send a message anonymously",
	category: "Utility",
	run: async ({ message, args, text, client, prefix, instance }) => {
		let attachments = message.attachments.array();
		if (attachments.length > 0)
			return message.reply("Please send attachments as links");

		let msg = args.slice(0).join(" ");

		if (msg.includes("@everyone"))
			return message.channel.send(
				"Message cannot include mentioning everyone."
			);
		if (msg.includes("@here"))
			return message.channel.send("Message cannot include mentioning here.");
		if (msg.includes(`${prefix}anonymous`))
			return message.channel.send("Message cannot include the command itself");

		if (!msg) return message.channel.send("Don't send an empty message");

		let linkregex = /(ftp|http|https):\/\/[^ "]+/g;

		if (linkregex.test(msg)) {
			let new_msg = msg.replace(linkregex, "<$&>");
			message.channel.send(new_msg);
			setTimeout(async () => {
				message.delete();
			}, 500);
		} else {
			message.channel.send(msg);
			setTimeout(async () => {
				message.delete();
			}, 500);
		}
	},
};
