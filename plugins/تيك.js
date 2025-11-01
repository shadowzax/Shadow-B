import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) throw `*❌ يرجى استخدام الأمر مع رابط فيديو من تيك توك*\nمثال: ${usedPrefix + command} https://vt.tiktok.com/ZS2tqxmeX/`;
  m.react('⏳');

  try {
    let result = await downloadTikTokVideo(text);

    if (!result) throw '❌ حدث خطأ في تحميل الفيديو';

    // إرسال الفيديو إلى الدردشة
    await conn.sendFile(m.chat, result.video, '', `✅ تم تحميل الفيديو بنجاح\nالعنوان: ${result.title}\nرابط الصوت: ${result.audio}`, m);
  } catch (error) {
    throw `❌ حدث خطأ ما في تحميل الفيديو`;
  }
};

async function downloadTikTokVideo(url) {
  let response = await fetch(`https://api-streamline.vercel.app/dltiktok?url=${encodeURIComponent(url)}`);
  
  if (!response.ok) return false;

  let data = await response.json();

  if (!data.title || !data.play || !data.music_info) return false;

  // تجهيز المعلومات للإرسال
  return {
    title: data.title,
    video: data.play,
    audio: data.music_info.play
  };
}

handler.help = ['تيك'];
handler.tags = ['downloader'];
handler.command = /^تيك$/i;

export default handler;