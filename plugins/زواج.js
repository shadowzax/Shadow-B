let handler = async (m, { groupMetadata, conn }) => {
    let participants = groupMetadata.participants.map(v => v.id)
    
    let a = participants[Math.floor(Math.random() * participants.length)]
    let b
    do {
        b = participants[Math.floor(Math.random() * participants.length)]
    } while (b === a)
    
    let text = `🎉 *إعلان زواج* 🎉\n\n`
    text += `👰 العروس: @${a.split('@')[0]}\n`
    text += `🤵 العريس: @${b.split('@')[0]}\n\n`
    text += `تم اختياركم للزواج غظب 😼💕\n`
    text += `مبروك للعروسين! 🎊`
    
    await conn.sendMessage(m.chat, { 
        text: text,
        mentions: [a, b]
    }, { quoted: m })
}

handler.help = ['زواج']
handler.tags = ['fun', 'group']
handler.command = ['زواج', 'جواز']
handler.group = true
handler.limit = 4

export default handler
