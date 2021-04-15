const fs = require("fs");
const script = `async run(message) {
async function isBlacklisted(message) {
  const blacklist = require("../../db/blacklist");
  var isBanned = false;
  await blacklist.findOne(
    {
      userID: message.author.id,
    },
    (err, data) => {
      if (err) throw err;
      if (data) {
        isBanned = true;
        return message.reply(
          "You are blacklisted from using the bot! \n For more information on why, join our support server."
        );
      } 
    }
  );
  if (isBanned) return true
  return false
}
`;
var files = fs.readdirSync("./commands");
files.forEach((file) => {
  var fileContents = fs.readFileSync(file);
  fileContents.replace("async run(message) {", script);
  fs.writeFileSync(file, fileContents);
});
