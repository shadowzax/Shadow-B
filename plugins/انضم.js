let handler = async (m, { conn, text, usedPrefix, command, args, isOwner }) => {

  if (!isOwner) return conn.sendButton(
    m.chat,
    `👑 *دعوة البوت إلى مجموعة*\n\nيا @${m.sender.split('@')[0]}\nلو حابب تضيف البوت لجروبك، كلم الأونر ينظمها لك ✨`,
    igfg,
    null,
    [['📞 اتصل بالأونر', `${usedPrefix}buyprem`]],
    m,
    { mentions: [m.sender] }
  )

  let linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i
  let delay = t => new Promise(r => setTimeout(r, t))
  let [_, code] = text.match(linkRegex) || []

  if (!args[0]) throw `⚠️ أرسل رابط الجروب يا زعيم.\n\n📌 مثال:\n*${usedPrefix + command}* <الرابط>`
  if (!code) throw `❌ الرابط غير صحيح! تأكد من صحته يا فندم.`

  m.reply(`⏳ جاري الدخول إلى الجروب... لحظات يا أسطورة 🔥`)
  await delay(3000)

  try {
    let res = await conn.groupAcceptInvite(code)
    let info = await conn.groupMetadata(res)
    let members = info.participants.map(v => v.id)

    await m.reply(`✅ *تم دخول البوت بنجاح!*\n\n🏷️ *اسم الجروب:* ${await conn.getName(res)}\n👥 *عدد الأعضاء:* ${members.length}`)
    await conn.reply(
      res,
      `🎉 أهلاً بالجميع!\n\n@${m.sender.split('@')[0]} هو اللي دعاني 🌟`,
      m,
      { mentions: members }
    )
    await delay(7000)
    await conn.reply(res, `🤭 فليهدأ الجميع، البوت حاضر لخدمتكم ❤️`, 0)

  } catch (e) {
    conn.reply(global.owner[1] + '@s.whatsapp.net', e)
    throw `⚠️ حصل خطأ أثناء محاولة انضمام البوت إلى الجروب.`
  }
}

handler.help = ['join <chat.whatsapp.com>']
handler.tags = ['owner']
handler.command = ['ادخل', 'انضم', 'join']
handler.owner = true

export default handler
