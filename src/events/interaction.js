const { Client, Collection, CommandInteraction } = require("discord.js");

const mainConfiguration = require('../configuration/main.json');
const utilityTools = require('../components/utilityTools');
const interactionResponse = require('../components/interactionResponse');
const { activeGames, createGame, moveSnake, changeDirection } = require('../components/game/gameManager');
const { getPreview } = require('../components/game/gamePreview');

var movementObjects = new Collection(),
	lastInteraction = new Date().getTime();
setInterval(() => {
	var movementObject = movementObjects.first();
	if (!movementObject) return;

	movementObject.function();
	movementObjects.delete(movementObject.key);
}, 1200);

/**
 * 
 * @param {Client} client
 * @param {CommandInteraction} interaction
 */
module.exports.run = async (client, interaction) => {
	if (!interaction.member) return interaction.reply(utilityTools.simpleEmbed('You can\'t use this bot in direct messages!', mainConfiguration.colors.red)).catch(console.error);

	if (interaction.type == 'MESSAGE_COMPONENT') {
		switch (interaction.customID) {
			case 'stop':
				var gameObject = activeGames.get(interaction.member.user.id);
				if (!gameObject) return interactionResponse.acknowledge(client, interaction).catch(console.error);

				gameObject.updateFunction(false, true);
				activeGames.delete(interaction.member.user.id);

				interactionResponse.acknowledge(client, interaction).catch(console.error);
				break;
			default:
				var gameObject = activeGames.get(interaction.member.user.id);
				if (!gameObject) return interactionResponse.acknowledge(client, interaction).catch(console.error);

				changeDirection(gameObject.playerObject.id, interaction.customID).then(() => {
					moveSnake(gameObject.playerObject.id).then(() => {
						getPreview(gameObject).then(() => {
							interactionResponse.acknowledge(client, interaction).catch(console.error);

							if ((new Date().getTime() - lastInteraction) > 1000) {
								lastInteraction = new Date().getTime();
								gameObject.updateFunction();
							} else {
								lastInteraction = new Date().getTime();
								movementObjects.set(interaction.id, {
									key: interaction.id,
									function: () => {
										gameObject.updateFunction();
									}
								});
							}
						}).catch(console.error);
					}).catch(console.error);
				}).catch((error) => {
					if (error) console.error(error);

					getPreview(gameObject).then(() => {
						interactionResponse.acknowledge(client, interaction).catch(console.error);

						if ((new Date().getTime() - lastInteraction) > 1000) {
							lastInteraction = new Date().getTime();
							gameObject.updateFunction();
						} else {
							lastInteraction = new Date().getTime();
							movementObjects.set(interaction.id, {
								key: interaction.id,
								function: () => {
									gameObject.updateFunction();
								}
							});
						}
					}).catch(console.error);
				});
				break;
		}
	} else {
		interaction.defer().then(() => {
			// ...

			if (!interaction.guild) return interaction.reply(utilityTools.simpleEmbed('Beepo must be added to this server in order to use it!', mainConfiguration.colors.red)).catch(console.error);

			client.commands.forEach((command) => {
				if (command.help.name === interaction.commandName) command.run(client, interaction);
			});
		});
	}
}

module.exports.help = {
	name: "interaction"
};
