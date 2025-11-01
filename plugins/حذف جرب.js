import fs from 'fs';

var handler = async (m, { text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `🎌 *أدخل اسم الملحق*`, m);

    let path = `plugins/${text}.js`;

    if (!fs.existsSync(path)) {
        return conn.reply(m.chat, `🚩 *الملحق غير موجود*`, m);
    }

    await fs.unlinkSync(path);
    conn.reply(m.chat, `✅ *تم الحذف من* ${path}`, m);
}

handler.help = ['deleteplugin'];
handler.tags = ['own'];
handler.command = ['حذف-جرب', 'احذفه'];
handler.rowner = true;

export default handler;
