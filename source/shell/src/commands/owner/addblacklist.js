const mongo = require("../../../config/mongo");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "blacklist",
      aliases: ["bl"],
      group: "owner",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "owner_blacklist_command",
      description: "Added a user to the bots blacklist.",
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
    const blacklist = require("../../db/blacklist");

    const prefix = message.guild.commandPrefix;

    /**
     * @param {Message} message
     */

    const Target =
      message.guild.members.cache.get(args[0]) ||
      message.mentions.members.first();
    if (!Target) return message.channel.send("Enter someone to blacklist");

    var this_reason = args.slice(1).join(" ");
    if (!this_reason)
      var this_reason = "No reason for blacklist given by owner.";

    blacklist.findOne({ userID: Target.user.id }, async (err, data) => {
      if (err) throw err;
      if (data) {
        message.channel.send(
          `**${Target.displayName}** has already been blacklisted!`
        );
      } else {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();

        today = mm + "/" + dd + "/" + yyyy;

        // set today to something...

        data = new blacklist({
          userID: Target.user.id,
          userName: Target.user.tag,
          reason: this_reason,
          date: today,
        });
        data.save().catch((err) => console.log(err));
        message.channel.send(
          `${Target.user.tag} has been added to my blacklist. \n Reason: ${this_reason} \n Time: ${today}`
        );

        const blacklist_logs = message.client.channels.cache
          .get("832343773509058560")
          .send(
            new Discord.MessageEmbed()
              .setAuthor(
                `Another Spammer killed by ${message.author.tag}`,
                message.author.displayAvatarURL()
              )
              .setTitle("New User Blacklisted")
              .setColor("GREEN")
              .setDescription(
                `Another one has fallen...\n\n Reason: ${this_reason} \n User blacklisted: \`${Target.user.tag}\`, ID: (${Target.id}) \n Date of blacklist: ${today})`
              )
              .setTimestamp()
              .setFooter("To get unblacklisted read pins!")
          );
      }
    });
  }
};
