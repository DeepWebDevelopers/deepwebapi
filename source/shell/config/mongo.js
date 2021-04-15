const mongoose = require("mongoose");
const config = require("../config/config.json");

module.exports = {
  init: async () => {
    const dbOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      // findOneAndDelete: true,
      // findOneAndUpdate: true,
      connectTimeoutMS: 10000,
    };

    mongoose.connect(config.db, dbOptions);
    mongoose.set("useFindAndModify", false);
    mongoose.Promise = global.Promise;

    await mongoose.connection.on("connected", () => {
      console.log("Mongoose has successfully connected!");
    });

    await mongoose.connection.on("err", (err) => {
      console.error(`Mongoose connection error: \n${err.stack}`);
    });

    await mongoose.connection.on("disconnected", () => {
      console.warn("Mongoose connection lost");
    });
  },
  // used to fetch database ping...
  async ping() {
    const currentNano = process.hrtime();
    await mongoose.connection.db.command({ ping: 1 });
    const time = process.hrtime(currentNano);
    return (time[0] * 1e9 + time[1]) * 1e-6;
  },
};
