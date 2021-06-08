const { Client, MessageEmbed, CommandInteraction, MessageAttachment } = require('discord.js');

const configuration = require('../configuration.json');
const mainConfiguration = require('../configuration/main.json');
const { codeBlockString } = require('../components/utilityTools');
const { activeGames, createGame, setUpdateFunction, moveSnake, changeDirection } = require('../components/game/gameManager');
const { getPreview } = require('../components/game/gamePreview');

/**
 * 
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 */
module.exports.run = async (client, interaction) => {
	createGame(interaction.member.user, ((interaction.options.size > 0) ? interaction.options.first().value : null)).then((gameObject) => {
		var displayFunction = (firstRun = false, stoppingGame = false, stopReason = 'Game stopped.') => {
			if (stoppingGame) {
				var gameEmbed = new MessageEmbed()
					.setColor(mainConfiguration.colors.red)
					.setImage(`${configuration.server.url}/${gameObject.playerObject.id}/${gameObject.objectVersion}`)
					.setDescription(`Points: **${gameObject.pointsAmount}**\n\n**${stopReason}**`)
					.setFooter('If the preview has not loaded yet,\npress one of the buttons to update it.');

				interaction.editReply({
					embeds: [gameEmbed], components: [
						{
							type: 'ACTION_ROW',
							components: [
								{
									type: 'BUTTON',
									style: 'SECONDARY',
									customID: `blank`,
									emoji: mainConfiguration.game.emojis.blank,
									disabled: true
								},
								{
									type: 'BUTTON',
									style: 'SECONDARY',
									customID: `up`,
									emoji: mainConfiguration.game.emojis.up,
									disabled: true
								},
								{
									type: 'BUTTON',
									style: 'SECONDARY',
									customID: `blank`,
									emoji: mainConfiguration.game.emojis.blank,
									disabled: true
								}
							]
						},
						{
							type: 'ACTION_ROW',
							components: [
								{
									type: 'BUTTON',
									style: 'SECONDARY',
									customID: `left`,
									emoji: mainConfiguration.game.emojis.left,
									disabled: true
								},
								{
									type: 'BUTTON',
									style: 'DANGER',
									customID: `stop`,
									emoji: mainConfiguration.game.emojis.stop,
									disabled: true
								},
								{
									type: 'BUTTON',
									style: 'SECONDARY',
									customID: `right`,
									emoji: mainConfiguration.game.emojis.right,
									disabled: true
								}
							]
						},
						{
							type: 'ACTION_ROW',
							components: [
								{
									type: 'BUTTON',
									style: 'SECONDARY',
									customID: `blank`,
									emoji: mainConfiguration.game.emojis.blank,
									disabled: true
								},
								{
									type: 'BUTTON',
									style: 'SECONDARY',
									customID: `down`,
									emoji: mainConfiguration.game.emojis.down,
									disabled: true
								},
								{
									type: 'BUTTON',
									style: 'SECONDARY',
									customID: `blank`,
									emoji: mainConfiguration.game.emojis.blank,
									disabled: true
								}
							]
						}
					]
				}).then(() => {
					activeGames.delete(gameObject.playerObject.id);
				}).catch(console.error);
			} else {
				gameObject = activeGames.get(interaction.member.user.id);
				if (!gameObject) return clearInterval(displayInterval);

				var updateMessage = () => {
					const goingUp = gameObject.directionalVelocities.y === -1;
					const goingDown = gameObject.directionalVelocities.y === 1;
					const goingRight = gameObject.directionalVelocities.x === 1;
					const goingLeft = gameObject.directionalVelocities.x === -1;

					var gameEmbed = new MessageEmbed()
						.setColor(mainConfiguration.colors.embed)
						.setImage(`${configuration.server.url}/${gameObject.playerObject.id}/${gameObject.objectVersion}`)
						.setDescription(`Points: ${gameObject.pointsAmount}`)
					.setFooter('If the preview has not loaded yet,\npress one of the buttons to update it.');

					interaction.editReply({
						embeds: [gameEmbed], components: [
							{
								type: 'ACTION_ROW',
								components: [
									{
										type: 'BUTTON',
										style: 'SECONDARY',
										customID: `blank`,
									emoji: mainConfiguration.game.emojis.blank,
										disabled: true
									},
									{
										type: 'BUTTON',
										style: (goingDown ? 'SECONDARY' : 'PRIMARY'),
										customID: `up`,
										emoji: mainConfiguration.game.emojis.up
									},
									{
										type: 'BUTTON',
										style: 'SECONDARY',
										customID: `blank`,
										emoji: mainConfiguration.game.emojis.blank,
										disabled: true
									}
								]
							},
							{
								type: 'ACTION_ROW',
								components: [
									{
										type: 'BUTTON',
										style: (goingRight ? 'SECONDARY' : 'PRIMARY'),
										customID: `left`,
										emoji: mainConfiguration.game.emojis.left
									},
									{
										type: 'BUTTON',
										style: 'DANGER',
										customID: `stop`,
										emoji: mainConfiguration.game.emojis.stop
									},
									{
										type: 'BUTTON',
										style: (goingLeft ? 'SECONDARY' : 'PRIMARY'),
										customID: `right`,
										emoji: mainConfiguration.game.emojis.right
									}
								]
							},
							{
								type: 'ACTION_ROW',
								components: [
									{
										type: 'BUTTON',
										style: 'SECONDARY',
										customID: `blank`,
										emoji: mainConfiguration.game.emojis.blank,
										disabled: true
									},
									{
										type: 'BUTTON',
										style: (goingUp ? 'SECONDARY' : 'PRIMARY'),
										customID: `down`,
										emoji: mainConfiguration.game.emojis.down
									},
									{
										type: 'BUTTON',
										style: 'SECONDARY',
										customID: `blank`,
										emoji: mainConfiguration.game.emojis.blank,
										disabled: true
									}
								]
							}
						]
					}).catch(console.error);
				}

				if (firstRun) {
					getPreview(gameObject).then(() => {
						updateMessage();
					});
				} else updateMessage();
			}
		}

		setUpdateFunction(gameObject.playerObject.id, displayFunction).then(() => {
			displayFunction(true);
		}).catch(console.error);
	}).catch(console.error);
}

module.exports.help = {
	name: "play",
	description: "Play snake!",
	options: [{
		type: "STRING",
		name: "background",
		description: "The background you want to choose.",
		choices: mainConfiguration.game.backgrounds.map((gameBackground) => { return { name: gameBackground.charAt(0).toUpperCase() + gameBackground.slice(1, gameBackground.length), value: gameBackground }; })
	}]
};