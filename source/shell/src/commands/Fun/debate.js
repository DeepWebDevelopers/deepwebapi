const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "debate",
      aliases: ["argue"],
      group: "fun",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "debate_fun_command",
      description: "..",
      argsType: "multiple",
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 25,
      },
    });
  }
  async run(message, args, client) {
    const prefix = message.guild.commandPrefix;

    //If you have any debate questions, don't hesitate to consult Cy1der (me)
    let questions = [
      "Abortion should be available to all women.",
      "Burning the flag should be illegal.",
      "Can censorship ever be justified?",
      "Barbie is a good role model for young girls.",
      "Censorship is sometimes warranted on the internet.",
      "Companies should be required to hire 50% male and 50% female employees.",
      "Drug addicts should be helped rather than punished.",
      "Drug use should be treated as a mental health issue rather than a criminal offense.",
      "Feminism should focus more on men's rights.",
      "Gay marriage should be legalized.",
      "Gay people should be allowed to adopt children.",
      "Has the #MeToo movement gone too far?",
      "Healthcare should be universal.",
      "Is feminism irrelevant in the 21st century?",
      "Is graffiti art just as worthy of regard as classical paintings?",
      "Is privacy important?",
      "Marijuana should be legalized.",
      "Peer pressure is a good thing.",
      "Police should be allowed to use deadly force.",
      "Religion does more harm than good.",
      "Should genetic engineering be legal?",
      "Should human cloning be legalized?",
      "Should insurance cover cosmetic procedures?",
      "Smoking should be banned.",
      "Social media does more harm than good.",
      "The death penalty should be abolished.",
      "The government should provide free birth control.",
      "The harms of patriotism outweigh the benefits.",
      "The minimum wage should be lowered (or raised).",
      "We're living in a dystopian society.",
      "Animals should have the same rights as humans.",
      "Climate change is the greatest threat in human history.",
      "Companies should be taxed on their carbon emissions and other negative environmental impacts.",
      "Everyone should be vegetarian.",
      "Fracking should be banned.",
      "Genetically modified foods (GMOs) should be banned.",
      "Is organic farming the future of agriculture?",
      "Is the Paris Agreement relevant anymore?",
      "Is tourism beneficial to an environment?",
      "Live animal exports should be banned.",
      "More land should be dedicated as national parks.",
      "Nuclear energy is the solution to the overconsumption of fossil fuels.",
      "Plastic bags and packaging should be banned.",
      "The best way to combat climate change is for individuals to reduce their carbon footprint.",
      "The sale of fur should be banned.",
      "Zoos should be banned.",
      "All cars should be electric.",
      "Are robots going to increase or decrease our quality of life?",
      "Artificial intelligence is dangerous.",
      "Does social media improve or impede communication?",
      "Has social media benefitted or harmed people’s social lives?",
      "Is technology going to save the world. . . or kill it?",
      "Is technology making people dumber. . . or smarter?",
      "Is technology the opposite of nature? (Are technology and nature diametrically opposed?)",
      "Is the use of technology changing people for the better. . . or worse?",
      "Should a person's social media be considered by school admissions, police investigations, and potential employers?",
      "Should humans colonize other planets?",
      "Should individuals own their own DNA?",
      "Robots should have rights.",
      "Technology will be man's downfall.",
      "We should invest more money into space exploration.",
      "What's better: traditional or online education?",
      "Will the development of artificial intelligence harm or benefit humankind?",
      "Advertising should be banned during children's programs.",
      "Alternative medicines should be banned.",
      "Beauty pageants should be banned.",
      "Can animal testing be justified?",
      "Children should be exposed to technology.",
      "Dance should be considered a sport.",
      "Gaming should be considered a sport.",
      "Human cloning should be legalized.",
      "Is bad parenting to blame for childhood obesity?",
      "Parents should be able to choose the gender of their child.",
      "Parents should be able to choose their child's hair color.",
      "Parents should be able to refuse medical treatment for their children.",
      "Parents should limit the amount of time their children spend on technology.",
      "Pop music is the best kind of music.",
      "Should alcohol be sold after 10 pm?",
      "Should fines be scaled depending on income?",
      "Reality television is harming society.",
      "Unpaid internships should be against the law.",
      "Violent video games should be banned.",
      "All people should be able to own guns.",
      "All prisons should be governmentally owned and run.",
      "Churches should pay taxes.",
      "Communism is not a good political ideology.",
      "Is freedom of speech a necessity in a functional society?",
      "Is owning an automatic weapon morally justifiable?",
      "Is patriotism ultimately destructive to international relations?",
      "Is the US voting system democratic?",
      "Juries should include 24 jurors instead of 12.",
      "Politics should be kept out of schools.",
      "Presidential terms should be limited to two years instead of four.",
      "Rich people and large corporations should pay more taxes.",
      "Should illegal immigrants be treated as criminals?",
      "Should the U.N. have a standing army?",
      "Should the voting age be lowered to 16?",
      "Should there be limits on the First Amendment (free speech)?",
      "Should your country make a land claim on Antarctica?",
      "The country should allow more refugees to enter.",
      "The U.S. should intervene in overseas conflicts.",
      "The US should abolish the electoral college.",
      "The West should lift all sanctions on Iran (or North Korea).",
      "Voting should be mandatory for all citizens.",
      "All students should have to purchase a laptop.",
      "Boarding school is harmful for students.",
      "Cell phones should be banned in schools.",
      "College should be free for everyone.",
      "Contact sports should be required in school.",
      "Do you need homework in order to learn?",
      "Education should be privatized.",
      "Education should focus on maths and science rather than music and art.",
      "Fast food should be banned in schools.",
      "Girls should be actively encouraged to enter STEM fields.",
      "Homeschooling is better than traditional schooling.",
      "Public schools are better than private schools.",
      "Religion should be taught in all schools.",
      "Schools should have armed guards.",
      "Should standardized testing be abolished?",
      "School uniforms should be mandatory.",
      "Studying a second language should be compulsory.",
      "Teachers should be given guns to defend students.",
      "Teachers should be paid as much as doctors.",
      "Android is better than IOS (or vice versa).",
      "MacOS is better than Windows 10 (or vice versa).",
    ];

    let finalmessage;

    //Get a random position from the list
    let randomizer = Math.floor(Math.random() * questions.length);

    //Assign the empty value to it
    finalmessage = questions[randomizer];

    //Send it, enphasized

    let embed = new Discord.MessageEmbed()
      .setFooter("Thanks for using Terminal!")
      .setDescription(`**__${finalmessage}__**`)
      .setAuthor("Terminal Fun Commands", message.client.user.avatarURL())
      .addField(
        "Suggestion?",
        `If you have any debate ideas, Send them to our [server](${config.bserver})!`
      )
      .setColor("RANDOM")
      .setTimestamp();

    message.channel.send(embed);
  }
};
