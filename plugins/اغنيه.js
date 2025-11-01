import axios from "axios";
import yts from "yt-search";

const fcontact = (m) => ({
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    remoteJid: 'status@broadcast'
  },
  message: {
    contactMessage: {
      displayName: `${m.pushName || "User"}`,
      vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;${m.pushName || "User"};;;\nFN:${m.pushName || "User"}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
    }
  }
});

const apiBaseUrl = "https://api.obito-sar.store/api/download/youtube";

let handler = async (m, { conn, args, text }) => {
  if (!text) return m.reply("❗ من فضلك اكتب رابط الفيديو أو اسم الأغنية بعد الأمر.\n💡 مثال: \n.اغنيه عمرو دياب");

  try {
    await conn.sendMessage(m.chat, { react: { text: '🔎', key: m.key } });

    let url = null;

    if (text.includes("youtube.com") || text.includes("youtu.be")) {
      url = text;
    } else {
      const search = await yts(text);
      if (!search.videos || !search.videos.length) return m.reply("❌ لم يتم العثور على نتائج.");
      url = search.videos[0].url;
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    const { data } = await axios.get(`${apiBaseUrl}?url=${encodeURIComponent(url)}&format=audio`);

    if (!data.status || !data.data) return m.reply('⚠️ فشل الحصول على رابط التحميل.');

    const { dlurl, title, thumbnail } = data.data;


    const audioBuffer = (await axios.get(dlurl, { responseType: "arraybuffer" })).data;

    await conn.sendMessage(m.chat, {
      audio: Buffer.from(audioBuffer),
      mimetype: 'audio/mpeg',
      ptt: false, 
      fileName: `${title}.mp3`,
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: `📄 العنوان: ${title}`,
          body: 'أنا لا أتحمل ذنب ما تشاهده أو تسمعه',
          thumbnailUrl: thumbnail.high, 
          mediaUrl: url,
          sourceUrl: url,
          renderLargerThumbnail: true,
        }
      }
    }, { quoted: fcontact(m) });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (err) {
    console.error(err);
    m.reply(`⚠️ خطأ أثناء التحميل: ${err.message}`);
  }
};

handler.help = ["اغنيه"];
handler.tags = ["main"];
handler.command = ["اغنيه", "اغنية"];

export default handler;
