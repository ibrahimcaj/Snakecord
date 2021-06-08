const { Client } = require("discord.js"),
	chalk = require("chalk");

const configuration = require('../configuration.json');
const clientManager = require('../components/clientManager');

// const Guild = require('../components/database/models/GuildModel');

/**
 * 
 * @param {Client} client
 */
module.exports.run = async (client) => {
	var guildID = require(`../configuration/${global.processMode}/server.json`).guild;

	console.log(chalk`{green [CLIENT]} Logged in as {underline ${client.user.tag}} in {underline ${Math.round(process.uptime() * 1000)} milliseconds}.`);

	// ---

	client.user.setActivity(configuration.client.activity.name, configuration.client.activity.options);

	client.guilds.fetch(guildID).then((mainGuild) => {
		mainGuild.members.fetch().catch(console.error);
	}).catch(console.error);

	client.application.commands.fetch().catch(console.error);
	client.application.fetch().then((clientApplication) => { // Fetches the bot application.
		var teamMembers = clientApplication.owner.members.array();

		clientManager.setTeamMembers(teamMembers); // Saves the fetched team members.

		console.log(chalk`- {green Loaded} the team members: ${teamMembers.map((teamMember) => chalk`{underline ${teamMember.user.tag}}`).join(', ')}.`);
		console.log('');

		// var newGuild = new Guild({ id: '565609735966031896' }); // Creates a new Guild object.
		// newGuild.saveDocument().then(console.log).catch(console.error); // Saves the Guild object to the database.

		// Guild.find({ id: '0' }).then((guildArray) => { // Finds the document with the '0' ID. Returns an array of found documents.
		//     var foundGuild = guildArray[0];
		//     console.log(guildArray);
		//     foundGuild.updateSetting('settingName', 'settingValue').then(console.log).catch(console.error); // Updates a specific setting. Returns the new document.
		//     foundGuild.updateSettings({ channels: {} }).then(console.log).catch(console.error); // Overwrites the guild's settings. Be careful when using. Returns the new document.
		//     foundGuild.updateLoggingSetting('loggingSettingName', 'loggingSettingValue').then(console.log).catch(console.error); // Updates a specific logging setting. Returns the new document.

		//     // ---

		//     foundGuild.deleteDocument().catch(console.error); // Deletes the document. Returns the document.
		// }).catch(console.error);
	}).catch(() => console.log(chalk`{yellow [WARNING]} Could not fetch the team members.`));
}

// Event information
module.exports.help = {
	name: "ready"
};
