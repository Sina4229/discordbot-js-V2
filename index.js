const { Client , Intents , Collection} = require('discord.js')
module.exports = client;
const fs = require('fs')
const { prefix , token, mongo_url} = require('./config.json')
const { DiscordTogether } = require('discord-together')
client.discordTogether = new DiscordTogether(client);
const mongoose = require("mongoose")
const Levels = require("discord-xp")
const Discord = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
Levels.setURL(mongo_url)
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })
const dotenv = require('dotenv'); 
dotenv.config();

if (process.env.TOKEN == null) {
    console.log("An discord token is empty.");
    sleep(60000).then(() => console.log("Service is getting stopped automatically"));
    return 0;
}

const discordLogin = async() => {
    try {
        await client.login(process.env.TOKEN);  
    } catch (TOKEN_INVALID) {
        console.log("An invalid token was provided");
        sleep(60000).then(() => console.log("Service is getting stopped automatically"));
    }
}

discordLogin();

mongoose.connect(mongo_url,{
}).then(console.log("데이터베이스 연결 완료"))

//슬래쉬 커맨드 핸들
client.slashcommands = new Collection()
let commands = []
const commandsFile1 = fs.readdirSync('./slashcommands').filter(file => file.endsWith('.js'))
for(const file of commandsFile1){
    const command = require(`./slashcommands/${file}`)
    client.slashcommands.set(command.name, command);
    commands.push({ name: command.name, description: command.description})
}

client.on("interactionCreate",async interaction =>{
    if(!interaction.isCommand()) return
    const command = client.slashcommands.get(interaction, commandName)
    if(!command) return
    try{
        await command.execute(interaction)
    } catch (err){
        console.error(err)
        await interaction.reply({ content: "오류가 발생했습니다.", ephemeral: true})
    }
})
client.once('ready',()=>{
    let number = 0
    setInterval(() => {
        const list = ["가입시 1만 기부", "문의 Sina#4229" , "!도움말 로 명령어 확인" , "since 2023.02.03"]
        if(number == list.length) number = 0
        client.user.setActivity(list[number],{
            type:"PLAYING"
        })
        number++
    }, 10000) //몇초마다 상태메세지를 바꿀지 정해주세요 (1000 = 1초)
    console.log("봇이 준비되었습니다")
})

client.once('ready', async () => {
    client.guilds.cache.forEach(gd=>{
        gd.commands.set(commands)
        console.log(client.user.username + " 로그인 완료")
    })
})

process.on("ungandleRejection",err=>{
    if(error == "DiscordAPIError: Missing Access") return console.log("봇에게 슬래쉬 커맨드를 서버에 푸쉬 할 권한이 없어서 서버에 슬래쉬 커맨드를 푸쉬하지 못했습니다.")
    console.error(err)
})

client.on('messageCreate' , message=>{
    if(message.content == "!클마"){
        message.reply("따안 / Sina#4229")
    }
})
//메시지 커맨드 핸들
client.commands = new Collection()

const commandsFile = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for(const file of commandsFile){
    const command = require(`./commands/${file}`)
    client.commands.set(command.name , command)
}

client.on('messageCreate' , message=>{
    if(!message.content.startsWith(prefix)) return
    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const commandName = args.shift()
    const command = client.commands.get(commandName)
    if (!command) return
    try{
        command.execute(message,args)
    } catch (error) {
        console.error(error)
    }
})

client.on("messageCreate",async message=>{
    if(message.channel.type == "DM") return
    const Schema = require("./models/금지어")
    const args = message.content.slice(prefix.length).trim().split(/ +/)
    if(args[1] == "추가" || args[1] == "삭제") return
    await Schema.find({serverid:message.guild.id}).exec((err,res)=>{
        for(let i = 0;i < res.length;i++){
            if(message.content.includes(res[i].금지어)){
                if(res[i].온오프 == "on"){
                    message.delete()
                    const embed = new (require("discord.js")).MessageEmbed()
                    .setTitle("삐빅 ! 금지어 감지")
                    .setDescription(`${message.content}에서 금지어가 감지되었습니다.`)
                    .addField("감지된 금지어",`${res[i].금지어}`)
                    .setColor("RED")
                    .setTimestamp()
                    message.channel.send({embeds:[embed]}).then(msg=>{
                        setTimeout(() => {
                            msg.delete()
                        }, 5000);
                    })
                }
            }
        }
    })
})


client.on('messageCreate',message=>{
    if(message.content == `${prefix}youtube`){
        const channel = message.member.voice.channel
        if(!channel) return message.reply("음성채널에 접속해주세요!")
        client.discordTogether.createTogetherCode(channel.id, 'youtube').then(invite =>{
            return message.channel.send(invite.code)
        })
    }
})

client.login(token)
