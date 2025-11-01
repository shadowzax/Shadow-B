let handler = async (m, { conn }) => {
    let bannedGroups = Object.entries(global.db.data.chats)
        .filter(([id, data]) => id.endsWith('@g.us') && data.isBanned)
        .map(([id], index) => `${index + 1}. ${id}`)
    
    if (bannedGroups.length == 0) return m.reply('✅ لا يوجد أي جروبات محظورة حالياً')

    let list = `🍷 قائمة الجروبات المحظورة:\n\n${bannedGroups.join('\n')}`
    m.reply(list)
}
handler.help = ['المحظورين']
handler.tags = ['owner']
handler.command = ['المحظورين', 'bannedgroups']
handler.owner = true

export default handler