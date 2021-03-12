const axios = require("axios").default
module.exports = {
    name: 'chucknorris',
    minArgs: 0,
    maxArgs: 0,
    description: 'Chuck Norris Io thingy',
    category: 'Fun & Games',
    run: async ({ message, args, text, client, prefix, instance }) => {
        var options = {
            method: 'GET',
            url: 'https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com/jokes/random',
            headers: {
                accept: 'application/json',
                'x-rapidapi-key': process.env.RAPID_API,
                'x-rapidapi-host': 'matchilling-chuck-norris-jokes-v1.p.rapidapi.com'
            }
        };

        axios.request(options).then(result => {
            return message.channel.send(result.data.value)
        })
    }
}