const {MessageEmbed, MessageButton, MessageActionRow} = require('discord.js');

let p1;
let p2;

let turn = 0;

let row1;
let row2;
let row3;
let rows;

let lastmsg;

const values = [];

const play_y_msgs = ['You cant play with your self... :flushed:', 'You will win anyway :rolling_eyes:', 'So you want to defeat Guy Incognito...'];
const play_bot_msgs = ['I will win you anyway :smirk:', "I can't play in office time!", 'ZzzZzzzZz :sleeping:'];

const setup = async(message, client) => 
{
    if(turn == 0)
    {
        p1 = message.author;
        p2 = message.mentions.users.first();

        if(p2.id == p1.id)
        {
            message.channel.send("<@" + p1.id + "> " + play_y_msgs[Math.floor(Math.random() * play_y_msgs.length)]);
            return;
        }

        if(p2.id == client.user.id)
        {
            message.channel.send("<@" + p1.id + "> " + play_bot_msgs[Math.floor(Math.random() * play_bot_msgs.length)]);
            return;
        }

        row1 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('0')
                    .setLabel(' ')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('1')
                    .setLabel(' ')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('2')
                    .setLabel(' ')
                    .setStyle('SECONDARY'),
            );
        row2 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('3')
                    .setLabel(' ')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('4')
                    .setLabel(' ')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('5')
                    .setLabel(' ')
                    .setStyle('SECONDARY'),
            );
        row3 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('6')
                    .setLabel(' ')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('7')
                    .setLabel(' ')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('8')
                    .setLabel(' ')
                    .setStyle('SECONDARY'),
            );
        rows = [row1, row2, row3];

        emptyGame();
        
        turn = p1;

        const embed = new MessageEmbed().setTitle('Tic Tac Toe')
                    .addFields({
                        name: 'Turn',
                        value: "<@" + turn.id + ">"
                    });
                    
        lastmsg = await message.channel.send({
            embeds: [embed],
            components: rows,
        });
    }
}

const close = (message) =>
{
    if(turn != 0)
    {
        if(message.author.id == p1.id || message.author.id == p2.id)
        {
            const embed = new MessageEmbed().setTitle('Tic Tac Toe *FINISH*')
                        .addFields({
                            name: 'Closed by:',
                            value: "<@" + message.author.id + ">"
                        });
            
            turn = 0;
            emptyGame();
            disableAll();
                        
            message.channel.send({
                embeds: [embed],
                components: rows,
            });
        }
    }
}

const nextTurn = (interaction, client) =>
{   
    if(interaction.user.id == turn.id)
    {
        if(interaction.isButton())
        {
            rows.forEach((row) =>
            {
                row.components.forEach(async(element) =>
                {
                    if(element.customId == interaction.customId)
                    {
                        if(turn === p1)
                        {
                            values[interaction.customId] = 'x';
                            element.setLabel('x');
                            element.setDisabled(true);
                            turn = p2;
                        }
                        else
                        {
                            values[interaction.customId] = 'o';
                            element.setLabel('o');
                            element.setDisabled(true);
                            turn = p1;
                        }

                        if(checkWin('x'))
                        {
                            const embed = new MessageEmbed().setTitle('Tic Tac Toe *FINISH*')
                                .addFields({
                                    name: 'Winner',
                                    value: "<@" + p1.id + ">"
                                });
                            
                            turn = 0;
                            emptyGame();
                            disableAll();
                            
                            interaction.channel.messages.delete(lastmsg);
                            lastmsg = await interaction.channel.send({
                                embeds: [embed],
                                components: rows,
                            });
                        }
                        else if(checkWin('o'))
                        {
                            const embed = new MessageEmbed().setTitle('Tic Tac Toe *FINISH*')
                                .addFields({
                                    name: 'Winner',
                                    value: "<@" + p2.id + ">"
                                });

                            turn = 0;
                            emptyGame();
                            disableAll();
                                
                            interaction.channel.messages.delete(lastmsg);
                            lastmsg = await interaction.channel.send({
                                embeds: [embed],
                                components: rows,
                            });
                        }
                        else if(checkTie())
                        {
                            const embed = new MessageEmbed().setTitle('Tic Tac Toe *FINISH*')
                                .addFields({
                                    name: 'Tie',
                                    value: "We have a tie..."
                                });

                            turn = 0;
                            emptyGame();
                            disableAll();

                            interaction.channel.messages.delete(lastmsg);
                            lastmsg = await interaction.channel.send({
                                embeds: [embed],
                                components: rows,
                            });
                        }
                        else
                        {
                            const embed = new MessageEmbed().setTitle('Tic Tac Toe')
                                .addFields({
                                    name: 'Turn',
                                    value: "<@" + turn.id + ">"
                                });
                            
                            interaction.channel.messages.delete(lastmsg);
                            lastmsg = await interaction.channel.send({
                                embeds: [embed],
                                components: rows,
                            });
                        }
                    }
                });
            });
        }
    }
    else
    {
        return interaction.reply({content: "<@" + interaction.user.id + "> wait for your turn!"});
    }
}

const checkWin = (prefix) =>
{
    if((values[0] == prefix && values[1] == prefix && values[2] == prefix) ||
        (values[3] == prefix && values[4] == prefix && values[5] == prefix) ||
        (values[6] == prefix && values[7] == prefix && values[8] == prefix) ||
        (values[0] == prefix && values[3] == prefix && values[6] == prefix) ||
        (values[1] == prefix && values[4] == prefix && values[7] == prefix) ||
        (values[2] == prefix && values[5] == prefix && values[8] == prefix) ||
        (values[0] == prefix && values[4] == prefix && values[8] == prefix) ||
        (values[2] == prefix && values[4] == prefix && values[6] == prefix)
    )
    {
        return true;
    }

    return false;
}

const checkTie = () =>
{
    let tie = true;
    values.forEach((element) =>
    {
        if(element == ' ')
        {
            tie = false;
        }
    });

    return tie;
}

const emptyGame = () =>
{
    while(values.length)
    {
        values.pop();
    }

    for(let i = 0; i < 9; i++)
    {
        values.push(' ');
    }
}

const disableAll = () =>
{
    rows.forEach((row) =>
    {
        row.components.forEach(async(element) =>
        {
            element.setDisabled(true);
        });
    });
}

module.exports = {
    setup,
    close,
    nextTurn,
}