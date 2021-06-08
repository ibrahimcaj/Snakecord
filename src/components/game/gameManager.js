const { Collection } = require("discord.js");

const mainConfiguration = require('../../configuration/main.json');
const { randomRange } = require('../../components/utilityTools');
const { getPreview } = require('../../components/game/gamePreview');

// ---

var activeGames = new Collection();
module.exports.activeGames = activeGames;

// ---

var createGame = (playerObject, canvasBackground = 'classic') => {
	return new Promise((resolve, reject) => {
		if (!mainConfiguration.game.backgrounds.includes(canvasBackground)) canvasBackground = 'classic';

		var gameObject = {
			playerObject: playerObject,
			startedAt: new Date(),
			canvasSize: mainConfiguration.game.default.canvasSize,
			canvasTheme: canvasBackground,
			pointsAmount: 0,
			bodyParts: [
				{ x: mainConfiguration.game.default.head.x, y: mainConfiguration.game.default.head.y },
				{ x: mainConfiguration.game.default.head.x - 1, y: mainConfiguration.game.default.head.y },
				{ x: mainConfiguration.game.default.head.x - 2, y: mainConfiguration.game.default.head.y }
			],
			lastUpdate: {
				timeoutValue: null,
				updateTimestamp: new Date().getTime()
			},
			directionalVelocities: { x: 1, y: 0 },
			pointPosition: { x: 0, y: 0 },
			objectVersion: Math.round(new Date().getTime() * mainConfiguration.game.seed),
			updateFunction: null
		};

		activeGames.set(playerObject.id, gameObject);
		this.spawnPoint(gameObject.playerObject.id);

		resolve(gameObject);
	});
}
module.exports.createGame = createGame;
var setUpdateFunction = (playerID, updateFunction) => {
	return new Promise((resolve, reject) => {
		var gameObject = activeGames.get(playerID);
		if (!gameObject) reject();

		gameObject.updateFunction = updateFunction;

		activeGames.set(gameObject.playerObject.id, gameObject);
		resolve(gameObject);
	});
}
module.exports.setUpdateFunction = setUpdateFunction;

var moveSnake = (playerID) => {
	return new Promise((resolve, reject) => {
		var gameObject = activeGames.get(playerID);
		if (!gameObject) reject();

		var bodyHead = { x: gameObject.bodyParts[0].x + gameObject.directionalVelocities.x, y: gameObject.bodyParts[0].y + gameObject.directionalVelocities.y };
		gameObject.bodyParts.unshift(bodyHead);
		gameObject.bodyParts.pop();

		gameObject.objectVersion = Math.round(new Date().getTime() * mainConfiguration.game.seed);

		if (bodyHead.x == mainConfiguration.game.region.x.from || bodyHead.x == mainConfiguration.game.region.x.to || bodyHead.y == mainConfiguration.game.region.y.from || bodyHead.y == mainConfiguration.game.region.y.to) {
			if (gameObject.lastUpdate.timeoutValue) clearTimeout(gameObject.lastUpdate.timeoutValue);

			gameObject.updateFunction(false, true, 'Game over!');
		} else if (gameObject.bodyParts.some((bodyPart, bodyPartIndex) => bodyPartIndex != 0 && bodyPart.x == bodyHead.x && bodyPart.y == bodyHead.y)) {
			if (gameObject.lastUpdate.timeoutValue) clearTimeout(gameObject.lastUpdate.timeoutValue);

			gameObject.updateFunction(false, true, 'Game over!');
		} else {
			if (bodyHead.x == gameObject.pointPosition.x && bodyHead.y == gameObject.pointPosition.y) {
				gameObject.bodyParts.unshift({ x: bodyHead.x + gameObject.directionalVelocities.x, y: bodyHead.y + gameObject.directionalVelocities.y });
				this.spawnPoint(gameObject.playerObject.id);

				gameObject.pointsAmount += 1;
			}

			activeGames.set(gameObject.playerObject.id, gameObject);
			resolve(gameObject);

			if (gameObject.lastUpdate.timeoutValue) clearTimeout(gameObject.lastUpdate.timeoutValue);
			gameObject.lastUpdate.timeoutValue = setTimeout(() => {
				gameObject.lastUpdate.timeoutValue = null;

				this.moveSnake(gameObject.playerObject.id).then(() => {
					getPreview(gameObject).then(() => {
						gameObject.updateFunction();
					}).catch(console.error);
				}).catch(console.error);
			}, 2500);
		}
	});
}
module.exports.moveSnake = moveSnake;
var changeDirection = (playerID, moveDirection = 'current') => {
	return new Promise((resolve, reject) => {
		var gameObject = activeGames.get(playerID);
		if (!gameObject) reject();

		const goingUp = gameObject.directionalVelocities.y === -1;
		const goingDown = gameObject.directionalVelocities.y === 1;
		const goingRight = gameObject.directionalVelocities.x === 1;
		const goingLeft = gameObject.directionalVelocities.x === -1;

		switch (moveDirection) {
			case 'up':
				if (goingDown) return reject();

				gameObject.directionalVelocities.x = 0;
				gameObject.directionalVelocities.y = -1;
				break;
			case 'down':
				if (goingUp) return reject();

				gameObject.directionalVelocities.x = 0;
				gameObject.directionalVelocities.y = 1;
				break;
			case 'right':
				if (goingLeft) return reject();

				gameObject.directionalVelocities.x = 1;
				gameObject.directionalVelocities.y = 0;
				break;
			case 'left':
				if (goingRight) return reject();

				gameObject.directionalVelocities.x = -1;
				gameObject.directionalVelocities.y = 0;
				break;
		}

		activeGames.set(gameObject.playerObject.id, gameObject);
		resolve(gameObject);
	});
}
module.exports.changeDirection = changeDirection;

var spawnPoint = (playerID) => {
	return new Promise((resolve, reject) => {
		var gameObject = activeGames.get(playerID);
		if (!gameObject) return;

		gameObject.pointPosition = { x: randomRange(mainConfiguration.game.region.x.from, mainConfiguration.game.region.x.to), y: randomRange(mainConfiguration.game.region.y.from, mainConfiguration.game.region.y.to) };

		activeGames.set(gameObject.playerObject.id, gameObject);
		resolve(gameObject);
	});
}
module.exports.spawnPoint = spawnPoint;