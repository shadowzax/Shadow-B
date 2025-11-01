import { addExif } from '../lib/sticker.js';

let handler = async (m, { conn, text }) => {
  if (!m.quoted) throw '*🍷╎  يـجـب الـرد عـلـي مـلـصـق الـذي تـريـد سـرقـتـه*';
  let stiker = false;
  try {
    let [packname, ...author] = text.split('|');
    author = (author || []).join('|');
    let mime = m.quoted.mimetype || '';
    if (!/webp/.test(mime)) throw '*🍷╎ يـجـب الـرد عـلـي مـلـصـق الـذي تـريـد سـرقـتـه*';
    let img = await m.quoted.download();
    if (!img) throw '*🍷╎ يـجـب الـرد عـلـي مـلـصـق الـذي تـريـد سـرقـتـه*';
    stiker = await addExif(img, packname || '', author || '');
  } catch (e) {
    console.error(e);
    if (Buffer.isBuffer(e)) stiker = e;
  } finally {
    if (stiker) {
      const fkontak2 = {
        'key': {
          'participants': '0@s.whatsapp.net',
          'remoteJid': 'status@broadcast',
          'fromMe': false,
          'id': 'Halo'
        },
        'message': {
          'contactMessage': {
            'displayName': `${m.pushName}`,
            'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
          }
        },
        'participant': '0@s.whatsapp.net'
      };

      await conn.sendMessage(m.key.remoteJid, { sticker: stiker }, { quoted: fkontak2 });
    } else {
      throw '*❗╎❯ يـجـب الـرد عـلـي مـلـصـق الـذي تـريـد سـرقـتـه*';
    }
  }
};

handler.help = ['wm <packname>|<author>'];
handler.tags = ['sticker'];
handler.command = /^(سرقه|حقوق|سرقة)$/i;
export default handler;