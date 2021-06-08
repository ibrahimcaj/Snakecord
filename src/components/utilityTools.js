const { MessageEmbed } = require("discord.js");

const mainConfiguration = require('../configuration/main.json');

// ---

var codeBlockString = (string) => `\`\`\`${string}\`\`\``;
module.exports.codeBlockString = codeBlockString;

var simpleEmbed = (embedDescription, embedColor) => new MessageEmbed().setDescription(embedDescription).setColor(embedColor || mainConfiguration.colors.embed);
module.exports.simpleEmbed = simpleEmbed;

var randomRange = (from, to) => Math.floor(Math.random() * ((from + 1) - to) + to);
module.exports.randomRange = randomRange;