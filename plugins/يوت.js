import { prepareWAMessageMedia, generateWAMessageFromContent, getDevice } from '@whiskeysockets/baileys';
import yts from 'yt-search';

const handler = async (m, { conn, text, usedPrefix }) => {
  const device = await getDevice(m.key.id);

  if (!text) {
    throw "*تقدر تحمل الفيدوهات او الاصوات من الامر دا*\n*مثال:*\n*يوتيوب المبدأ مروان بابلو*\n\n< ملحوظه انا غير مسؤول عن ما تشاهده >";
  }

  // شرط صحيح: لو الجهاز ليس من نوع desktop ولا web
  if (device !== "desktop" && device !== "web") {
    const search = await yts(text);
    const videos = search.videos.slice(0, 20);
    const randomIndex = Math.floor(Math.random() * videos.length);
    const randomVideo = videos[randomIndex];

    const thumb = { url: randomVideo.thumbnail };
    const media = await prepareWAMessageMedia({ image: thumb }, { upload: conn.waUploadToServer });

    const header = {
      title: "*بـحــث فــي الـيـوتـيــوب*",
      hasMediaAttachment: true,
      imageMessage: media.imageMessage
    };

    const bodyText = `
عــدد الـنـتـايــج: *${search.videos.length}*
الـعـنـوان: *${randomVideo.title}*
إســم الـحـســاب: *${randomVideo.author.name}*
عــدد الـمـشــاهـدات: *${randomVideo.views}*
الـرابــط: *『 ${randomVideo.url} 』*
رابــط‌ الـصــوره: *『 ${randomVideo.thumbnail} 』*

انقر علي الزر تحت لتحميل الفيديو او الصوت.
`.trim();

    const messageContent = {
      body: { text: bodyText },
      footer: { text: "> 𝙱𝚈┇MIKU 𝙱𝙾𝚃" },
      header,
      nativeFlowMessage: {
        buttons: [
          {
            name: "single_select",
            buttonParamsJson: JSON.stringify({
              title: "نـتـائــج الـبـحــث",
              sections: videos.map(video => ({
                title: video.title,
                rows: [
                  {
                    header: video.title,
                    title: video.author.name,
                    description: "🎶╎الـــــصـــــوت",
                    id: `.اغنيه ${video.url}`
                  },
                  {
                    header: video.title,
                    title: video.author.name,
                    description: "📥╎الـــــفـــــيـــــديــو",
                    id: `.يوت-لنك ${video.url}`
                  }
                ]
              }))
            })
          }
        ],
        messageParamsJson: ''
      }
    };

    const interactiveMsg = { interactiveMessage: messageContent };
    const wrappedMsg = { viewOnceMessage: { message: interactiveMsg } };

    const msg = generateWAMessageFromContent(m.chat, wrappedMsg, {
      userJid: conn.user.jid,
      quoted: m
    });

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

  } else {
    const search = await yts(text);
    const results = search.all
      .filter(v => v.type === "video")
      .map(v => `
° *_${v.title}_*
↳ 🫐 *_${v.url}_*
↳ 🕒 *_${v.timestamp}_*
↳ 📥 *_${v.ago}_*
↳ 👁 *_${v.views}_*
`).join("\n\n◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦\n\n");

    await conn.sendFile(m.chat, search.all[0]?.thumbnail || '', "thumb.jpg", results.trim(), m);
  }
};

handler.help = ["ytsearch <نص>"];
handler.tags = ["search"];
handler.command = /^(يوت)$/i;

export default handler;
