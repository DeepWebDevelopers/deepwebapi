const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");

module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "vote",
      aliases: ["startvote"],
      group: "util",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "vote_command",
      description: "vote on something",
      argsType: "multiple",
      guildOnly: true,
      ownerOnly: false,
      throttling: {
        usages: 3,
        duration: 25,
      },
      examples: [
        '!vote "Do you like to vote?" "I mean who doesn\'t right?!" 5',
      ],
      args: [
        {
          key: "question",
          prompt: "What is the vote question?",
          type: "string",
          validate: (question) => {
            if (question.length < 101 && question.length > 11) return true;
            return "Polling questions must be between 10 and 100 characters in length.";
          },
        },
        {
          key: "desc",
          prompt: "(Optional) Do you have more details?",
          type: "string",
          default: " ",
          validate: (desc) => {
            if (desc.length < 201 && desc.length > 11) return true;
            return "Polling questions must be between 10 and 200 characters in length.";
          },
        },
        {
          key: "time",
          prompt: "(Optional) How long should the vote last in minutes?",
          type: "integer",
          default: 0,
          validate: (time) => {
            if (time >= 0 && time <= 60) return true;
            return "Polling time must be between 0 and 60.";
          },
        },
      ],
    });
  }

  async run(msg, { question, desc, time }) {
    // ! Checks if the user is blacklisted or not!
    if (await isBlacklisted(message)) return;

    async function isBlacklisted(message) {
      const blacklist = require("../../db/blacklist");
      var isBanned = false;
      await blacklist.findOne(
        {
          userID: message.author.id,
        },
        (err, data) => {
          if (err) throw err;
          if (data) {
            isBanned = true;
            return message.reply(
              "You are blacklisted from using the bot! \n For more information on why, join our support server."
            );
          }
        }
      );
      if (isBanned) return true;
      return false;
    }
    var emojiList = ["👍", "👎", "🤷"];
    var embed = new Discord.MessageEmbed()
      .setTitle(question)
      .setDescription(desc)
      .setAuthor(msg.author.username, msg.author.displayAvatarURL)
      .setColor(0xd53c55) // Green: 0x00AE86
      .setTimestamp();

    if (time) {
      embed.setFooter(`The vote has started and will last ${time} minute(s)`);
    } else {
      embed.setFooter(`The vote has started and has no end time`);
    }

    //msg.delete(); // Remove the user's command message

    msg.channel
      .send({ embed }) // Use a 2d array?
      .then(async function (message) {
        var reactionArray = [];
        reactionArray[0] = await message.react(emojiList[0]);
        reactionArray[1] = await message.react(emojiList[1]);
        reactionArray[2] = await message.react(emojiList[2]);

        if (time) {
          setTimeout(() => {
            // Re-fetch the message and get reaction counts
            message.channel
              .fetchMessage(message.id)
              .then(async function (message) {
                var reactionCountsArray = [];
                for (var i = 0; i < reactionArray.length; i++) {
                  reactionCountsArray[i] =
                    message.reactions.get(emojiList[i]).count - 1;
                }

                // Find winner(s)
                var max = -Infinity,
                  indexMax = [];
                for (var i = 0; i < reactionCountsArray.length; ++i)
                  if (reactionCountsArray[i] > max)
                    (max = reactionCountsArray[i]), (indexMax = [i]);
                  else if (reactionCountsArray[i] === max) indexMax.push(i);

                // Display winner(s)
                console.log(reactionCountsArray); // Debugging votes
                var winnersText = "";
                if (reactionCountsArray[indexMax[0]] == 0) {
                  winnersText = "No one voted!";
                } else {
                  for (var i = 0; i < indexMax.length; i++) {
                    winnersText +=
                      emojiList[indexMax[i]] +
                      " (" +
                      reactionCountsArray[indexMax[i]] +
                      " vote(s))\n";
                  }
                }
                embed.addField("**Winner(s):**", winnersText);
                embed.setFooter(
                  `The vote is now closed! It lasted ${time} minute(s)`
                );
                embed.setTimestamp();
                message.edit("", embed);
              });
          }, time * 60 * 1000);
        }
      })
      .catch(console.error);
  }
};
