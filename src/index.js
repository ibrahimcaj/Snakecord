const { WebhookClient, MessageEmbed } = require("discord.js"),
	chalk = require("chalk");

const configuration = require('./configuration.json');
const clientManager = require('./components/clientManager');

console.log('');
console.log(chalk`{green [STARTING]} Starting the bot process. Please wait a few moments...`);

// ---
// Process mode choser.

var processArguments = process.argv,
	modeArgument = processArguments[2];
if (modeArgument) modeArgument = modeArgument.toLowerCase();
else {
	console.log(chalk`- {red {underline Process}} mode not chosen. Killing the process.`);
	return process.exit(1);
}

if (!configuration.client.names[modeArgument]) {
	console.log(chalk`- {red {underline Unknown}} mode chosen. Killing the process.`);
	return process.exit(1);
}

global.processMode = modeArgument;
var modeName = modeArgument.charAt(0).toUpperCase() + modeArgument.slice(1, modeArgument.length);

console.log(chalk`- {yellow {underline ${modeName}}} mode chosen.`);

var clientArgument = processArguments[3];
if (clientArgument) clientArgument = clientArgument.toLowerCase();
else {
	console.log(chalk`- {red {underline ${modeName}}} client not chosen. Killing the process.`);
	return process.exit(1);
}

// Process mode client choser.

global.processClient = clientArgument;
var clientObject = {
	name: configuration.client.names[modeArgument][clientArgument],
	id: configuration.client.ids[modeArgument][clientArgument],
	token: process.env[`${modeArgument}.${clientArgument}`]
}

if (clientObject.name) { // Checks whether the chosen client is valid.
	if (!clientObject.token) {
		console.log(chalk`- {red {underline Unknown}} ${modeArgument} ${clientArgument} token was not provided.`);
		return process.exit(1);
	} else {
		console.log(chalk`- {green {underline ${clientObject.name}}} ${modeArgument} client chosen.`);

		clientManager.startClient(modeArgument, clientObject.token, clientObject.id).catch(console.error); // Starts the process client Discord bot.
	}
} else { // Checks whether the chosen client is unknown.
	console.log(chalk`- {red {underline Unknown}} ${modeArgument} client chosen. Killing the process.`);
	return process.exit(1);
}