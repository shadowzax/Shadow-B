import fs from 'fs';

var handler = async (m, { text, usedPrefix, command, conn }) => {

    if (!text) return conn.reply(m.chat, `🎌 *أدخل اسم الملحق*`, m);

    if (!m.quoted.text) return conn.reply(m.chat, `🚩 *أدخل محتوى الملحق*`, m);

    let path = `plugins/${text}.js`;

    await fs.writeFileSync(path, m.quoted.text);

    conn.reply(m.chat, `✅ *تم الحفظ في* ${path}`, m);

};

handler.help = ['saveplugin'];

handler.tags = ['own'];

handler.command = ['فلافل', 'فلفولي'];

handler.rowner = true;

export default handler;