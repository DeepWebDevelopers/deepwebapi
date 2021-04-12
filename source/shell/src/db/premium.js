const mongoose = require("mongoose");

const premiumuserSchema = mongoose.Schema({
  guildID: {
    type: String,
    required: true,
  },
  _id: {
    type: string,
  },
  username: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Premium-user", premiumuserSchema);

//! starting code

try {
  const user = message.mentions.users.first();
  await premiumuserSchema.findOneAndUpdate(
    {
      _id: user.id,
    },
    {
      _id: user.id,
      username: user.username,
    },
    {
      upsert: true,
    }
  );

  user.send("Premium membership has been activated.. ");
  message.channel.send("Sikeresen felvéve!");
} catch (err) {
  catchErr(err);
}

//! Deleted the data

try {
  const user = message.mentions.users.first();
  await premiumuserSchema.deleteOne({
    _id: user.id,
  });

  message.channel.send(
    user.username + "You'r premium membership has been canceled."
  );
} catch (err) {}
