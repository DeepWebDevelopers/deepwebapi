const Discord = require("discord.js");
module.exports = {
	name: "createvoicechannel",
	aliases: ["cvc"],
	minArgs: 0,
	maxArgs: 0,
	description: "Create a voice channel",
	category: "Moderation",
	run: async ({ message, args, text, client, prefix, instance }) => {
		if (!message.member.hasPermission("MANAGE_CHANNELS", (explicit = true))) {
			const permEmbed = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setTitle("Create voice channel unsuccessful")
				.setAuthor(
					message.author.tag,
					message.author.avatarURL({ format: "png", dynamic: true })
				)
				.setDescription("You don't have the correct permissions.")
				.setThumbnail(message.client.user.avatarURL())
				.setTimestamp()
				.setFooter("Thank you for using Terminal!");
			message.channel.send(permEmbed);
			return;
		} else if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) {
			const permEmbed2 = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setTitle("Create voice channel unsuccessful")
				.setAuthor(
					message.author.tag,
					message.author.avatarURL({ format: "png", dynamic: true })
				)
				.setDescription(
					"I don't have the correct permissions. Try re-inviting me and adding `Manage Channels` permission. If this problem occurs, do g?info support."
				)
				.setThumbnail(message.client.user.avatarURL())
				.setTimestamp()
				.setFooter("Thank you for using Terminal!");
			message.channel.send(permEmbed2);
			return;
		}

		let modlog = message.guild.channels.cache.find(
			(channel) => channel.name === "t-modlog"
		);

		if (!modlog)
			message.channel.send(
				"**WARNING:** The owner did not setup Terminal, this means that actions will not be logged, it is highly recommended that you setup Terminal."
			);

		try {
			let name;
			let bitrate;
			let userlimit;
			let minrole;
			let cat;
			let reason;
			let position;

			var settings = new Object();

			const filter = (msg) => msg.author.id === message.author.id;
			const options = {
				max: 1,
			};

			message.channel.send(
				"**Starting text channel creation process... Enter `cancel` anytime to end the process.**"
			);
			message.channel.send(
				"What will the bitrate be? Enter a number between `8` and `96` (default is 64).\n`Note, anything higher than 64 can be unstable for people with a poor internet connection!`"
			);

			let collector = await message.channel.awaitMessages(filter, options);
			let answer = collector.first().content;

			if (answer === "cancel" || answer === "Cancel") {
				message.channel.send(
					`**Setup process ended, requested by ${message.author.tag}.**`
				);
				return;
			}

			bitrate = parseInt(answer);

			if (isNaN(bitrate)) {
				message.channel.send(
					"Oh no! It looks like you did not respond with number. Please redo this procedure from the beginning."
				);
				return;
			}

			if (bitrate < 8 || bitrate > 96) {
				message.channel.send(
					"Oh no! It looks like you responded with an invalid number. Please redo this procedure from the beginning."
				);
				return;
			}

			bitrate = bitrate * 1000;
			settings.bitrate = bitrate;

			await message.channel.send(
				"Next, is there a user limit to this channel?\nIf yes, respond with a number between `1` and `99`.\nIf not, please respond with a `no`."
			);

			let collector2 = await message.channel.awaitMessages(filter, options);
			let answer2 = collector2.first().content;

			if (answer2 === "cancel" || answer2 === "Cancel") {
				message.channel.send(
					`**Setup process ended, requested by ${message.author.tag}.**`
				);
				return;
			}

			userlimit = parseInt(answer2);

			if (isNaN(userlimit)) {
				message.channel.send(
					"Oh no! It looks like you did not respond with number. Please redo this procedure from the beginning."
				);
				return;
			}

			if (userlimit < 1 || userlimit > 99) {
				message.channel.send(
					"Oh no! It looks like you responded with an invalid number. Please redo this procedure from the beginning."
				);
				return;
			}

			settings.userLimit = userlimit;

			await message.channel.send(
				"Ok, which category should I create the channel in? `Note: case sensitive`\nIf you do not wish to create a voice channel in a category, please respond with a `none`"
			);

			let collector3 = await message.channel.awaitMessages(filter, options);
			let answer3 = collector3.first().content;

			if (answer3 === "cancel" || answer3 === "Cancel") {
				message.channel.send(
					`**Setup process ended, requested by ${message.author.tag}.**`
				);
				return;
			}

			if (answer3 === "none" || answer3 === "None") {
				cat = null;
			}

			if (answer3 && answer3 !== "none") {
				cat = message.guild.channels.cache.find(
					(cat) => cat.name === `${answer3}` && cat.type === "category"
				);
				settings.parent = cat.id;
			}

			if (cat === undefined) {
				message.channel.send(
					"Oh no! It looks like you did not respond with a valid category or I could not find it. Please redo this procedure from the beginning."
				);
				return;
			}

			await message.channel.send(
				"What position will the channel be created? The higher the number, the higher up it will be created. *the highest number possible is `9007199254740991` but I don't see why you need that many channels lmao*"
			);

			let collector4 = await message.channel.awaitMessages(filter, options);
			let answer4 = collector4.first().content;

			if (answer4 === "cancel" || answer4 === "Cancel") {
				message.channel.send(
					`**Setup process ended, requested by ${message.author.tag}.**`
				);
				return;
			}

			position = parseInt(answer4);

			if (isNaN(position)) {
				message.channel.send(
					"Oh no! It looks like you did not respond with a number. Please redo this procedure from the beginning."
				);
				return;
			}

			settings.position = position;

			await message.channel.send(
				"Ok, what is the minimum role that can access this channel `Note: case sensitive and do NOT mention the role`? If you do not wish to have a role, please enter with a `none`."
			);

			let collector6 = await message.channel.awaitMessages(filter, options);
			let answer6 = collector6.first().content;

			if (answer6 === "cancel" || answer6 === "Cancel") {
				message.channel.send(
					`**Setup process ended, requested by ${message.author.tag}.**`
				);
				return;
			}

			if (answer6 === "none" || answer6 === "None") {
				minrole = null;
			} else {
				minrole = message.guild.roles.cache.find((x) => x.name === answer6);
				if (!minrole) {
					message.channel.send(
						"Oh no! It looks like you did not respond with a valid role or I was unable to find it. Please redo this procedure from the beginning."
					);
					return;
				}
				settings.permissionOverwrites = [
					{
						id: minrole.id,
						allow: ["VIEW_CHANNEL", "CONNECT", "SPEAK"],
					},
					{
						id: message.guild.id,
						deny: ["CREATE_INSTANT_INVITE", "VIEW_CHANNEL", "CONNECT", "SPEAK"],
					},
				];
			}

			await message.channel.send(
				"Almost done! Is there a reason for creating the channel? If not, respond with a `no`."
			);

			let collector7 = await message.channel.awaitMessages(filter, options);
			let answer7 = collector7.first().content;

			if (answer7 === "cancel" || answer7 === "Cancel") {
				message.channel.send(
					`**Setup process ended, requested by ${message.author.tag}.**`
				);
				return;
			}

			reason = answer7;

			if (answer7 === "no" || answer7 === "No") {
				reason = "No reason provided";
			}

			settings.reason = reason;

			await message.channel.send("Finally, what is the name of the channel?");

			let collector8 = await message.channel.awaitMessages(filter, options);
			let answer8 = collector8.first().content;

			if (answer8 === "cancel" || answer8 === "Cancel") {
				message.channel.send(
					`**Setup process ended, requested by ${message.author.tag}.**`
				);
				return;
			}

			name = answer8;
			//-----------------------------------

			settings.type = "voice";
			message.guild.channels.create(name, settings);

			const setupcomplete = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setTitle("Setup complete!")
				.setAuthor(
					message.author.tag,
					message.author.avatarURL({ format: "png", dynamic: true })
				)
				.setDescription("Enjoy your new channel!")
				.setThumbnail(message.client.user.avatarURL())
				.setTimestamp()
				.setFooter("Thank you for using Terminal!");
			message.channel.send(setupcomplete);
		} catch {
			return message.channel.send(
				"There as been an error. Make sure you enter all steps properly. `If not I will cancel all steps`"
			);
		}
	},
};
