let handler = async (m, { groupMetadata, conn }) => {
    let participants = groupMetadata.participants.map(v => v.id)
    
    let a = participants[Math.floor(Math.random() * participants.length)]
    let b
    do {
        b = participants[Math.floor(Math.random() * participants.length)]
    } while (b === a)
    
    let text = `💔 *إعلان طلاق* 💔\n\n`
    text += `  @${a.split('@')[0]}\n`
    text += `  @${b.split('@')[0]}\n\n`
    text += `لم تصبحا زوجين بعد الآن 💔\n`
   
    
    await conn.sendMessage(m.chat, { 
        text: text,
        mentions: [a, b]
    }, { quoted: m })
}

handler.help = ['طلاق']
handler.tags = ['fun', 'group']
handler.command = ['الطلاق', 'طلاق']
handler.group = true
handler.limit = 4
handler.premium = false

export default handler
