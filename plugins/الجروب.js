let handler = async (m, { conn, participants, groupMetadata }) => {
    const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || './src/avatar_contact.png';
    const groupAdmins = participants.filter(p => p.admin);
    const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n');
    const owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net';
    let text = `*『 مـعلـومـات ⊰🍷⊱ الـجـروب 』*\n

*🍷╎ الــوصـف:*
${groupMetadata.desc?.toString() || 'مفيش وصف 🐦‍⬛'}

*🍷╎ عـدد الـاعـضـاء:*
${participants.length} *عـضـو*

*🍷╎ الـمـؤسـس:* 
@${owner.split('@')[0]}

*🍷╎ الـمـشـرفـيـن:*
${listAdmin}
`.trim();
    conn.sendFile(m.chat, pp, 'error.jpg', text, m, false, { mentions: [...groupAdmins.map(v => v.id), owner] });
}
handler.help = ['infogroup'];
handler.tags = ['group'];
handler.command = /^(جروب|الجروب)$/i;
handler.group = true;
export default handler;