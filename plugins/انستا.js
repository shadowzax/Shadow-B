let handler = async (m, { conn, text }) => {
  if (!text) throw 'ضيف رابط يغالي...';

  const apiUrl = `https://api.obito-sar.store/api/download/instagram?url=${encodeURIComponent(text)}`;

  try {
    m.react('📥');
    let response = await fetch(apiUrl);
    let result = await response.json();

    console.log('API response:', result);

    if (result && result.status && result.obitosar && result.obitosar.length > 0) {
      for (let item of result.obitosar) {
        await conn.sendFile(
          m.chat,
          item.downloadLink,
          'ig_media.mp4',
          `*🍷╎ تم تحميل الفيديو بنجاح ❯*\n> *أنا لا أتحمل ذنوب ما تشاهده أو تسمعه*`,
          m
        );
      }
      m.react('✅');
    } else {
      throw new Error(result.message || 'لم يتم العثور على المحتوى.');
    }
  } catch (error) {
    console.error('Download error:', error);
    m.reply('❮ ❌ ┇ حدث خطأ ما في تحميل الفيديو ❯');
    m.react('❌');
  }
};

handler.help = ['instagram'];
handler.tags = ['downloader'];
handler.command = /^(instagram|igdl|ig|instagramdl|انستا)$/i;

export default handler;