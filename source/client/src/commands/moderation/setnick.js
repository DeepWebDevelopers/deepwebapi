const Discord = require("discord.js");
const mongo = require("../../mongo");
const nickSchema = require("../../db/nicknames");

module.exports = {
	name: "setnick",
	requiredPermissions: ["MANAGE_NICKNAMES", "CHANGE_NICKNAME"],
	minArgs: 1,
	maxArgs: -1,
	expectedArgs: "[mention] <new name>",
	description: "Change a nickname",
	category: "Moderation",
	run: async ({ message, args, text, client, prefix, instance }) => {
		let modlog = message.guild.channels.cache.find((channel) => {
			return channel.name && channel.name.includes("t-modlog");
		});
		if (!modlog)
			message.channel.send(
				`Could not find channel **t-modlog**, please install the required values using \`${prefix}setup\` as it is HIGHLY recommended.`
			);

		let target = message.mentions.members.first();

		if (target) {
			let targetTag = `${target.user.username}#${target.user.discriminator}`;
			let targetId = target.id;

			let staff = message.member;
			let staffId = staff.id;
			let staffTag = `${staff.user.username}#${staff.user.discriminator}`;

			let oldName = {
				name: target.displayName,
				moderator: staffTag,
				moderatorId: staffId,
			};

			let newName = args.slice(1).join(" ");
			if (!newName) return message.reply("Please provide a new nickname.");
			if (newName.length > 32)
				return message.reply(
					"New nickname cannot be longer than 32 characters"
				);
			if (newName.length < 2)
				return message.reply("New nickname cannot be longer than 2 characters");

			if (staff.roles.highest.position < target.roles.highest.position)
				return message.reply(
					`You cannot change ${targetTag}'s nickname due to role hierarchy.`
				);
			if (target === message.guild.owner)
				return message.reply(
					`You/I cannot change ${targetTag}'s nickname because they are the owner of the server.`
				);

			await mongo().then(async (mongoose) => {
				try {
					let data = await nickSchema.findOne({
						userId: targetId,
						guildId: message.guild.id,
					});

					if (!data) {
						let newData = await nickSchema.create({
							userId: targetId,
							userTag: targetTag,
							guildId: message.guild.id,
							guildName: message.guild.name,
							nicknames: [Object],
							lastUpdated: Date.now(),
						});

						data = newData;
					}

					await nickSchema.findOneAndUpdate(
						{
							userId: targetId,
							guildId: message.guild.id,
						},
						{
							userId: targetId,
							guildId: message.guild.id,
							$push: {
								nicknames: oldName,
							},
						},
						{
							upsert: true,
						}
					);

					await target.setNickname(newName);

					const success = new Discord.MessageEmbed()
						.setColor("RANDOM")
						.setTitle("Nickname change successful")
						.setDescription(
							`Successfully changed **${targetTag}'s** nickname to **${newName}**.`
						)
						.setAuthor(
							message.author.tag,
							message.author.avatarURL({
								format: "png",
							})
						)
						.setThumbnail(message.client.user.avatarURL())
						.setTimestamp()
						.setFooter("Thank you for using Terminal!");

					message.channel.send(success);

					const modlogEmbed = new Discord.MessageEmbed()
						.setColor("RANDOM")
						.setTitle("Nickname changed")
						.setAuthor("Terminal Modlog")
						.addFields(
							{
								name: "Moderator: ",
								value: `${staffTag} (${staffId})`,
							},
							{
								name: "Moderated on: ",
								value: `${targetTag} (${targetId})`,
							},
							{
								name: "Old nickname: ",
								value: `${oldName.name}`,
								inline: true,
							},
							{
								name: "New nickname: ",
								value: `${newName}`,
								inline: true,
							},
							{
								name: "Date: ",
								value: `${data.lastUpdated.toLocaleString()}`,
							}
						)
						.setThumbnail(message.client.user.avatarURL())
						.setTimestamp()
						.setFooter("Thank you for using Terminal!");

					modlog.send(modlogEmbed).catch((e) => {
						return;
					});
				} catch (err) {
					console.log(err);
					message.channel.send(`An error occurred: \`${err.message}\``);
				}
			});
		} else if (!target) {
			target = message.member;
			let targetTag = `${target.user.username}#${target.user.discriminator}`;
			let targetId = target.id;

			let staff = message.member;
			let staffId = staff.id;
			let staffTag = `${staff.user.username}#${staff.user.discriminator}`;

			let oldName = {
				name: target.displayName,
				moderator: staffTag,
				moderatorId: staffId,
			};

			let newName = args.slice(0).join(" ");
			if (!newName) return message.reply("Please provide a new nickname.");
			if (newName.length > 32)
				return message.reply(
					"New nickname cannot be longer than 32 characters"
				);
			if (newName.length < 2)
				return message.reply("New nickname cannot be longer than 2 characters");

			if (target === message.guild.owner)
				return message.reply(
					`I cannot change ${targetTag}'s nickname because they are the owner of the server.`
				);

			await mongo().then(async (mongoose) => {
				try {
					let data = await nickSchema.findOne({
						userId: targetId,
						guildId: message.guild.id,
					});

					if (!data) {
						let newData = await nickSchema.create({
							userId: targetId,
							userTag: targetTag,
							guildId: message.guild.id,
							guildName: message.guild.name,
							nicknames: [Object],
							lastUpdated: Date.now(),
						});

						data = newData;
					}

					await nickSchema.findOneAndUpdate(
						{
							userId: targetId,
							guildId: message.guild.id,
						},
						{
							userId: targetId,
							guildId: message.guild.id,
							$push: {
								nicknames: oldName,
							},
						},
						{
							upsert: true,
						}
					);

					await target.setNickname(newName);

					const success = new Discord.MessageEmbed()
						.setColor("RANDOM")
						.setTitle("Nickname change successful")
						.setDescription(
							`Successfully changed **${targetTag}'s** nickname to **${newName}**.`
						)
						.setAuthor(
							message.author.tag,
							message.author.avatarURL({
								format: "png",
							})
						)
						.setThumbnail(message.client.user.avatarURL())
						.setTimestamp()
						.setFooter("Thank you for using Terminal!");

					message.channel.send(success);

					const modlogEmbed = new Discord.MessageEmbed()
						.setColor("RANDOM")
						.setTitle("Nickname changed")
						.setAuthor("Terminal Modlog")
						.addFields(
							{
								name: "Moderator: ",
								value: `${staffTag} (${staffId})`,
							},
							{
								name: "Moderated on: ",
								value: `${targetTag} (${targetId})`,
							},
							{
								name: "Old nickname: ",
								value: `${oldName.namess}`,
								inline: true,
							},
							{
								name: "New nickname: ",
								value: `${newName}`,
								inline: true,
							},
							{
								name: "Date: ",
								value: `${data.lastUpdated.toLocaleString()}`,
							}
						)
						.setThumbnail(message.client.user.avatarURL())
						.setTimestamp()
						.setFooter("Thank you for using Terminal!");

					modlog.send(modlogEmbed).catch((e) => {
						return;
					});
				} catch (err) {
					console.log(err);
					message.channel.send(`An error occurred: \`${err.message}\``);
				}
			});
		}
	},
};
