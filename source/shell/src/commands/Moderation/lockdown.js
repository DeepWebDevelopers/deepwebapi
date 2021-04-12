const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "lockdown",
      // aliases: [""],
      group: "moderation",
      userPermissions: ["SEND_MESSAGES"], // "MANAGE_GUILD", "MANAGE_CHANNELS"],
      clientPermissions: [
        "SEND_MESSAGES",
        "VIEW_CHANNEL",
        "MANAGE_GUILD",
        "MANAGE_CHANNELS",
      ],
      memberName: "lockdown_command",
      description: "Locks down a server.",
      argsType: "multiple",
      guildOnly: true,
      ownerOnly: true,
      throttling: {
        usages: 1,
        duration: 300000,
      },
    });
  }
  async run(message, args, client) {
    const prefix = message.guild.commandPrefix;

    let permErr =
      "**I Dont Have The Permissions To lockdown Channels! - **[MANAGE_CHANNELS]**, **[ADD_REACTIONS]**";
    if (!message.guild.me.hasPermission("MANAGE_CHANNELS"))
      return message.channel.send(permErr);
    if (!message.guild.me.hasPermission("ADD_REACTIONS"))
      return message.channel.send(permErr);

    if (!args[0])
      return message.reply("You need to say: `lockdown on` or `lockdown off`");
    const msg = await message.channel.send(
      "Are you sure you want to run `lockdown`? This command cant be ran again for 5 minutes."
    );
    await msg.react("✅");
    await msg.react("❌");
    const filter = (reaction, user) => {
      return (
        (reaction.emoji.name === "✅" || reaction.emoji.name === "❌") &&
        user.id === message.author.id
      );
    };

    msg
      .awaitReactions(filter, {
        max: 1,
        time: 60000,
        errors: ["time"],
      })
      .then(async (reaction) => {
        if (reaction.first().emoji.name === "✅") {
          try {
            let lockPermErr = new Discord.MessageEmbed()
              .setTitle("**User Permission Error!**")
              .setColor("RED")
              .setDescription(
                "**Sorry, you don't have permissions to use this! ❌**"
              )
              .setTimestamp();

            if (
              !message.channel
                .permissionsFor(message.member)
                .has("ADMINISTRATOR")
            )
              return message.channel.send(lockPermErr);

            if (!message.guild.me.hasPermission("MANAGE_CHANNELS"))
              return message.channel.send(
                "**I Dont Have The Permissions To Edit channel settings! - [MANAGE_CHANNELS]**"
              );

            if (!args[0])
              return message.reply(
                "You need to say: `lockdown on` or `lockdown off`"
              );

            const channels = message.guild.channels.cache.filter(
              (ch) => ch.type !== "category" && ch.type !== "voice"
            );

            //? Need to add a way to filter or block the command if the server is already on lockdown...
            // if (channels.name.includes("🔒")) {
            // 	return message.reply(
            // 		"This server is already locked down! Please run `lockdown off` to disable the lockdown!"
            // 	);
            // }
            if (args[0] === "on") {
              channels.forEach(async (channel) => {
                channel
                  .updateOverwrite(message.guild.roles.everyone, {
                    SEND_MESSAGES: false,
                  })
                  .then(async (g) => {
                    if (args[0] === "on") {
                      if (!g.name.endsWith("🔒")) {
                        g.edit({ name: g.name + " 🔒" });
                      }
                      // await console.log(`Locked Channels: ${g.name} (${g.id})`);
                    }
                  })
                  .catch((e) => {
                    return console.log(e);
                  });
              });

              let lockEmbed = new Discord.MessageEmbed()

                .setThumbnail(
                  `https://media.giphy.com/media/JozO6wdFcC81VPO6RS/giphy.gif`
                )
                .setDescription(`**\n\nDone! Server Fully Locked! 🔒**`)
                .setColor("#2F3136")
                .setFooter(`Locked by: ${message.author.tag}`);
              return await message.channel.send(lockEmbed);
            } else if (args[0] === "off") {
              channels.forEach(async (channel) => {
                channel
                  .updateOverwrite(message.guild.roles.everyone, {
                    SEND_MESSAGES: true,
                  })
                  .then(async (g) => {
                    if (args[0] === "off") {
                      if (g.name.endsWith("🔒")) {
                        g.edit({ name: g.name.replace(/\s*🔒/, "") });
                      }
                      // await console.log(
                      // 	`Removed Lockdown for: ${g.name} (${g.id})`
                      // );
                    }
                  })
                  .catch((e) => {
                    return console.log(e);
                  });
              });

              let lockEmbed2 = new Discord.MessageEmbed()
                .setColor("#2F3136")
                .setFooter(`Unlocked by: ${message.author.tag}`)
                .setThumbnail(
                  `https://media.giphy.com/media/JozO6wdFcC81VPO6RS/giphy.gif`
                )
                .setDescription(`**\n\nDone! Server Fully Unlocked! 🔓**`);
              return await message.channel.send(lockEmbed2).catch((err) => {
                return console.log(err);
              });
            }
          } catch (err) {
            console.log(err);
            message.reply(`There was an err running the lockdown: ${err}`);
            return;
          }
        } else if (reaction.first().emoji.name === "❌") {
          const embed = new Discord.MessageEmbed()
            .setDescription(
              `Command has been canceled by ${message.author.tag}`
            )
            .setColor("GREEN")
            .setTimestamp();
          message.channel.send(embed).catch((err) => {
            return console.log(err);
          });
        }
      })
      .catch((err) => {
        console.log(err);
        const embed = new Discord.MessageEmbed()
          .setTitle(`Error Detected`)
          .setDescription(
            `:no_entry: You Have Ran Out Of Time To Respond. Please Try Again. :no_entry:`
          )
          .setColor(`RED`);
        return message.channel.send(embed);
      });
  }
};

/**
 * if (!message.guild.me.hasPermission("MANAGE_CHANNELS"))
			return message.channel.send(
				"**I Dont Have The Permissions To lockdown Channels! - [MANAGE_CHANNELS]**"
			);
		const msg = await message.channel.send(
			"Are you sure you want to lockdown the server? This command cant be ran again for 5 minutes."
		);
		await msg.react("✅");
		await msg.react("❌");
		const filter = (reaction, user) => {
			return (
				(reaction.emoji.name === "✅" || reaction.emoji.name === "❌") &&
				user.id === message.author.id
			);
		};

		msg
			.awaitReactions(filter, {
				max: 1,
				time: 60000,
				errors: ["time"],
			})
			.then(async (reaction) => {
				if (reaction.first().emoji.name === "✅") {
					try {
						let lockPermErr = new Discord.MessageEmbed()
							.setTitle("**User Permission Error!**")
							.setColor("RED")
							.setDescription(
								"**Sorry, you don't have permissions to use this! ❌**"
							)
							.setTimestamp();

						if (
							!message.channel
								.permissionsFor(message.member)
								.has("ADMINISTRATOR")
						)
							return message.channel.send(lockPermErr);

						if (!message.guild.me.hasPermission("MANAGE_CHANNELS"))
							return message.channel.send(
								"**I Dont Have The Permissions To Edit channel settings! - [MANAGE_CHANNELS]**"
							);

						const channels = message.guild.channels.cache.filter(
							(ch) => ch.type !== "category"
						);
						if (args[0] === "on") {
							channels.forEach(async (channel) => {
								channel
									.updateOverwrite(message.guild.roles.everyone, {
										SEND_MESSAGES: false,
									})
									.then(async (g) => {
										if (args[0] === "on") {
											if (!g.name.endsWith("🔒")) {
												g.edit({ name: g.name + " 🔒" });
											}
											// await console.log(`Locked Channels: ${g.name} (${g.id})`);
										}
									})
									.catch((e) => {
										return console.log(e);
									});
							});

							let lockEmbed = new Discord.MessageEmbed()

								.setThumbnail(
									`https://media.giphy.com/media/JozO6wdFcC81VPO6RS/giphy.gif`
								)
								.setDescription(`**\n\nDone! Server Fully Locked! 🔒**`)
								.setColor("#2F3136")
								.setFooter(`Locked by: ${message.author.tag}`);
							return await message.channel.send(lockEmbed);
						} else if (args[0] === "off") {
							channels.forEach(async (channel) => {
								channel
									.updateOverwrite(message.guild.roles.everyone, {
										SEND_MESSAGES: true,
									})
									.then(async (g) => {
										if (args[0] === "off") {
											if (g.name.endsWith("🔒")) {
												g.edit({ name: g.name.replace(/\s*🔒/, "") });
											}
											// await console.log(
											// 	`Removed Lockdown for: ${g.name} (${g.id})`
											// );
										}
									})
									.catch((e) => {
										return console.log(e);
									});
							});

							let lockEmbed2 = new Discord.MessageEmbed()
								.setColor("#2F3136")
								.setFooter(`Unlocked by: ${message.author.tag}`)
								.setThumbnail(
									`https://media.giphy.com/media/JozO6wdFcC81VPO6RS/giphy.gif`
								)
								.setDescription(`**\n\nDone! Server Fully Unlocked! 🔓**`);
							return await message.channel.send(lockEmbed2).catch((err) => {
								return console.log(err);
							});
						}
					} catch {
						console.log(err);
						message.reply(`There was an err running the lockdown: ${err}`);
						return;
					}
				} else if (reaction.first().emoji.name === "❌") {
					const embed = new Discord.MessageEmbed()
						.setDescription(
							`Command has been canceled by ${message.author.tag}`
						)
						.setColor("GREEN")
						.setTimestamp();
					message.channel.send(embed).catch((err) => {
						return console.log(err);
					});
				}
			})
			.catch(() => {
				const embed = new Discord.MessageEmbed()
					.setTitle(`Error Detected`)
					.setDescription(
						`:no_entry: You Have Ran Out Of Time To Respond. Please Try Again. :no_entry:`
					)
					.setColor(`RED`);
				return message.channel.send(embed);
			});
 */
