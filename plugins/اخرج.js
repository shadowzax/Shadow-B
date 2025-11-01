let handler = async (m, { conn }) => {
  await m.reply('هتوحشوني >_<');
  await conn.groupLeave(m.chat);
};

handler.help = ['اخرج'];
handler.tags = ['group'];
handler.command = ['اخرج'];
handler.group = true;
handler.owner = true;
handler.botAdmin = true;

export default handler;