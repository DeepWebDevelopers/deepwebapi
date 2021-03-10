# Nodmeon starter

nodemon src/bot.js

#

try {

} catch (error) {
console.log(error)
}

# impro commando

const prefix = message.guild.commandPrefix
this.client.commandPrefix
const { stripIndents, oneLine } = require("common-tags"); // Allows the message text to be in one line.

!message.member.hasPermission("ADMINISTRATOR")

{ name: '``', value: "", inLine:true },
.addField("\u200B", "\u200B") // Makes a blank, space in the embed
message.author.displayAvatarURL() or message.client.user.displayAvatarURL()
.then(m => m.delete({timeout: 5000}));

message.guild.iconURL()
message.guild.me.displayHexColor

if (message.guild.me.roles.highest.comparePositionTo(role) < 0) {
return message.channel.send() // you need to define role. ex: const role = message.guild.roles.cache.find((role) => role.name === args.join(" ").slice(1))

const { canModifyQueue } = require("../../Util/Music/Music_defaults");

# Commando

// save #1
const commando = require("discord.js-commando");
module.exports = class Command extends (
commando.Command
) {
constructor(client) {
super(client, {
name: "",
group: "",
memberName: "",
description: "",
userPermissions: [],
clientPermissions: [],
argsType: "multiple",
guildOnly: true,
ownerOnly: false,
nsfw: false,
throttling: {
usages: 3,
duration: 10,
},
});
}
async run(message, args) {
const prefix = message.guild.commandPrefix;

    }

};

# Prefix finder

message.guild.commandPrefix

# WOK TEMP!

module.exports = {
name: '', // Optional
aliases: [''], // Optional
description: '',
category: '',
cooldown: '1s',
globalCooldown: '',
requiredPermissions: [''],
minArgs: 1,
maxArgs: -1, // -1 means no limit
syntaxError: '',
expectedArgs: '',
guildOnly: true,
ownerOnly: false,
execute: async ({ message, args, text, client, prefix, instance }) => {

    }

}

# Nodemon

nodemon help: { nodemon ./path.to/"enter file here" } // you need the space from .to/ and ""

# Embeds

{ name: '``', value: "", inLine:true },
.addField("\u200B", "\u200B") // Makes a blank, space in the embed
message.author.displayAvatarURL() or message.client.user.displayAvatarURL()
.then(m => m.delete({timeout: 5000}));
message.guild.iconURL()

# Bot permissions

if (message.guild.me.roles.highest.comparePositionTo(role) < 0) {
return message.channel.send() // you need to define role. ex: const role = message.guild.roles.cache.find((role) => role.name === args.join(" ").slice(1))

# Owner only

const { guild } = message;
if (message.author.id != "370637638820036608") {
const ownerError = require("../../util/ownerError");
return ownerError(
"Only the bot owner can run this command.",
message.channel
);
} else {

        }

# Guild Only

if (message.channel.type === 'dm') {
return
}

if(!message.guild) return

message.author.send()
message.react('');

# NSFW

if (!message.channel.nsfw || !message.channel.name.toLowerCase() == "nsfw") return message.reply("This channel must be NSFW").then(msg => call.bot.deleteMyMessage(msg, 12000))

# Permissions\

const {guild} = message
if (!guild.me.hasPermission("SEND_MESSAGES")) {

    return

}
else {

}

# Reaction temp

const msg = await message.channel.send("Are you sure?");
await msg.react("✅");
await msg.react("❌");
const filter = (reaction, user) => {
return (
(reaction.emoji.name === "✅" || reaction.emoji.name === "❌") &&
user.id === message.author.id
);
};

msg
.awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] })
.then(async (reaction) => {
if (reaction.first().emoji.name === "✅") {
await message.channel.send("**EXECUTING COMMAND!!**"); // this is optional, you can delete this if you want
const channel = message.guild.channels.cache.get(message.channel.id); // get the channel to nuke (basically the channel the command was sent in)
const position = channel.position; // We need the channel permission to we can move the cloned channel to where the original channel was.

    		channel.clone().then((channel2) => {
    			// clones the channel, we define this channel as 'channel2' in a 'then' statement
    			channel2.setPosition(position); // this is where we used the position variable
    			channel.delete(); // now that we put the cloned channel where need it to be, we can delete the original
    			channel2.send("**SUCCESS!**"); // sends a message to confirm that it was able to nuke it
    			//	channel2.send("https://giphy.com/gifs/80s-akira-oQtO6wKK2q0c8"); // sends an anime nuke gif
    		});
    	} else if (reaction.first().emoji.name === "❌") {
    		const embed = new Discord.MessageEmbed()
    			.setDescription(`Command has been canceled by ${message.author.tag}`)
    			.setColor("GREEN")
    			.setTimestamp();
    		message.channel.send(embed);
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
