module.exports = async (client) => {
	try {
		//! Just something to make the console look cool!
		console.log(
			"╠══════════════════════════════════ ( login ) ═══════════════════════════════════════╣"
		);
		console.log(
			`║ > Logged in as ${client.user.tag}!                                      ║`
		);
		console.log(
			"╠══════════════════════════════════ ( Amount ) ══════════════════════════════════════╣"
		);
		console.log(
			`║ > Active in ${client.guilds.cache.size} servers!                                                 ║`
		);
		console.log(
			"╠══════════════════════════════════ ( Servers ) ═════════════════════════════════════╣"
		);
		// let content = "";
		// let s = "";
		// client.guilds.cache.forEach((guild) => {
		// 	let spaces =
		// 		85 - `║ > ${guild.name} member's ${guild.memberCount}`.length;
		// 	s += 1;
		// 	if (s > Number(client.guilds.cache.size) - 2) {
		// 		content += `\n║`;
		// 	} else {
		// 		content += "║";
		// 	}
		// 	content += ` > > > ${guild.name} Total member's: ${guild.memberCount}`;

		// 	for (i = 0; i < spaces; i++) {
		// 		content += " ";
		// 	}
		// 	content += "║";
		// });
		// console.log(content);
		// console.log(
		// 	"╚════════════════════════════════════════════════════════════════════════════════════╝	"
		// );
		await client.user.setActivity(
			`Prefix: ${prefix} | ${client.guilds.cache.size} Guild's`, //| ${client.users.cache.size} user's
			{
				type: "WATCHING", //! can be LISTENING, WATCHING, PLAYING, STREAMING
			}
		);
	} catch {
		return console.log(Error);
	}
};

/**
    // Set the client user's presence
  client.user.setPresence({ activity: { name: `Prefix: ${prefix} |${client.guilds.cache.size} Guild's | ${client.users.cache.size} user's` }, status: 'online' })
  .catch(console.error);                                  //! can be (invisible, dnd, online, idle)

   // console.log(`[API] Logged in as ${client.user.username} ID: (${client.user.id})`);
   // await client.user.setActivity(`Prefix: ${prefix} |${client.guilds.cache.size} Guild's | ${client.users.cache.size} user's`, {
    //  type: "WATCHING",//! can be LISTENING, WATCHING, PLAYING, STREAMING
 //  });

 
   try {
            function pickStatus() {
                let status = [ `Prefix: ${prefix} |${client.guilds.cache.size} Guild's | ${client.users.cache.size} user's`,]
            let Status = Math.floor(Math.random() * status.length)
        //you can set the activity to any of the followiang:
        // PLAYING, STREAMING, LISTENING, WATCHING
            client.user.setActivity(status[Status], {
                type: "WATCHING"
            })
            }
            setInterval(pickStatus, 5000)
        } catch (err) {
            console.log(err)
        }
  

 */
