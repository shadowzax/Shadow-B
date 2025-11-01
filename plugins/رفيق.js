let toM = a => '@' + a.split('@')[0]
function handler(m, { groupMetadata, conn }) {
    let ps = groupMetadata.participants.map(v => v.id)
    
    let user = m.sender;
    let available = ps.filter(id => id !== user)
    
    if (available.length === 0) {
        return m.reply('❌ مافي أعضاء غيرك في المجموعة!')
    }
    
    let randomIndex = Math.floor(Math.random() * available.length)
    let b = available[randomIndex]
    
    // استخدام conn.sendMessage بدل m.reply علشان المنشنات
    conn.sendMessage(m.chat, { 
        text: `@${user.split('@')[0]} 💕 توأمك روحي هو ${toM(b)} 💓`,
        mentions: [user, b]
    }, { quoted: m })
}
handler.help = ['formarpareja']
handler.tags = ['main', 'fun']
handler.command = ['سولميت','رفيق']
handler.group = true
handler.limit = 4
export default handler
