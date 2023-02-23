const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "도움말",
    execute(message, args) {
        const Embed = new MessageEmbed()
            .setTitle(`\-!금지어<추가/삭제>⠀⠀금지어 설정\n-!도박 <금액>⠀⠀도박 기능\n-!돈줘⠀⠀일일 돈 지급\n-!뮤트 <멘션>⠀⠀특정 유저를 뮤트\n-!한강온도⠀⠀한강의 온도 확인\n-!미션⠀⠀미션 해결로 돈벌기!\n-!송금 <멘션> <금액>⠀⠀돈 보내기\n-!순위표⠀⠀돈 순위 확인\n-!문의⠀⠀문의채널을 생성\n-!언뮤트⠀⠀뮤트를 해제\n-!계산기⠀⠀계산기 사용\n-!출첵⠀⠀출석체크\n-!잔액⠀⠀잔액 확인\n-!출첵 순위⠀⠀출석체크 순위 확인`)
            .setColor("#c84ce2")
            .setTimestamp()
            message.channel.send({ embeds: [Embed] })
    }
}