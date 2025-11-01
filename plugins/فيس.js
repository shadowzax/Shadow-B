let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `🍇 يرجى إدخال رابط الفيديو Facebook\nمثال:\n${usedPrefix + command} https://www.facebook.com/watch/?v=322884916560598`;

    try {
        let res = await fetch(`https://api.obito-sar.store/api/download/facebook?url=${encodeURIComponent(args[0])}`);
        let json = await res.json();

        let videoUrl = json.videoLinks.hd;
        if (!videoUrl) throw `لم يتم العثور على رابط الفيديو.`;

        await conn.sendFile(m.chat, videoUrl, 'video.mp4', `❮ ✅ ┇ تم تحميل الفيديو بنجاح ❯\n> أنا لا أتحمل ذنوب ما تشاهده أو تسمعه`, m);
    } catch {
        throw `حدث خطأ أثناء معالجة الطلب. تأكد من صحة الرابط وحاول مرة أخرى.`;
    }
};

handler.help = ['facebook'];
handler.tags = ['main'];
handler.command = ['فيس', 'فيسبوك', 'فيس بوك', 'facebook', 'fd'];
export default handler;