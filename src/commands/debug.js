const { Client, MessageEmbed, CommandInteraction } = require('discord.js'),
    moment = require('moment');

const mainConfiguration = require('../configuration/main.json');
const { codeBlockString } = require('../components/utilityTools');

/**
 * 
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 */
module.exports.run = async (client, interaction) => {
    var uptimeDate = new Date(Math.round(process.uptime() * 1000));
	if (uptimeDate.getTime() < (60 * 60000)) uptimeDate.setHours(0);
    
    uptimeDate = moment(uptimeDate);

    var debugInformation = {
        bot: {
            shardCount: (client.shard ? client.shard.count.toLocaleString() : 1),
            guildCount: client.guilds.cache.size.toLocaleString(),
            userCount: client.users.cache.size.toLocaleString(),
            botUptime: uptimeDate.format("H [hours], m [minutes], s [seconds]")
        },
        server: {
            guildID: interaction.guild.id,
        }
    }

    // ---

    var debugEmbed = new MessageEmbed()
        .setColor(mainConfiguration.colors.embed)
        .setTitle('Snakecord Debug')
        .setTimestamp();
        
    debugEmbed.addFields([
        { name: '__Bot Information__', value: '** **' },
        { name: 'Total Shards', value: `${codeBlockString(debugInformation.bot.shardCount)}`, inline: true },
        { name: 'Total Guilds', value: `${codeBlockString(debugInformation.bot.guildCount)}`, inline: true },
        { name: 'Total Users:', value: `${codeBlockString(debugInformation.bot.userCount)}`, inline: true },
        { name: 'Bot Uptime:', value: `${codeBlockString(debugInformation.bot.botUptime)}` },
    ]);
    debugEmbed.addFields([
        { name: '__Server Information__', value: '** **' },
        { name: 'Server ID', value: `${codeBlockString(debugInformation.server.guildID)}`, inline: true },
    ]);

    interaction.editReply(debugEmbed).catch(console.error);
}

module.exports.help = {
    name: "debug",
    description: "Displays helpful developer information.",
    options: []
};