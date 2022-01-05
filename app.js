require('dotenv').config();

const { Client, Intents } = require('discord.js');

const {MessageEmbed, MessageButton, MessageActionRow} = require('discord.js');

const {setup, close, nextTurn} = require('./models/tictactoe');
const keepAlive = require('./server');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => 
{
    console.log(client.user.tag);
});

client.on('messageCreate', async(message) =>
{
    if(message.author.bot)
    {
        return;
    }

    const splited = message.content.split(' ');
    const command = splited.slice(0, 1)[0];
    const args = splited.slice(1);

    try 
    {
        if(command == 'O!' + 'tictactoe')
        {
            setup(message, client);
        }
        else if(command == 'O!' + 'close-ttt')
        {
            close(message);
        }
        else if(message.mentions.users.first() == client.user.id || command == 'O!' + 'help')
        {
            const embed = new MessageEmbed().setTitle(client.user.tag)
                        .addFields(
                            {
                                name: 'Introduction',
                                value: "Hello my name is " + client.user.tag
                            },
                            {
                                name: '· O!tictactoe [mention]',
                                value: "Opens a Tic Tac Toe game, the message author is `x` and the mention user is `o`"
                            },
                            {
                                name: '· O!close-ttt',
                                value: "Closes a current Tic Tac Toe game, only players of current game can use this command"
                            },
                        );
                        
            await message.channel.send({
                embeds: [embed]
            });
        }
    }
    catch (error) 
    {
        await message.channel.send('Error, please check the command arguments');
        console.log(error);
    }
});

client.on('interactionCreate', async(interaction) => 
{	
    nextTurn(interaction, client);
});

if(process.env.PRODUCTION == 1)
{
    keepAlive();
}

client.login(process.env.TOKEN);