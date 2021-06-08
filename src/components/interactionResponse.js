const axios = require("axios");

var acknowledge = (client, interaction) => {
	return new Promise(function(resolve, reject) {
		axios({
			method: `POST`,
			headers: {
				Authorization: `Bot ${client.token}`,
				"Content-Type": "application/json",
				Accept: "*/*",
			},
			url: `https://discord.com/api/v8/interactions/${interaction.id}/${interaction.token}/callback`,
			data: {
				type: 6
			}
		}).then(() => resolve()).catch((errorObject) => reject(errorObject));
	});
}
module.exports.acknowledge = acknowledge;

var edit = (client, interaction, content) => {
	return new Promise(function(resolve, reject) {
		if (interaction.token) {
			var data = {
				type: 7,
				data: {
					embeds: [content.options.embed],
					components: content.options.components
				}
			};

			data.data.components.forEach((componentArray, componentIndex) => {
				if (data.data.components[componentIndex].type == 'ACTION_ROW') data.data.components[componentIndex].type = 1;

				data.data.components[componentIndex].components.forEach((rowComponent, rowIndex) => {
					if (rowComponent.type == 'BUTTON') data.data.components[componentIndex].components[rowIndex].type = 2;

					// ---

					var label = rowComponent.label,
						style = rowComponent.style;

					var styles = {
						'PRIMARY': 1,
						'SECONDARY': 2,
						'SUCCESS': 3,
						'DANGER': 4,
						'LINK': 5
					}
					style = styles[style];

					delete data.data.components[componentIndex].components[rowIndex].label;
					delete data.data.components[componentIndex].components[rowIndex].style;

					data.data.components[componentIndex].components[rowIndex]['label'] = label;
					data.data.components[componentIndex].components[rowIndex]['style'] = style;

					// ---

					if (rowComponent.customID) {
						data.data.components[componentIndex].components[rowIndex]['custom_id'] = rowComponent.customID;
						delete data.data.components[componentIndex].components[rowIndex].customID;
					}
				});
			});

			axios({
				method: `POST`,
				headers: {
					Authorization: `Bot ${client.token}`,
					"Content-Type": "application/json",
					Accept: "*/*",
				},
				url: `https://discord.com/api/v8/interactions/${interaction.id}/${interaction.token}/callback`,
				data: data
			}).then(() => resolve()).catch((errorObject) => reject(errorObject));
		}
	});
};
module.exports.edit = edit;