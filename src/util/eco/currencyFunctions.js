const userConfig = require("../../db/economy");

class currencyFunctions {
	/**
	 *
	 * @param {string} [userId] - A Discord user ID
	 * @param {string} [guildId] - A Discord guild ID
	 * @param {string} [amount] - Amount of coins to give
	 *
	 * @example
	 * const currencyFunctions = require('../../Util/eco/currencyFunctions');
	 *
	 * client.on('message', async message => {
	 *      const random = Math.floor(Math.random() * 24) + 1;
	 *
	 *      giveCoins(message.author.id, message.guild.id, random);
	 * });
	 */

	static async giveCoins(userId, guildId, amount) {
		// if (!userId) throw new TypeError("You didn't provide a user ID.");
		// if (!guildId) throw new TypeError("You didn't provide a guild ID.");
		// if (!amount) throw new TypeError("You didn't provide an amount of coins.");
		// if (isNaN(amount)) throw new TypeError("The amount must be a number.");
		// if (amount < 0) throw new TypeError("New amount must not be under 0.");

		let data = await userConfig.findOne({ userId: userId, guildId: guildId });

		if (!data) {
			const newData = new userConfig({
				userId: userId,
				guildId: guildId,
				bankSpace: 1000,
				coinsInBank: 0,
				coins: 0,
			});

			await newData.save().catch((err) => console);

			return amount;
		}

		data.coins += parseInt(amount);

		await data.save().catch((err) => console);

		return amount;
	}
	/**
	 *
	 * @param {string} [userId] - A Discord user ID
	 * @param {string} [guildId] - A Discord guild ID
	 * @param {number} [amount] - Amount of bank space to give
	 *
	 * @example
	 * const currencyFunctions = require('../../Util/eco/currencyFunctions');
	 *
	 * const random = Math.floor(Math.random() * 24) + 1;
	 *
	 * currencyFunctions.giveBankSpace(some_id, some_guild_id, random);
	 */

	static async findUser(userId, guildId) {
		let data = await userConfig.findOne({ userId: userId, guildId: guildId });

		return data;
	}

	/**
	 *
	 * @param {string} [userId] - A Discord user ID
	 * @param {string} [guildId] - A Discord guild ID
	 * @param {number} [amount] - Amount of bank space to give
	 *
	 * @example
	 * const currencyFunctions = require('../../Util/eco/currencyFunctions');
	 *
	 * const random = Math.floor(Math.random() * 24) + 1;
	 *
	 * currencyFunctions.giveBankSpace(some_id, some_guild_id, random);
	 */

	static async giveBankSpace(userId, guildId, amount) {
		let data = await userConfig.findOne({ userId: userId, guildId: guildId });

		if (!data) return;

		data.bankSpace += amount;

		await data.save();
	}

	/**
	 *
	 * @param {string} [userId] - A Discord user ID
	 * @param {string} [guildId] - A Discord guild ID
	 *
	 */

	static async removeAllCoins(userId, guildId) {
		let data = await userConfig.findOne({ userId: userId, guildId: guildId });

		if (!data) return;

		data.coins -= data.coins;

		await data.save();
	}

	static async deductCoins(userId, guildId, amount) {
		// if (!userId) throw new TypeError("You didn't provide a user ID.");
		// if (!guildId) throw new TypeError("You didn't provide a guild ID.");
		// if (!amount) throw new TypeError("You didn't provide an amount of coins.");
		// if (isNaN(amount)) throw new TypeError("The amount must be a number.");
		// if (amount < 0) throw new TypeError("New amount must not be under 0.");

		let data = await userConfig.findOne({ userId: userId, guildId: guildId });

		if (!data) {
			const newData = new currencyModel({
				userId: userId,
				guildId: guildId,
				bankSpace: 1000,
				coinsInBank: 0,
				coins: 0,
			});

			await newData.save().catch((err) => console);

			return amount;
		}

		if (amount > data.coins) {
			data.coins -= data.coins;

			await data.save().catch((err) => console);

			return amount;
		}

		data.coins -= parseInt(amount);

		await data.save().catch((err) => console); // only used console so it would not throw err.

		return amount;

		/**
		 *
		 * @param {string} userId - A discord user ID.
		 * @param {string} guildId - A discord guild ID.
		 * @param {string} amount - Amount of bank space to give.
		 */
	}
	static async deleteUser(userId, guildId) {
		if (!userId) throw new TypeError("Please provide a user ID.");
		if (!guildId) throw new TypeError("Please provide a guild ID.");

		let data = await userConfig.findOne({ userId: userId, guildId: guildId });
		if (!data) return false;

		await userConfig.findOneAndRemove({ userId: userId, guildId: guildId });

		await data.save().catch((err) => console.log(err));

		/**
		 *
		 * @param {string} guildId - A discord guild ID.
		 * @param {number} amount - The amount of users to show.
		 */
	}
}

module.exports = currencyFunctions;
