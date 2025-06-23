const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data : new SlashCommandBuilder()
        .setName('server')
        .setDescription('Returns information on server'),
        
    async execute(interaction){
        await interaction.reply(`A szerver neve: ${interaction.guild.name}, a tagok száma: ${interaction.guild.memberCount}`)
    },
};