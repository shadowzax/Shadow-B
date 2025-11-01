import { toAudio } from '../lib/converter.js'
let handler = async (m, { conn, usedPrefix, command }) => {
let done = '🎵'; 
       m.react(done);
let q = m.quoted ? m.quoted : m
let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
if (!/video|audio/.test(mime)) throw `*⌫┇رد عـلـي فـيـديـو لـي تـحـولـه الـي مـقـطـع صـوتـي┇〄*`
let media = await q.download?.()
if (!media && !/video/.test(mime)) throw '*⌫┇رد عـلـي فـيـديـو لـي تـحـولـه الـي مـقـطـع صـوتـي┇〄*'
if (!media && !/audio/.test(mime)) throw '*⌫┇رد عـلـي فـيـديـو لـي تـحـولـه الـي مـقـطـع صـوتـي┇〄*'
let audio = await toAudio(media, 'mp4')
if (!audio.data && !/audio/.test(mime)) throw '*⌫┇رد عـلـي فـيـديـو لـي تـحـولـه الـي مـقـطـع صـوتـي┇〄*'
if (!audio.data && !/video/.test(mime)) throw '*⌫┇رد عـلـي فـيـديـو لـي تـحـولـه الـي مـقـطـع صـوتـي┇〄*'
conn.sendFile(m.chat, audio.data, 'error.mp3', '', m, null, { mimetype: 'audio/mp4' })
}
handler.help = ['tomp3 (reply)']
handler.tags = ['audio']
handler.command = ['tomp3', 'ليصوت', 'mp3','لصوت','صدا','صوت']
export default handler
