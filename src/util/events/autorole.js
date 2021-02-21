const autorole = require("../../db/autorole");
module.exports = async (message, client) => {
	client.on("guildMemberAdd", async (member) => {
		autorole.findOne({ GuildID: member.guild.id }, async (err, data432) => {
			if (!data432) return;
			try {
				let autorolerole = member.guild.roles.cache.get(data432.RoleID);
				member.roles.add(autorolerole).catch((err) => {
					return;
				});
			} catch (error) {
				return;
				console.log(error);
			}
		});
	});
};
