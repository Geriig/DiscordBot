const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, MessageFlags, Collection } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for(const folder of commandFolders){
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for(const file of commandFiles){
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if('data' in command && 'execute' in command){
            client.commands.set(command.data.name, command);
        } else{
            console.log(`[WARNING] The commanda at ${filePath} is missing a requiered "data" or "execute" property.`)
        }
    }
}

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if(!command){
        console.error(`No command matching ${interaction.commandName} was found`);
        return;
    }

    try{
        await command.execute(interaction);
    } catch (error){
        console.error(error);
        if(interaction.replied ||interaction.deffered){
            await interaction.followUp({content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral})
        }else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
    }
});



client.login(token);
