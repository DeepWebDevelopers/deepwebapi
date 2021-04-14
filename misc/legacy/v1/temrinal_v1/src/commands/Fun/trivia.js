const Trivia = require('trivia-api')
const trivia = new Trivia({
    encoding: 'url3986'
})
const Discord = require("discord.js")
const Entities = require("html-entities").XmlEntities
const entities = new Entities()

module.exports = {
    name: 'trivia',
    minArgs: 0,
    maxArgs: 0,
    description: "Random trivia questions",
    category: "Fun & Games",
    run: async ({ message, args, text, client, prefix, instance }) => {
        trivia.getQuestions({
                type: "multiple"
            })
            .then(questions => {
                let answers = questions.results[0].incorrect_answers
                answers.push(questions.results[0].correct_answer)
                answers = shuffle(answers)

                const embed = new Discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle(`${questions.results[0].category}`)
                    .setTimestamp()
                    .setDescription(`**Difficulty:** ${questions.results[0].difficulty}\n**Correct Answer:** ||${questions.results[0].correct_answer}||`)
                    .addField(`${entities.decode(questions.results[0].question)}`, `A) ${answers[0]}\nB) ${answers[1]}\nC) ${answers[2]}\nD) ${answers[3]}`)
                message.channel.send(embed)
            })
            .catch(err => {
                console.log(err)
                return message.channel.send(`An error occurred: ${err.message}`)
            });
    }
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex

    do {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    } while (0 !== currentIndex)

    return array
}