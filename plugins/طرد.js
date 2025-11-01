let handler = async (m, { conn, participants, usedPrefix, command }) => {
  let kickte = `*🍷╎ قـم بـعـمـل مـنـشـن لـلـشـخـص الـذي تـريـد طـرده*`;

  if (!m.mentionedJid[0] && !m.quoted) {
    return m.reply(kickte, m.chat, { mentions: conn.parseMention(kickte) });
  }

  let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;
  let ownerNumber = global.owner.map(o => o[0] + '@s.whatsapp.net');

  if (ownerNumber.includes(user)) {

    await m.reply(
      `*❗ هل تتجرأ علي طرد مطوري 😡، سيتم طردك فوراً ❗*\n\n*@${
        m.sender.split`@`[0]
      } سيتم طردك الآن.*`,
      null,
      { mentions: [m.sender] }
    );
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
  } else {
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
    m.reply(`*يلا غور برا من هنا*`);
  }
};

handler.help = ['kick @user'];
handler.tags = ['group'];
handler.command = ['kick', 'طرد'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;