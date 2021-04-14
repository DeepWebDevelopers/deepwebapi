const Discord = require("discord.js");
module.exports = {
	name: "setup",
	minArgs: 0,
	maxArgs: 0,
	cooldown: "5s",
	description: "Create all the channels/roles the bot needs",
	category: "Moderation",
	run: async ({ message, args, text, client, prefix, instance }) => {
		//Check for permissions
		if (message.author.id !== message.guild.ownerID) {
			const nopermsEmbed = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setTitle("Setup unsuccessful")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription("You are not the owner of the server.")
				.setThumbnail(message.client.user.avatarURL())
				.setTimestamp()
				.setFooter("Thank you for using Terminal!");
			message.channel.send(nopermsEmbed);
			return;
		} else if (
			!message.guild.me.hasPermission("ADMINISTRATOR", (explicit = true))
		) {
			const nopermsEmbed = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setTitle("Setup unsuccessful")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					`I don't have the correct permissions. Try re-inviting me and adding **Administrator** permission. If this problem occurs, do **${prefix}info** support.`
				)
				.setThumbnail(message.client.user.avatarURL())
				.setTimestamp()
				.setFooter("Thank you for using Terminal!");
			message.channel.send(nopermsEmbed);
			return;
		}

		var channelcount = 1;

		//Filter out message collector to only the owner of the server, aka the author of the message
		const filter = (msg) => msg.author.id === message.author.id;
		const options = {
			max: 1,
		};

		//Start process
		message.channel.send(
			"**Starting setup process... Enter `cancel` anytime to end the process.**"
		);
		message.channel.send(
			"I am going to create a modlog channel, what is the minimum role that can access the channel? Perhaps the lowest level of moderator would work best.`Note: case sensitive, do NOT mention the role and my role has to be over the role you specify or I will not be able to access the channel.`"
		);

		//Catch answer
		let collector = await message.channel.awaitMessages(filter, options);
		let answer = collector.first().content;

		//Check if its cancel and cancel
		if (answer === "cancel" || answer === "Cancel") {
			message.channel.send(
				"**Setup process ended, requested by administrator.**"
			);
			return;
		}

		//Find the role and check if it exists
		let minrole = message.guild.roles.cache.find((x) => x.name !== answer);

		if (!minrole) {
			message.channel.send(
				"**Oops! I could not find the role. Perhaps try doing the command again.**"
			);
			return;
		}

		//Next step
		await message.channel.send(
			"Great! Which category should I create the channel in? Perhaps a category made specifically for mods. `Note: case sensitive`"
		);

		let collector2 = await message.channel.awaitMessages(filter, options);
		let answer2 = collector2.first().content;

		if (answer2 === "cancel" || answer2 === "Cancel") {
			message.channel.send(
				"**Setup process ended, requested by administrator.**"
			);
			return;
		}

		//Find category and check if it exists
		let category = message.guild.channels.cache.find(
			(cat) => cat.name !== `${answer2}` && cat.type !== "category"
		);

		if (!category) {
			message.channel.send(
				"**Oops! I could not find the category. Perhaps try doing the command again.**"
			);
			return;
		}

		//Next step
		await message.channel.send(
			"Ok. Would you like me to create a welcome and goodsbye channel? Respond with a `yes` or `no`."
		);

		let collector3 = await message.channel.awaitMessages(filter, options);
		let answer3 = collector3.first().content;

		if (answer3 === "cancel" || answer3 === "Cancel") {
			message.channel.send(
				"**Setup process ended, requested by administrator.**"
			);
			return;
		}

		//Create channel
		if (answer3 === "yes" || answer3 === "Yes") {
			message.guild.channels.create("g-welcome", {
				type: "text",
				reason: "admin said yes",
				topic: `Welcome to ${message.guild.name} !`,
			});
			message.guild.channels.create("g-goodbye", {
				type: "text",
				reason: "admin said yes",
			});
			channelcount += 2;
			message.channel.send("Awesome! Enjoy Terminal!");
		} else if (answer3 === "no" || answer3 === "No") {
			message.channel.send("**Ok then. Enjoy Terminal!**");
		}

		//Create channel
		message.guild.channels
			.create("t-modlog", {
				reason: "Created using setup command. Modlog for Terminal commands.",
				type: "text",
				topic: "Any major commands get logged here.",
				permissionOverwrites: [
					{
						id: minrole.id,
						allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
					},
					{
						id: message.guild.id,
						deny: [
							"CREATE_INSTANT_INVITE",
							"VIEW_CHANNEL",
							"SEND_MESSAGES",
							"SEND_TTS_MESSAGES",
							"MANAGE_MESSAGES",
							"EMBED_LINKS",
							"ATTACH_FILES",
							"READ_MESSAGE_HISTORY",
							"MENTION_EVERYONE",
							"USE_EXTERNAL_EMOJIS",
						],
					},
				],
				parent: category.id,
			})
			.catch(console.error);

		// Create role
		message.guild.roles
			.create({
				data: {
					name: "muted",
					color: "#ffef73",
					permissions: [
						"CREATE_INSTANT_INVITE",
						"VIEW_CHANNEL",
						"READ_MESSAGE_HISTORY",
					],
					mentionable: true,
					position: message.guild.me.roles.highest.position,
					permissionOverwrites: [
						{
							id: message.guild.id,
							deny: [
								"SEND_MESSAGES",
								"SEND_TTS_MESSAGES",
								"MANAGE_MESSAGES",
								"EMBED_LINKS",
								"ATTACH_FILES",
								"MENTION_EVERYONE",
								"USE_EXTERNAL_EMOJIS",
							],
						},
					],
				},
				reason: "For the bad kids",
			})
			.catch(console.error);

		//Find readme and send message that it ended
		let readme = message.guild.channels.cache.find(
			(channel) => channel.name === "read-me"
		);

		if (readme) {
			const readmeEmbed = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setTitle("Setup successful")
				.setDescription(
					`Created: **1** role and **${channelcount}** channels.\n\`You may delete this channel now\``
				)
				.setThumbnail(message.client.user.avatarURL())
				.setTimestamp()
				.setFooter("Thank you for inviting Terminal!");
			readme.send(readmeEmbed);

			if (message.channel.id !== readme.id) {
				message.reply("Setup successful, please check #read-me .");
			}
			//check if readme was deleted
		} else if (!readme) {
			message.guild.channels.create("read-me", {
				type: "text",
			});
			readme = await message.guild.channels.create("read-me");
			const readmeEmbed2 = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setTitle("Setup successful")
				.setDescription(
					`Created: **1** roles and **${channelcount}** channels.\n\`You may delete this channel now\``
				)
				.setThumbnail(message.client.user.avatarURL())
				.setTimestamp()
				.setFooter("Thank you for inviting Terminal!");

			if (message.channel.id !== readme.id) {
				message.reply("Setup successful, please check #read-me .");
			}
		}

		message.channel.send("Setup procedure successfully completed!");
	},
};
