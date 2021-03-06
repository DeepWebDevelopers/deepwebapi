const profileSchema = require("../../db/profile");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "jobs",
      aliases: ["getjob", "job"],
      group: "economy",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "job_command",
      description: ".",
      argsType: "multiple",
      guildOnly: true,
      throttling: {
        usages: 3,
        duration: 25,
      },
    });
  }
  async run(message, args, client) {
    const prefix = message.guild.commandPrefix;
    const target = message.author;
    const userId = target.id;

    if (!args[0]) {
      let noArgEmbed = new Discord.MessageEmbed()
        .setTitle("Invalid arguments!")
        .setColor("RED")
        .setDescription(
          "Bellow are a list of arguments for the **jobs** command."
        )
        .addFields(
          { name: "`resign`", value: "Removes you from your current job." },
          {
            name: "`assign`",
            value: "Assign yourself a job.",
          },
          {
            name: "`list`",
            value: "List of jobs you can apply for...",
          }
        )
        .setTimestamp();
      return message.reply(noArgEmbed);
    }

    let jobList = [
      {
        name: "Scientist",
        description: "You are always looking to discover a new element",
        multi: 2.5,
      },
      {
        name: "Judge",
        description: "You deal with criminals and their punishments",
        multi: 2.25,
      },
      {
        name: "Developer",
        description: "You are developing a new app that will change the world!",
        multi: 2.0,
      },
      {
        name: "Police Officer",
        description: "You catch people doing crimes",
        multi: 1.75,
      },
      {
        name: "YouTuber",
        description: "You eat tide pods for a living",
        multi: 1.5,
      },
      {
        name: "Fast Food Cook",
        description: "You cook food for others to eat",
        multi: 1.25,
      },
      {
        name: "Babysitter",
        description: "You take care of other people's children",
        multi: 1.1,
      },
      {
        name: "Garbage Collector",
        description: "You empty the city's garbage collection",
        multi: 1.0,
      },
      {
        name: "Discord Mod",
        description: "You ban users for posting memes in general",
        multi: 0.69,
      },
    ];
    try {
      if (args[0].toLowerCase() === "list") {
        let embed = new Discord.MessageEmbed()
          .setColor("RANDOM")
          .setTitle("List of all available jobs")
          .setAuthor(
            message.author.tag,
            message.author.avatarURL({
              format: "png",
              dynamic: true,
            })
          )
          .setThumbnail(message.client.user.avatarURL())
          .setTimestamp()
          .setFooter(`${prefix}jobs assign <job name> to get a job`);

        let jobAmount = jobList.length;

        for (let i = 0; i < jobAmount; i++) {
          embed.addField(
            `Job: ${jobList[i].name}`,
            `Description: ${jobList[i].description}`
          );
          embed.addField(`Pay Increase`, `${jobList[i].multi}`);
        }

        return message.channel.send(embed);
      }

      if (args[0].toLowerCase() === "assign") {
        let data = await profileSchema.findOne({
          userId: userId,
        });

        if (!data) {
          let newData = await profileSchema.create({
            userId: userId,
            job: "Unemployed",
            bank: 0,
            wallet: 0,
            multiplier: 1,
            inventory: [Object],
            dailyCooldown: Date.now(),
            workCooldown: Date.now(),
            weeklyCooldown: Date.now(),
            monthlyCooldown: Date.now(),
            hourlyCooldown: Date.now(),
            begCooldown: Date.now(),
            robCooldown: Date.now(),
            bankRobCooldown: Date.now(),
          });

          data = newData;
        }
        if (data.job === null) data.job === "Unemployed";
        if (data.job !== "Unemployed")
          return message.channel.send(
            "You already have a job assigned. Use the **resign** command to leave yoiur job."
          );

        let jobAmount = jobList.length;
        let jobName = args.slice(1).join(" ");

        for (let i = 0; i < jobAmount; i++) {
          if (jobName === jobList[i].name.toLowerCase()) {
            let newData = await profileSchema.findOneAndUpdate(
              {
                userId: userId,
              },
              {
                userId: userId,
                job: jobList[i].name,
                multiplier: jobList[i].multi,
              },
              {
                upsert: true,
              }
            );

            let embed = new Discord.MessageEmbed()
              .setColor("RANDOM")
              .setAuthor(
                message.author.tag,
                message.author.avatarURL({
                  format: "png",
                  dynamic: true,
                })
              )
              .setDescription(
                `You are now assigned the job of a ${jobList[i].name}.\n${jobList[i].description}`
              )
              .setThumbnail(message.client.user.avatarURL())
              .setTimestamp()
              .setFooter("    !");
            return message.channel.send(embed);
          } else continue;
        }
        return message.channel.send(
          "You entered an invalid job name. Make sure you type it case sensitive."
        );
      }

      if (args[0].toLowerCase() === "resign") {
        let data = await profileSchema.findOne({
          userId: userId,
        });

        if (!data) {
          let newData = await profileSchema.create({
            userId: userId,
            job: "Unemployed",
            bank: 0,
            wallet: 0,
            multiplier: 1,
            inventory: [Object],
            dailyCooldown: Date.now(),
            workCooldown: Date.now(),
            weeklyCooldown: Date.now(),
            monthlyCooldown: Date.now(),
            hourlyCooldown: Date.now(),
            begCooldown: Date.now(),
            robCooldown: Date.now(),
            bankRobCooldown: Date.now(),
          });

          data = newData;
        }

        if (data.job === "Unemployed")
          return message.channel.send("You already are unemployed!");

        await profileSchema.findOneAndUpdate(
          {
            userId: userId,
          },
          {
            userId: userId,
            job: "Unemployed",
            multiplier: 1,
          },
          {
            upsert: true,
          }
        );

        return message.channel.send(
          `You have resigned from being a ${data.job}, you are now unemployed.`
        );
      }
    } catch (e) {
      console.log(e);
      let str = e.message;

      if (e.message === "Cannot read property 'job' of null")
        return message.channel.send(
          "Sorry, please do the command again, this is normal for anyone who has not done an economy command before.\n**ThatGuyJamal#2695** is trying to fix this."
        );
      else
        return message.channel.send(
          `An error occurred: \`${str}\`\nUsually this happens once, please try again.`
        );
    }
  }
};
