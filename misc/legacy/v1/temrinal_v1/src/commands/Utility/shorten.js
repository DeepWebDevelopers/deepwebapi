const request = require("request")
module.exports = {
    name: 'shorten',
    minArgs: 1,
    maxArgs: -1,
    expectedArgs: "<url>",
    description: "Shorten a URL",
    category: "Utility",
    run: async ({
        message,
        args,
        text,
        client,
        prefix,
        instance
    }) => {
        //if (text && text.includes(">") || text && text.includes("<")) return message.channel.send("<> characters are reserved for percent encoding.")
        let linkregex = /(http|https):\/\/[^ "]+/g

        if (linkregex.test(text)) {
            const options = {
                method: 'POST',
                url: 'https://url-shortener-service.p.rapidapi.com/shorten',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-rapidapi-key': process.env.RAPID_API,
                    'x-rapidapi-host': 'url-shortener-service.p.rapidapi.com',
                    useQueryString: true
                },
                form: {
                    url: text
                }
            };

            request(options, function (error, response, body) {
                if (error) return message.channel.send(`An error occurred: ${error.message}`)
                let url = JSON.parse(body)
                let msg = ""

                if (url.hasOwnProperty("result_url")) msg = "<" + url.result_url + ">"
                else if (url.hasOwnProperty("error")) msg = url.error

                message.channel.send(msg)
            })
        } else {
            return message.channel.send('For safety reasons, please include the URL\'s protocol (all in lowercase letters).')
        }
    }
}