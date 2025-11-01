const handler = async (m, {conn, text, command, usedPrefix, args}) => {
// let pp = 'https://www.bighero6challenge.com/images/thumbs/Piedra,-papel-o-tijera-0003318_1584.jpeg'
  const pp = 'https://telegra.ph/file/c7924bf0e0d839290cc51.jpg';

  // 60000 = 1 minuto // 30000 = 30 segundos // 15000 = 15 segundos // 10000 = 10 segundos
  const time = global.db.data.users[m.sender].wait + 10000;
  if (new Date - global.db.data.users[m.sender].wait < 10000) throw `*🕓 انتظر ${Math.floor((time - new Date()) / 1000)} ثواني قبل أن تتمكن من اللعب مرة أخرى*`;
  if (!args[0]) return conn.reply(m.chat, `*حجر 🗿, ورق 📄 𝐨 مقص ✂️*\n\n*—◉ اختار:*\n*◉ ${usedPrefix + command} حجر*\n*◉ ${usedPrefix + command} ورق*\n*◉ ${usedPrefix + command} مقص*`, m);
  // conn.sendButton(m.chat, `*𝐏𝐢𝐞𝐝𝐫𝐚 🗿, 𝐏𝐚𝐩𝐞𝐥 📄 𝐨 𝐓𝐢𝐣𝐞𝐫𝐚 ✂️*\n\n*—◉  𝙿𝚎𝚍𝚎𝚜 𝚞𝚜𝚊𝚛 𝚕𝚘𝚜 𝚋𝚘𝚝𝚘𝚗𝚎𝚜 𝚙𝚊𝚛𝚊 𝚓𝚞𝚐𝚊𝚛 𝚘 𝚝𝚊𝚖𝚋𝚒𝚎𝚗 𝚙𝚞𝚎𝚍𝚎𝚜 𝚞𝚜𝚊𝚛 𝚎𝚜𝚝𝚘𝚜 𝚌𝚘𝚖𝚊𝚗𝚍𝚘𝚜:*\n*◉ ${usedPrefix + command} piedra*\n*◉ ${usedPrefix + command} papel*\n*◉ ${usedPrefix + command} tijera*`, wm, pp, [['Piedra 🗿', `${usedPrefix + command} piedra`], ['Papel 📄', `${usedPrefix + command} papel`], ['Tijera ✂️', `${usedPrefix + command} tijera`]], m)
  let astro = Math.random();
  if (astro < 0.34) {
    astro = 'حجر';
  } else if (astro > 0.34 && astro < 0.67) {
    astro = 'ورق';
  } else {
    astro = 'مقص';
  }
  const textm = text.toLowerCase();
  if (textm == astro) {
    global.db.data.users[m.sender].exp += 500;
    m.reply(`*🔰 تعادل*👉🏻 انت اخترت: ${textm}*\n*👉🏻 البوت اختار: ${astro}*\n*🎁 نقاط +500 XP*`);
  } else if (text == 'ورق') {
    if (astro == 'حجر') {
      global.db.data.users[m.sender].exp += 1000;
      m.reply(`*🥳 لقد ربحت! 🎉*\n\n*👉🏻 انت اخترت: ${textm}*\n*👉🏻 البوت اختار: ${astro}*\n*🎁 نقاط +1000 XP*`);
    } else {
      global.db.data.users[m.sender].exp -= 300;
      m.reply(`*☠️ لقد خسرت! ❌*\n\n*👉🏻 انت اخترت: ${textm}*\n*👉🏻 البوت اختار: ${astro}*\n*❌ نقاط -300 XP*`);
    }
  } else if (text == 'مقص') {
    if (astro == 'ورق') {
      global.db.data.users[m.sender].exp += 1000;
      m.reply(`*🥳 لقد ربحت! 🎉*\n\n*👉🏻 انت اخترت: ${textm}*\n*👉🏻 البوت اختار: ${astro}*\n*🎁 نقاط +1000 XP*`);
    } else {
      global.db.data.users[m.sender].exp -= 300;
      m.reply(`*☠️ لقد خسرت! ❌*\n\n*👉🏻 انت اخترت: ${textm}*\n*👉🏻 البوت اختار: ${astro}*\n*❌ نقاط -300 XP*`);
    }
  } else if (textm == 'مقص') {
    if (astro == 'ورق') {
      global.db.data.users[m.sender].exp += 1000;
      m.reply(`*🥳 انت ربحت! 🎉*\n\n*👉🏻 انت اخترت: ${textm}*\n*👉🏻 البوت اختار: ${astro}*\n*🎁 تقاط +1000 XP*`);
    } else {
      global.db.data.users[m.sender].exp -= 300;
      m.reply(`*☠️ لقد خسرت! ❌*\n\n*👉🏻 انت اخترت: ${textm}*\n*👉🏻 البوت اختار: ${astro}*\n*❌ نقاط -300 XP*`);
    }
  } else if (textm == 'ورق') {
    if (astro == 'حجر') {
      global.db.data.users[m.sender].exp += 1000;
      m.reply(`*🥳 لقد ربحت! 🎉*\n\n*👉🏻 انت اخترت: ${textm}*\n*👉🏻 البوت اختار: ${astro}*\n*🎁 نقاط +1000 XP*`);
    } else {
      global.db.data.users[m.sender].exp -= 300;
      m.reply(`*☠️ لقد خسرت! ❌*\n\n*👉🏻 انت اخترت: ${textm}*\n*👉🏻 البوت اختار: ${astro}*\n*❌ نقاط -300 XP*`);
    }
  } else if (textm == 'حجر') {
    if (astro == 'مقص') {
      global.db.data.users[m.sender].exp += 1000;
      m.reply(`*🥳 لقد ريحت! 🎉*\n\n*👉🏻 انت اخترت: ${textm}*\n*👉🏻 البوت اختار: ${astro}*\n*🎁 نقاط +1000 XP*`);
    } else {
      global.db.data.users[m.sender].exp -= 300;
      m.reply(`*☠️ لقد خسرت! ❌*\n\n*👉🏻 انت اخترت: ${textm}*\n*👉🏻 البوت اختار: ${astro}*\n*❌ نقاط -300 XP*`);
    }
  }
  global.db.data.users[m.sender].wait = new Date * 1;
};
handler.help = ['ppt'];
handler.tags = ['games'];
handler.command = /^(العب)$/i;
export default handler;