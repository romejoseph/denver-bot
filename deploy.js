require("dotenv").config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const APP_ID = process.env.APP_ID || null;
const APP_SECRET = process.env.BOT_TOKEN || null;

const commands = [
    new SlashCommandBuilder()
        .setName('aoem')
        .setDescription('Get AOEM advice')
        .addStringOption(option => 
            option.setName('query')
                .setDescription('AOEM Query')
                .setRequired(true)),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(APP_SECRET);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(APP_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
