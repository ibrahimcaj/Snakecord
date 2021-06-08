const chalk = require("chalk"),
	axios = require("axios"),
	fs = require("fs");

const configuration = require('../configuration.json');

// ---

const processArguments = process.argv.slice(2),
	annoyingEvents = ['guildMemberAdd.js', 'guildMemberUpdate.js'];

var events = (client) => {
	return new Promise((resolve, reject) => {
		fs.readdir("./src/events/", async (error, eventFiles) => {
			if (error) return reject(error);

			eventFiles = eventFiles.filter((eventFile) => eventFile.split(".").pop() == "js");

			if (processArguments.includes('disableAnnoyingEvents')) eventFiles = eventFiles.filter((eventFile) => !annoyingEvents.includes(eventFile));
			if (eventFiles.length <= 0) return console.log(chalk`{blue [EVENTS]} No event files found in the directory.`);
			console.log(chalk`{blue [EVENTS]} Loading the bot events...`);

			await eventFiles.forEach((eventFile) => {
				let eventFileProperties = require(`../events/${eventFile}`);

				console.log(chalk`- {blue {underline ${eventFile}}} event {green loaded}.`);
				client.on(eventFileProperties.help.name, (...argumentArray) => {
					try {
						eventFileProperties.run(client, ...argumentArray);
					}
					catch (error) {
						reject(error);
					}
				});
			});

			console.log(` `);
			resolve();
		});
	});
}

var commands = (client) => {
	return new Promise((resolve, reject) => {
		fs.readdir("./src/commands/", async (error, commandFiles) => {
			if (error) return reject(error);

			commandFiles = commandFiles.filter((commandFile) => commandFile.split(".").pop() == "js");

			if (commandFiles.length <= 0) return console.log(chalk`{blue [COMMANDS]} No command files found in the directory.`);
			console.log(chalk`{blue [COMMANDS]} Loading the bot commands...`);

			await commandFiles.forEach(async (commandFile) => {
				let commandFileProperties = require(`../commands/${commandFile}`);

				var processOptions = (optionArray) => {
					optionArray.forEach((commandOption, commandOptionIndex) => {
						optionArray[commandOptionIndex].type = (configuration.options.indexOf(commandOption.type.toUpperCase()) > -1 ? configuration.options.indexOf(commandOption.type.toUpperCase()) : 3);

						if (commandOption.type == 1 || commandOption.type == 2) optionArray[commandOptionIndex].options = processOptions(commandOption.options);
					});

					return optionArray;
				}
				commandFileProperties.help.options = await processOptions(commandFileProperties.help.options);

				console.log(chalk`- {blue {underline ${commandFile}}} command {green loaded}.`);
				client.commands.set(commandFileProperties.help.name, commandFileProperties);
			});

			console.log(` `);
			resolve();
		});
	});
}

var request = (method, endpoint, body, token, id) => {
	return new Promise((resolve, reject) => {
		if (method !== "GET") {
			axios({
				method: `${method}`,
				headers: {
					Authorization: `Bot ${token}`,
					"Content-Type": "application/json",
					Accept: "*/*",
				},
				url: `https://discord.com/api/v8/applications/${id}/${endpoint}`,
				data: body,
			}).then((response) => resolve(response.data)).catch((error) => {
				if (!error.response.data.retry_after) return reject(error.response.data.message);

				setTimeout(() => { request(method, endpoint, body, token, id).then(() => resolve()).catch((error) => reject(error)) }, error.response.data.retry_after * 130);
			});
		} else {
			axios({
				method: `${method}`,
				headers: {
					Authorization: `Bot ${token}`,
					"Content-Type": "application/json",
					Accept: "*/*",
				},
				url: `https://discord.com/api/v8/applications/${id}/${endpoint}`,
			}).then((response) => resolve(response.data)).catch((error) => {
				if (!error.response.data.retry_after) return reject(error.response.data.message);

				setTimeout(() => { request(method, endpoint, body, token, id).then(() => resolve()).catch((error) => reject(error)) }, error.response.data.retry_after * 130);
			});
		}
	});
}

var slash = (client, clientID, clientToken, clientGuild) => {
	return new Promise((resolve, reject) => {
		if (client.commands.size <= 0) return console.log(chalk`{blue [SLASH COMMANDS]} No command files found in the directory.`);
		console.log(chalk`{blue [SLASH COMMAND]} Loading the slash commands...`);

		request('GET', `${clientGuild ? `guilds/${clientGuild}/` : ''}commands`, {}, clientToken, clientID).then(async (response) => {
			await client.commands.forEach(async (clientCommand, clientCommandIndex) => {
				var slashCommand = response.find((slashCommand) => slashCommand.name == clientCommand.help.name);

				if (!slashCommand) {
					await request('POST', `${clientGuild ? `guilds/${clientGuild}/` : ''}commands`, clientCommand.help, clientToken, clientID).then(() => {
						console.log(chalk`- {blue {underline /${clientCommand.help.name}}} command {green added}.`);

						if ((clientCommandIndex + 1) == response.length && response.length == 0) {
							console.log('');
							resolve();
						}
					}).catch((error) => console.log(chalk`- {blue Something went wrong while trying to {blue register} the {underline /${slashCommand.name}}} command: ${error}`));
				}
			});

			// ---

			await response.forEach((responseSlashCommand, responseSlashCommandIndex) => {
				var slashCommand = {
					name: responseSlashCommand.name,
					description: responseSlashCommand.description,
					options: responseSlashCommand.options || []
				}

				var clientCommand = client.commands.find((clientCommand) => clientCommand.help.name == slashCommand.name);

				if (clientCommand) {
					clientCommand = clientCommand.help;

					if (JSON.stringify(slashCommand) != JSON.stringify(clientCommand)) {
						var commandsFile = require('../commands.json'),
							savedCommands = commandsFile.slash,
							savedCommand = savedCommands.findIndex((command) => command.name == slashCommand.name);

						var updateCommand = (commandID, commandName) => {
							return new Promise((updateResolve, updateReject) => {
								request('POST', `${clientGuild ? `guilds/${clientGuild}/` : ''}commands`, clientCommand, clientToken, clientID).then(() => {
									console.log(chalk`- {blue {underline /${commandName}}} command {yellow updated}.`);

									updateResolve();

									if ((responseSlashCommandIndex + 1) == response.length) {
										console.log('');
										resolve();
									}
								}).catch((err) => updateReject(chalk`{red Something went wrong when trying to {blue edit} /${commandName}:} ${err}`));
							})
						}

						if (savedCommands[savedCommand]) {
							savedCommand = savedCommands[savedCommand];

							updateCommand(savedCommand.id, savedCommand.name).catch(console.error);
						} else {
							savedCommands.push({ name: slashCommand.name, id: responseSlashCommand.id });
							commandsFile.slash = savedCommands;

							fs.writeFile('./src/commands.json', JSON.stringify(commandsFile, null, 4), (error) => {
								if (error) return reject(error);

								savedCommand = savedCommands[savedCommand];
								updateCommand(savedCommand.id, savedCommand.name).catch(console.error);
							});
						}
					} else {
						console.log(chalk`- {blue {underline /${slashCommand.name}}} command {green loaded}.`);

						if ((responseSlashCommandIndex + 1) == response.length) {
							console.log('');
							resolve();
						}
					}
				} else {
					request('DELETE', `${clientGuild ? `guilds/${clientGuild}/` : ''}commands/${responseSlashCommand.id}`, {}, clientToken, clientID).then(() => {
						console.log(chalk`- {blue {underline /${slashCommand.name}}} command {red removed}.`);

						if ((responseSlashCommandIndex + 1) == response.length) {
							console.log('');
							resolve();
						}
					}).catch((error) => console.log(chalk`- {blue Something went wrong while trying to {red remove} the {underline /${slashCommand.name}}} command: ${error}`));
				}
			});
		});
	});
};

module.exports.events = events;
module.exports.commands = commands;
module.exports.slash = slash;