const { Client, Collection, Intents } = require("discord.js"),
    moment = require("moment");

const configuration = require('../configuration.json');
const imageServer = require('../components/imageServer');
const actionHandlers = require('../components/actionHandlers');
const databaseHandler = require('../components/database/databaseHandler');

// ---

var startClient = (modeChosen, botToken, clientID) => {
    return new Promise((resolve) => {
        var clientOptions = configuration.client.options;
            clientOptions['intents'] = [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS ];

        const client = new Client(clientOptions);
            client.commands = new Collection();
            client.modeChosen = modeChosen;
            client.startTime = moment();
        
        var clientConfiguration = require(`../configuration/${modeChosen}/database.json`);
        // databaseHandler.connectDatabase(clientConfiguration.url, clientConfiguration.username, clientConfiguration.password).then(() => {
            console.log(configuration.separator);
            console.log('');

            actionHandlers.events(client).then(() => {
                actionHandlers.commands(client).then(() => {
                    var guildID = (modeChosen == 'development' ? require(`../configuration/${modeChosen}/server.json`).guild : null);

                    actionHandlers.slash(client, clientID, botToken, guildID).then(() => {
						imageServer.startServer().then(() => {
							console.log(configuration.separator);
							console.log('');

							// ---

							client.login(botToken);
							resolve();	
						}).catch(console.error);
                    }).catch(console.error);
                }).catch(console.error);
            }).catch(console.error);
        // }).catch(console.error);
    });
}
module.exports.startClient = startClient;

// ---

var teamMembers = null;
var setTeamMembers = (newTeamMembers) => {
    teamMembers = newTeamMembers;
    module.exports.teamMembers = teamMembers;
}
module.exports.teamMembers = teamMembers;
module.exports.setTeamMembers = setTeamMembers;