const { Collection } = require('discord.js');
const Jimp = require('jimp');

const mainConfiguration = require('../../configuration/main.json');

// ---

var imageCache = new Collection();
module.exports.imageCache = imageCache;

// ---

var getPreview = (gameObject) => {
	return new Promise((resolve, reject) => {
		Jimp.read(`./src/boards/${gameObject.canvasTheme}.png`).then((jimpImage) => {
			var bodyColor = gameObject.canvasTheme == 'classic' ? mainConfiguration.game.colors.classic.body : mainConfiguration.game.colors.body,
				pointColor = gameObject.canvasTheme == 'classic' ? mainConfiguration.game.colors.classic.point : mainConfiguration.game.colors.point

			jimpImage.setPixelColor(Jimp.rgbaToInt(...pointColor), gameObject.pointPosition.x, gameObject.pointPosition.y);
			gameObject.bodyParts.forEach((bodyPart) => {
				jimpImage.setPixelColor(Jimp.rgbaToInt(...bodyColor), bodyPart.x, bodyPart.y);
			});

			jimpImage = jimpImage.resize(mainConfiguration.game.default.previewCanvasSize, mainConfiguration.game.default.previewCanvasSize, Jimp.RESIZE_NEAREST_NEIGHBOR);

			jimpImage.getBufferAsync(jimpImage.getMIME()).then((imageBuffer) => {
				imageCache.set(gameObject.playerObject.id, { objectVersion: gameObject.objectVersion, imageBuffer: imageBuffer });

				resolve(imageBuffer);
			});
		});
	});
}
module.exports.getPreview = getPreview;