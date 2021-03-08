const Discord = require("discord.js")
const canvacord = require("canvacord")
module.exports = {
    name: 'spotify',
    minArgs: 0,
    maxArgs: 1,
    expectedArgs: "[mention]",
    description: "Displays a user's Spotify status",
    category: "Utility",
    run: async ({
        message,
        args,
        text,
        client,
        prefix,
        instance
    }) => {
        let listeningPresence
        let target = message.mentions.members.first() || message.member

        if (target.presence.activities.length === 1) listeningPresence = target.presence.activities[0]
        else if (target.presence.activities.length > 1) listeningPresence = target.presence.activities[1]

        if (target.presence.activities.length === 0 || listeningPresence.name !== "Spotify" && listeningPresence.type !== "LISTENING") return message.channel.send(`${target.displayName} is not listening to Spotify.`)

        if (listeningPresence !== null && listeningPresence.type === "LISTENING" && listeningPresence.name === "Spotify" && listeningPresence.assets !== null) {
            let spCard = new canvacord.Spotify()
                .setAlbum(listeningPresence.assets.largeText)
                .setAuthor(listeningPresence.state.replace(/\;/g, ','))
                .setEndTimestamp(listeningPresence.timestamps.end)
                .setStartTimestamp(listeningPresence.timestamps.start)
                .setImage(`https://i.scdn.co/image/${listeningPresence.assets.largeImage.split(":")[1]}`)
                .setTitle(listeningPresence.details)
                .setProgressBar("BAR", "#1ED760")

            spCard.build().then(data => {
                let att = new Discord.MessageAttachment()
                    .setFile(data)
                    .setName("spotifyCard.png")

                message.channel.send(att)
            })
        }

        //0x1ED760
    }
}