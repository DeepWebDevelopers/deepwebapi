const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "createtextchannel",
			aliases: ["ctc"],
			group: "creation",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			memberName: "createtextchannel_creation_command",
			description: "creates a text channel",
			argsType: "multiple",
			guildOnly: true,
			ownerOnly: true,
			throttling: {
				usages: 3,
				duration: 25,
			},
		});
	}
	async run(message, args, client) {
		const prefix = message.guild.commandPrefix;

		if (!message.member.hasPermission("MANAGE_CHANNELS", (explicit = true))) {
			const permEmbed = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setTitle("Create text channel unsuccessful")
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
				.setTitle("Create text channel unsuccessful")
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

		let modlog = message.guild.channels.cache.find((channel) =>
			channel.name.includes("t-modlog")
		);

		if (!modlog)
			message.channel.send(
				"**WARNING:** The owner did not setup Terminal, this means that actions will not be logged, it is highly recommended that you setup Terminal."
			);

		try {
			let topic;
			let cat;
			let nsfwyesno;
			let slowmode;
			let position;
			let minrole;
			let reason;
			let name;

			var settings = new Object();

			const filter = (msg) => msg.author.id === message.author.id;
			const options = {
				max: 1,
			};

			message.channel.send(
				"**Starting text channel creation process... Enter `cancel` anytime to end the process.**"
			);
			message.channel.send(
				"What is the topic of the channel? If you do not wish to have one, please enter `none`."
			);

			let collector = await message.channel.awaitMessages(filter, options);
			let answer = collector.first().content;

			if (answer === "cancel" || answer === "Cancel") {
				message.channel.send(
					`**Setup process ended, requested by ${message.author.tag}.**`
				);
				return;
			}

			topic = answer;
			settings.topic = topic;

			if (answer === "none" || answer === "None") {
				topic = null;
			}

			await message.channel.send(
				"Great! Which category should I create the channel in `Note: case sensitive`? If you do not wish to create a channel in a category, please enter `none`."
			);

			let collector2 = await message.channel.awaitMessages(filter, options);
			let answer2 = collector2.first().content;

			if (answer2 === "cancel" || answer2 === "Cancel") {
				message.channel.send(
					`**Setup process ended, requested by ${message.author.tag}.**`
				);
				return;
			}

			if (answer2 === "none" || answer2 === "None") {
				cat = null;
			}

			if (answer2 && answer2 !== "none") {
				cat = message.guild.channels.cache.find(
					(cat) => cat.name === `${answer2}` && cat.type === "category"
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
				"Awesome! Is the channel going to be an NSFW channel? Respond with a `yes` or a `no`"
			);

			let collector3 = await message.channel.awaitMessages(filter, options);
			let answer3 = collector3.first().content;

			if (answer3 === "cancel" || answer3 === "Cancel") {
				message.channel.send(
					`**Setup process ended, requested by ${message.author.tag}.**`
				);
				return;
			}

			if (answer3 === "yes" || answer3 === "Yes") {
				nsfwyesno = true;
				settings.nsfw = nsfwyesno;
			} else if (answer3 === "no" || answer3 === "No") {
				nsfwyesno = false;
			} else {
				message.channel.send(
					"Oh no! It looks like you did not respond with a `yes` or `no`. Please redo this procedure from the beginning."
				);
				return;
			}

			await message.channel.send(
				"Next, will this channel have a slowmode?\nIf yes, please enter one of the following: `5` `10` `15` `30` `60` `120` `300` `600` `900` `1800` `3600` `7200` `21600` *values are in seconds*\nIf no, please enter `none` or `0`"
			);

			let collector4 = await message.channel.awaitMessages(filter, options);
			let answer4 = collector4.first().content;

			if (answer4 === "cancel" || answer4 === "Cancel") {
				message.channel.send(
					`**Setup process ended, requested by ${message.author.tag}.**`
				);
				return;
			}

			if (answer4 === "none" || answer4 === "None" || answer4 === "0") {
				slowmode = null;
			}

			slowmode = parseInt(answer4);
			settings.rateLimitPerUser = slowmode;

			await message.channel.send(
				"What position will the channel be created? The higher the number, the higher up it will be created. *the highest number possible is `9007199254740991` but I don't see why you need that many channels lmao*"
			);

			let collector5 = await message.channel.awaitMessages(filter, options);
			let answer5 = collector5.first().content;

			if (answer5 === "cancel" || answer5 === "Cancel") {
				message.channel.send(
					`**Setup process ended, requested by ${message.author.tag}.**`
				);
				return;
			}

			position = parseInt(answer5);
			settings.position = position;

			if (isNaN(position)) {
				message.channel.send(
					"Oh no! It looks like you did not respond with a number. Please redo this procedure from the beginning."
				);
				return;
			}

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
				if (minrole === undefined) {
					message.channel.send(
						"Oh no! It looks like you did not respond with a valid role or I was unable to find it. Please redo this procedure from the beginning."
					);
					return;
				}

				settings.permissionOverwrites = [
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

			await message.channel.send(
				'Finally, what is the name of the channel? Remember, spaces will become "-" and all uppercase letters will be lowercase.'
			);

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

			message.guild.channels.create(name, settings);

			const setupcomplete = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setTitle("Setup complete!")
				.setAuthor(
					message.author.tag,
					message.author.avatarURL({ format: "png", dynamic: true })
				)
				.setDescription(
					`Enjoy your new channel! Click here [${answer7}] to go to the new channel.`
				)
				.setThumbnail(message.client.user.avatarURL())
				.setTimestamp()
				.setFooter("Thank you for using Terminal!");
			message.channel.send(setupcomplete);
		} catch {
			return message.channel.send(
				"There as been an error. Make sure you enter all steps properly. `If not I will cancel all steps`"
			);
		}
	}
};
