const { reject } = require('bluebird');
const Mongoose = require('mongoose'),
	chalk = require("chalk");

var mongoDatabase = null;
module.exports.mongoDatabase = mongoDatabase;

// ---

var connectDatabase = (databaseURL, databaseUsername, databasePassword) => {
	return new Promise((resolve) => {
		if (databaseUsername) databaseURL = `mongodb+srv://${databaseUsername}:${databasePassword}@${databaseURL}`;
		else databaseURL = `mongodb://${databaseURL}`;

		Mongoose.connect(databaseURL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
			console.log(chalk`{green [DATABASE]} Successfully connected to the database.`);
			console.log('');

			mongoDatabase = Mongoose;
			module.exports.mongoDatabase = mongoDatabase;

			resolve(mongoDatabase);
		}).catch((error) => {
			console.log(chalk`{red [DATABASE]} Could not connect to the database: ${error}`);

			reject();
		});
	});
}
module.exports.connectDatabase = connectDatabase;