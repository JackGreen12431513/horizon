const discord = require('discord.js');
const GoogleImages = require('google-images');
require('dotenv').config();
var client = new discord.Client();
const fs = require('fs');
var memes = require('dankmemes');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'))
const guilds = JSON.parse(fs.readFileSync('./Data/guilds.json', 'utf8'));
const userData = JSON.parse(fs.readFileSync('./Data/userData.json', 'utf8'))

const prefix = config.prefix;
const adminRole = config.HorizonRoles_ADMIN;
const modRole = config.HorizonRoles_MOD;

client.login(process.env.horizonTK);

client.on('ready', () => {
    client.user.setActivity(`h.help | over ${client.users.size} users`)
})

client.on('message', message => {
    var sender = message.author;
    var guild = message.guild;

    if(!userData[sender.id]) userData[sender.id] = {
        canDM: false,
        verified: false,
        verifyInfo: {
            token: "",
            date: ""
        },
        warns: 0
    }
    write(1);

    if(!message.channel.type == 'dm') {
        if(!guilds[guild.id]) guilds[guild.id] = {
            guildInfo: {
                guildName: guild.name,
                guildOwner: guild.owner.user.tag,
                guildCreated: guild.createdAt
            }
        }
        write(2);
    } else {

    }

    if(!message.content.startsWith(prefix)||message.author.bot) return;
    var args = message.content.substring(prefix.length).split(" ");

    switch(args[0]) {

        default:
        message.channel.send(`Command \`${args[0]}\` not found! Please use \`${prefix}help\`!`).then(msg => {
            msg.delete(3000);
        })
        break;

        case "help":
        var emb = new discord.RichEmbed()
        .setAuthor("Horizon Help")
        .addField("General:", "`binfo` `ginfo`", true)
        .setColor(0x98343A)
        message.channel.send(emb);
        break;

        case "binfo":
        var emb = new discord.RichEmbed()
        .setAuthor("Horizon Stats")
        .addField("General:", `Guilds In: \`${client.guilds.size}\`\nTotal Users: \`${client.users.size}\``, true)
        .addField("Stats:", `Ping: \`${Math.floor(client.ping)}ms\`\nUptime: \`${millisToMinutesAndSeconds(client.uptime)}s\``, true)
        .setColor(0x98343A)
        message.channel.send(emb);
        break;

        case "ginfo":
        var emb = new discord.RichEmbed()
        .setAuthor(guild.name)
        .addField("General:", `Guild ID: \`${guild.id}\`\nMember Count: \`${guild.members.size}\`\nRole Count: \`${guild.roles.size}\``, true)
        .setThumbnail(guild.iconURL)
        .setColor(0x98343A)
        message.channel.send(emb);
        break;

        case "purge":
        if(message.member.roles.find("name", adminRole) || message.member.roles.find("name", modRole)) {
            message.channel.bulkDelete(args[1]).then(
                message.author.send(`**${args[1]}** messages deleted in **${guild.name}**`).then(msg => {
                    msg.delete(3000)
                })
            )
        } else {
            message.channel.send(`Sorry, ${sender}, you do not have the permissions to use this command!`)
        }
        break;
    
        case "dankest":
            memes('day', args[1], function(err, data) {
                var items = JSON.parse(JSON.stringify(data))
                var emb = new discord.RichEmbed()
                .setAuthor("Dankest Meme Leaderboard")
                .addField("🥇 #1", items[1])
                .addField("🥈 #2", items[2])
                .addField("🥉 #3", items[3])
                .setColor(0x98343A)
                message.channel.send(emb)
            })
        break;

    }
})

function write(type) {
    if(type === 1) {
        fs.writeFileSync('./Data/userData.json', JSON.stringify(userData))
    } else if(type === 2) {
        fs.writeFileSync('./Data/guilds.json', JSON.stringify(guilds))
    }
} 


function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }