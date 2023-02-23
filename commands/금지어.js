const Schema = require("../models/금지어")
const { Permissions } = require("discord.js")

module.exports = {
    name: "금지어",
    async execute(message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply("해당 명령어를 사용하기 위해서는 관라자 권한이 필요합니다")
        let argsjoin = args.join(" ")
        if (args[0] == "삭제") {
            argsjoin = args.join(" ").slice(args[0].length).trim()
            if (!argsjoin) return message.reply("금지어 리스트에서 삭제 할 단어를 입력해주세요")
            const ff = await Schema.findOne({ serverid: message.guild.id, 금지어: argsjoin })
            if (!ff) return message.reply("이 단어는 금지어에 포함되지 않습니다")
            await Schema.findOneAndUpdate({ serverid: message.guild.id, 금지어: argsjoin }, {
                serverid: message.guild.id,
                금지어: argsjoin,
                온오프: "off"
            })
            message.channel.send(`\`${argsjoin}\`을/를 금지어 리스트에서 제거했습니다`)
        } else {
            if (args[0] == "추가") {
                argsjoin = args.join(" ").slice(args[0].length).trim()
                if (!argsjoin) return message.reply("금지어 리스트에 추가 할 단어를 입력해주세요")
                const find = await Schema.findOne({ serverid: message.guild.id, 금지어: argsjoin })
                if (find) {
                    if (find.온오프 == "on") return message.reply("이미 금지된 단어입니다")
                    await Schema.findOneAndUpdate({ serverid: message.guild.id, 금지어: argsjoin }, {
                        serverid: message.guild.id,
                        금지어: argsjoin,
                        온오프: "on"
                    })
                    message.channel.send(`\`${argsjoin}\`을/를 금지어로 지정했습니다`)
                } else {
                    const newData = new Schema({
                        serverid: message.guild.id,
                        금지어: argsjoin,
                        온오프: "on"
                    })
                    newData.save()
                    message.channel.send(`\`${argsjoin}\`을/를 금지어로 지정했습니다`)
                }
            } else return message.reply("옵션을 입력해주세요 ( 추가 , 삭제 )")
        }
    }
}