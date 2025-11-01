let handler = async (m, { groupMetadata, conn }) => {
    let participants = groupMetadata.participants.map(v => v.id)
    
    let a = participants[Math.floor(Math.random() * participants.length)]
    let b
    do {
        b = participants[Math.floor(Math.random() * participants.length)]
    } while (b === a)
    
    let text = `*لنكوّن بعض الأصدقاء*\n\n`
    text += `*يا @${a.split('@')[0]} لتتحدث ف الخاص مع @${b.split('@')[0]} حتى يتمكنوا من اللعب ويصبحوا أصدقاء 🙆*\n\n`
    text += `*تبدأ أفضل الصداقات بالالعاب 😉*`
    
    await conn.sendMessage(m.chat, { 
        text: text,
        mentions: [a, b]
    }, { quoted: m })
}

handler.help = ['صداقة']
handler.tags = ['fun', 'group']
handler.command = ['صداقه', 'صداقة']
handler.group = true
handler.limit = 4
handler.premium = false

export default handler
