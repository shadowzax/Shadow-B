import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('*`『 اكتب الكلام اللي عايزني اقوله بلصوت مع الأمر 🍬 』`*');

    let res = await fetch(`https://the-end-api.vercel.app/home/sections/VoiceAi/api/api/voice/Laura?q=${encodeURIComponent(text)}&apikey=emam-a-key-500-unlimt-x8k3p9q2r5`);
    let audioBuffer = await res.buffer();

    await conn.sendMessage(m.chat, {
        audio: audioBuffer,
        mimetype: 'audio/mpeg',
        ptt: true
    }, { quoted: m });
};

handler.command = ["انطقي"];
handler.help = ["اسمع"];
handler.tags = ['ai'];

export default handler;