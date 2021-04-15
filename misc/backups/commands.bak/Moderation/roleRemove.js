const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "removerole",
      // aliases: ["-role"],
      group: "moderation",
      userPermissions: ["SEND_MESSAGES", "MANAGE_ROLES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "MANAGE_ROLES"],
      memberName: "remove_role_command",
      description: "removes a role from a user",
      argsType: "multiple",
      guildOnly: true,
      throttling: {
        usages: 3,
        duration: 60,
      },
    });
  }
  async run(message, args, client) {
    const prefix = message.guild.commandPrefix;

    let rMember =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);

    if (!rMember)
      return message.channel.send(
        "Please provide a user to remove a role from."
      );

    let role =
      message.guild.roles.cache.find((r) => r.name == args[1]) ||
      message.guild.roles.cache.find((r) => r.id == args[1]) ||
      message.mentions.roles.first();
    let staff = message.member;
    if (staff.roles.highest.position < rMember.roles.highest.position)
      return message
        .reply(
          `You cannot remove role of: ` +
            "`" +
            `${role}` +
            "`" +
            `due to role hierarchy. AKA: There to powerful for you ;) ;)`
        )
        .catch((err) => {
          console.log(err);
        });

    if (!role)
      return message.channel.send(
        "Please provide a role to remove from said user."
      );

    if (!message.guild.me.hasPermission(["MANAGE_ROLES"]))
      return message.channel.send(
        "I don't have permission to perform this command. Please give me Manage Roles Permission!"
      );

    if (!rMember.roles.cache.has(role.id)) {
      let rolDEL_err = new Discord.MessageEmbed()
        .setColor(`#FF0000`)
        .setTimestamp()
        .setDescription(
          `Error ❌ | ${rMember.displayName}, Does not have this role!`
        );

      return message.channel.send(rolDEL_err);
    } else {
      await rMember.roles.remove(role.id).catch((e) => console.log(e.message));

      let rolDEL = new Discord.MessageEmbed()
        .setColor(`#00FF00`)
        .setDescription(
          `Success ✅ | ${rMember} has been removed from role: **${role.name}**`
        );

      message.channel.send(rolDEL);
    }
  }
};
