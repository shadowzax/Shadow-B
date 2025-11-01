import { webp2png } from '../lib/webp2mp4.js'

let handler = async (m, { conn, usedPrefix, command }) => {
    const notStickerMessage = `*❗╎❯ يـجـب عـلـيـك أن تـرسـل مـلـصـق لـتـحـويـلـها إلـي صــوره*`
    if (!m.quoted) throw notStickerMessage
    const q = m.quoted || m
    let mime = q.mediaType || ''
    if (!/sticker/.test(mime)) throw notStickerMessage
    let media = await q.download()
    let out = await webp2png(media).catch(_ => null) || Buffer.alloc(0)
    await conn.sendFile(m.chat, out, 'out.png', '*❐┃تـم الـتـحـويـل┃✅ ❯*', m)
}
handler.help = ['toimg <sticker>']
handler.tags = ['sticker']
handler.command = ['لصوره', 'لصورة', 'aimg'] 

export default handler