const { Collection } = require('discord.js');
const express = require('express');
const chalk = require('chalk');
const fs = require('fs');

const configuration = require('../configuration.json');
const { activeGames } = require('../components/game/gameManager');
const { imageCache, getPreview } = require('../components/game/gamePreview');

const app = express();

app.get('/:userID/:objectVersion', (request, response) => {
	if (!request.params.userID || !request.params.objectVersion) return response.status(500);

	var gameObject = activeGames.get(request.params.userID);

	var responseImage = (imageBuffer) => {
		var gameImage = Buffer.from(imageBuffer, 'base64');

		response.writeHead(200, {
			'Content-Type': 'image/png',
			'Content-Length': gameImage.length
		});
		response.end(gameImage);
	}

	if (!gameObject) {
		var gameImageCache = imageCache.get(request.params.userID);

		if (gameImageCache) {
			responseImage(gameImageCache.imageBuffer);
		} else {
			return fs.readFile('./src/boards/blank.png', (error, imageData) => {
				if (error) return response.status(404);

				var gameImage = Buffer.from(imageData, 'base64');

				response.writeHead(200, {
					'Content-Type': 'image/png',
					'Content-Length': gameImage.length
				});
				response.end(gameImage);
			});
		}
	} else {
		getPreview(gameObject).then((imageBuffer) => {
			responseImage(imageBuffer);
		}).catch(console.error);
	}
});

// ---

var startServer = () => {
	return new Promise((resolve, reject) => {
		app.listen(configuration.server.port, () => {
			console.log(chalk`{green [SERVER]} Image server is up on port {underline ${configuration.server.port}}.\n`);

			resolve(app);
		});
	});
}
module.exports.startServer = startServer;