let handler = async (m, { conn }) => {
    global.db.data.chats[m.chat].isBanned = true
    m.reply('*تـــم اطـفـاء الـبـوت فــي هـذا الـجروب*')
}
handler.help = ['banchat']
handler.tags = ['owner']
handler.command = ['حظر', 'chatoff'] 
handler.owner = true

export default handler