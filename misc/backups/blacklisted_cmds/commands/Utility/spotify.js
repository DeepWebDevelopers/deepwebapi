const canvacord = require("canvacord");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "spotify",
      // aliases: [""],
      group: "util",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "spotify_status_command",
      description: "Displays a user's Spotify status",
      argsType: "multiple",
      guildOnly: true,
      ownerOnly: true,
      throttling: {
        usages: 1,
        duration: 25,
      },
    });
  }
  async run(message, args, client) {
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
    const prefix = message.guild.commandPrefix;

    let listeningPresence;
    let target = message.mentions.members.first() || message.member;

    if (target.presence.activities.length === 1)
      listeningPresence = target.presence.activities[0];
    else if (target.presence.activities.length > 1)
      listeningPresence = target.presence.activities[1];

    if (
      target.presence.activities.length === 0 ||
      (listeningPresence.name !== "Spotify" &&
        listeningPresence.type !== "LISTENING")
    )
      return message.channel.send(
        `${target.displayName} is not listening to Spotify.`
      );

    if (
      listeningPresence !== null &&
      listeningPresence.type === "LISTENING" &&
      listeningPresence.name === "Spotify" &&
      listeningPresence.assets !== null
    ) {
      let spCard = new canvacord.Spotify()
        .setAlbum(listeningPresence.assets.largeText)
        .setAuthor(listeningPresence.state.replace(/\;/g, ","))
        .setEndTimestamp(listeningPresence.timestamps.end)
        .setStartTimestamp(listeningPresence.timestamps.start)
        .setImage(
          `https://i.scdn.co/image/${
            listeningPresence.assets.largeImage.split(":")[1]
          }`
        )
        .setTitle(listeningPresence.details)
        .setProgressBar("BAR", "#1ED760");

      spCard.build().then((data) => {
        let att = new Discord.MessageAttachment()
          .setFile(data)
          .setName("spotifyCard.png");

        message.channel.send(att);
      });
    }

    //0x1ED760
  }
};
