const axios = require("axios").default
module.exports = {
    name: 'insult',
    aliases: ['roast'],
    minArgs: 0,
    maxArgs: 0,
    description: 'get roasted ',
    category: 'Fun & Games',
    run: async ({
        message,
        args,
        text,
        client,
        prefix,
        instance
    }) => {
        let options = {
            method: "GET",
            url: "https://api.snowflakedev.xyz/api/roast",
            headers: {
                "Authorization": process.env.SNOWFLAKE
            }
        }

        axios.request(options).then(res => {
            message.channel.send(res.data.roast)
        }).catch(err => {
            console.log(err)
            message.channel.send(`An error occurred: ${err.message}`)
        })
    }
}