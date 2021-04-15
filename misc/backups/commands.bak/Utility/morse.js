const axios = require("axios").default;
module.exports = {
  name: "morse",
  minArgs: 1,
  maxArgs: -1,
  expectedArgs: "<either encode or decode> <value>",
  description: "Convert morse to text or the other way around",
  category: "Utility",
  run: async ({ message, args, text, client, prefix, instance }) => {
    if (!args[0])
      return message.channel.send(
        "Unknown parameter. Please choose the method first, either decode or encode it."
      );

    let choice = ["encode", "decode"];
    if (!choice.includes(args[0].toLowerCase()))
      return message.channel.send(
        "Unknown parameter. Please choose the method first, either decode or encode it."
      );

    let textIn = args.slice(1).join(" ");

    if (!textIn) return message.channel.send("Please input some text.");

    if (textIn.length > 1024)
      return message.channel.send("Maximum input is 1024 characters, sorry!");

    function encode(char) {
      var options = {
        method: "GET",
        url: `https://api.snowflakedev.xyz/api/morse/encode?text=${char}`,
        headers: {
          Authorization: process.env.SNOWFLAKE,
        },
      };

      axios
        .request(options)
        .then((res) => {
          let output = res.data.data;
          if (output.length > 2000) output = output.substr(0, 1997) + "...";

          return message.channel.send(output);
        })
        .catch((err) => {
          console.log(err);
          message.channel.send(`An error occurred: ${err.message}`);
        });
    }

    function decode(char) {
      var options = {
        method: "GET",
        url: `https://api.snowflakedev.xyz/api/morse/decode?text=${char}`,
        headers: {
          Authorization: process.env.SNOWFLAKE,
        },
      };

      axios
        .request(options)
        .then((res) => {
          let output = res.data.data;
          if (output.length > 2000) output = output.substr(0, 1997) + "...";

          return message.channel.send(output);
        })
        .catch((err) => {
          console.log(err);
          message.channel.send(`An error occurred: ${err.message}`);
        });
    }

    if (args[0].toLowerCase() === "encode") encode(textIn);
    else if (args[0].toLowerCase() === "decode") decode(textIn);
  },
};
