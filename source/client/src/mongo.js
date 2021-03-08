const mongoose = require("mongoose");
const config = require("../../config/config.json");

module.exports = async (client) => {
	//Create a connection to the database with set options
	await mongoose
		.createConnection(`${config.db}`, {
			useFindAndModify: false,
			useNewUrlParser: true,
			useUnifiedTopology: true,
			autoIndex: true,
		})
		.catch((err) => {
			console.log(err);
		});
	mongoose.set("useFindAndModify", false);

	return mongoose;
};
