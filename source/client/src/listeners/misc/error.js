// ! Important, without this, error's will not print to the console, leaving you cluelessly thinking why a command is not working every once in a  while

module.exports = (client) => {
	client.on("error", (error) => console.log(error));
};

module.exports.config = {
	displayName: "error",
	dbName: "Terminalerror",
	loadDBFirst: true,
};
