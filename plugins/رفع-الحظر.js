let handler = async (m, { conn }) => {
    global.db.data.chats[m.chat].isBanned = false
    m.reply('✅ البوت شغال في هذه المجموعه')   
}
handler.help = ['unbanchat']
handler.tags = ['owner']
handler.command = ['chaton', 'رفع-الحظر'] 
handler.owner = true

export default handler