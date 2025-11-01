let handler = async (m, { conn, usedPrefix, text }) => {
  if (isNaN(text) && !text.match(/@/g)) {
    // النص ليس رقمًا أو منشن
  } else if (isNaN(text)) {
    var number = text.split`@`[1]; // استخراج الرقم من المنشن
  } else if (!isNaN(text)) {
    var number = text; // النص هو رقم
  }

  if (!text && !m.quoted) {
    return conn.reply(m.chat, `*[❗] الاستخدام المناسب*\n\n*┯┷*\n*┠≽ ${usedPrefix}تخفيض @منشن*\n*┠≽ ${usedPrefix}تخفيض -> الرد على رسالة*\n*┷┯*`, m);
  }

  if (number.length > 13 || (number.length < 11 && number.length > 0)) {
    return conn.reply(m.chat, `*[ ⚠️ ] الرقم الذي تم إدخاله غير صحيح ، الرجاء إدخال الرقم الصحيح*`, m);
  }

  try {
    if (text) {
      var user = number + '@s.whatsapp.net';
    } else if (m.quoted.sender) {
      var user = m.quoted.sender;
    } else if (m.mentionedJid) {
      var user = number + '@s.whatsapp.net';
    }
  } catch (e) {
    // خطأ في استخراج المستخدم
  }

  // قائمة أرقام مطوري البوت
  let ownerNumber = global.owner.map(o => o[0] + '@s.whatsapp.net');

  // التحقق مما إذا كان المستخدم المطور
  if (ownerNumber.includes(user)) {
    // إذا كان المستخدم المطور، اطرد الشخص الذي طلب الخفض
    await m.reply(
      `*❗ هل تتجرأ علي خفض رتبة مطوري 😡، سيتم طردك فوراً ❗*\n\n*@${
        m.sender.split`@`[0]
      } سيتم طردك الآن.*`,
      null,
      { mentions: [m.sender] }
    );
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
  } else {
    // إذا لم يكن المستخدم مطورًا، قم بتخفيض رتبة المستخدم
    await conn.groupParticipantsUpdate(m.chat, [user], 'demote');
    await conn.reply(m.chat, `*✅╎❯ لـم تـعـد مـشـرفا بـعـد الـأن لـهـذه الـمـجـمـوعـه 💔*`, m);
  }
};

handler.help = ['*201063720595xxx*','*@اسم المستخدم*','*محادثة المستجيب*'].map(v => 'demote ' + v);
handler.tags = ['group'];
handler.command = /^(خفض|إزالة المشرف|ازالة المشرف|تخفيض|تنزيل)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.fail = null;

export default handler;