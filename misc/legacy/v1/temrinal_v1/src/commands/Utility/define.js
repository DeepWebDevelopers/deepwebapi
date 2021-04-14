const axios = require("axios").default;
const Discord = require("discord.js");
const bin = require("sourcebin_js");
module.exports = {
	name: "define",
	minArgs: 1,
	maxArgs: -1,
	expectedArgs: "<word>",
	description: "Get a word's definition",
	category: "Utility",
	run: async ({ message, args, text, client, prefix, instance }) => {
		let word = text;

		axios
			.get(
				`https://dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=${process.env.DICTIONARY1}`
			)
			.then(async (data, err) => {
				let alldata = data.data;

				if (!alldata[0].meta) {
					message.channel.send("Word not found.");
					return false;
				}

				let otherWords = [];

				for (let i = 0; i < alldata.length; i++) {
					otherWords.push(alldata[i].meta.id + ` (${alldata[i].fl})`);
				}

				let definitions = [];

				for (let j = 0; j < alldata[0].shortdef.length; j++) {
					definitions.push(`${j + 1}. ${alldata[0].shortdef[j]}`);
				}

				let synURL = await bin
					.create(
						[
							{
								name: "Terminal/Cy1der",
								content: `${
									alldata[0].meta.syns.length > 1
										? alldata[0].meta.syns
										: "none"
								}`,
								languageId: "JSON",
							},
						],
						{
							title: `Synonyms for ${alldata[0].meta.id}`,
							description: "Dictionary command executed",
						}
					)
					.then((bin) => {
						return bin.url;
					});

				let antURL = await bin
					.create(
						[
							{
								name: "Terminal/Cy1der",
								content: `${
									alldata[0].meta.ants.length > 1
										? alldata[0].meta.ants
										: "none"
								}`,
								languageId: "JSON",
							},
						],
						{
							title: `Synonyms for ${alldata[0].meta.id}`,
							description: "Dictionary command executed",
						}
					)
					.then((bin) => {
						return bin.url;
					});

				let embed = new Discord.MessageEmbed()
					.setColor("RANDOM")
					.setTitle(`${alldata[0].meta.id} (${alldata[0].fl})`)
					.setDescription(
						`**Offensive?** ${alldata[0].meta.offensive ? "Yes" : "No"}`
					)
					.addFields(
						{
							name: "Definition(s)",
							value: definitions.join("\n"),
						},
						{
							name: `Related to "${alldata[0].meta.id}"`,
							value: alldata[0].meta.stems.join(", "),
						},
						{
							name: "Synonyms",
							value: `[Here](${synURL})`,
						},
						{
							name: "Antonyms",
							value: `[Here](${antURL})`,
						},
						{
							name: `Other results`,
							value: otherWords.join(", "),
						}
					)
					.setTimestamp();

				message.channel.send(embed);
			});
	},
};
