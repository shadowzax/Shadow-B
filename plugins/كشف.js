import { WAMessageStubType } from '@whiskeysockets/baileys';
import fetch from 'node-fetch';

export async function before(message, { conn, participants }) {
  if (!message.messageStubType || !message.isGroup) return true;

  const groupName = (await conn.groupMetadata(message.chat)).subject;
  const admins = participants.filter(p => p.admin);
  const profilePicUrl = await conn.profilePictureUrl(message.chat, "image").catch(() => null) || "https://i.ibb.co/nsHBvFwp/file-00000000098861fdac3718853fd7f38d.png";
  const profilePicBuffer = Buffer.from(await (await fetch(profilePicUrl)).arrayBuffer());

  const mentionAll = [message.sender, message.messageStubParameters[0], ...admins.map(a => a.id)];
  const mentionBasic = [message.sender, message.messageStubParameters[0]];

  const contactMsg = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      contactMessage: {
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${message.sender.split('@')[0]}:${message.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  };

  if (message.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_PROMOTE) {
    let text = `*💞لقد أصبحت زعيما💞*\n\n*◦ المجموعة:* ${groupName}\n*◦ ارجو لك توفيق 💞:* @${message.messageStubParameters[0].split('@')[0]}\n*◦ الي رفعك:* @${message.sender.split('@')[0]}\n\n*𝙱𝚈┇օɮɨȶօֆǟʀ & ǟʏǟռօӄօʊʝɨ*`;
    await conn.sendMessage(message.chat, { image: profilePicBuffer, caption: text, mentions: mentionAll }, { quoted: contactMsg });
  }

  if (message.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_DEMOTE) {
    let text = `*لم يعد زعيما 😔💔*\n\n*◦ المجموعة:* ${groupName}\n*◦ الشخص الذي سحب منه الاشراف:* @${message.messageStubParameters[0].split('@')[0]}\n*◦ المنفذ:* @${message.sender.split('@')[0]}\n\n*𝙱𝚈┇օɮɨȶօֆǟʀ & ǟʏǟռօӄօʊʝɨ*`;
    await conn.sendMessage(message.chat, { image: profilePicBuffer, caption: text, mentions: mentionAll }, { quoted: contactMsg });
  }

  if (message.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD || message.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_INVITE) {
    let text = `*أنرت الجروب ب نورك الساطع ✨*\n\n*◦ المجموعة:* ${groupName}\n`;
    if (!message.sender.endsWith("@g.us")) text += `*◦ العضو:* @${message.messageStubParameters[0].split('@')[0]}\n*◦ الي دخلك :* @${message.sender.split('@')[0]}`;
    else text += `*◦ مرحبا:* @${message.messageStubParameters[0].split('@')[0]}`;
    text += `\n\n*𝙱𝚈┇օɮɨȶօֆǟʀ & ǟʏǟռօӄօʊʝɨ*`;
    await conn.sendMessage(message.chat, { image: profilePicBuffer, caption: text, mentions: mentionBasic }, { quoted: contactMsg });
  }

  if (message.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE) {
    let text = `*تم ازالتك من المجموعه 😭💔*\n\n*◦ المجموعة:* ${groupName}\n`;
    if (!message.sender.endsWith("@g.us")) text += `*◦ العضو:* @${message.messageStubParameters[0].split('@')[0]}\n*◦ الي ازالك:* @${message.sender.split('@')[0]}`;
    else text += `*◦ هتوحشنا 😭✨:* @${message.messageStubParameters[0].split('@')[0]}`;
    text += `\n\n*𝙱𝚈┇օɮɨȶօֆǟʀ & ǟʏǟռօӄօʊʝɨ*`;
    await conn.sendMessage(message.chat, { image: { url: profilePicUrl }, caption: text, mentions: mentionBasic }, { quoted: contactMsg });
  }

  if (message.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
    let text = `*لم تعد ذو قيمه 😔💔.*\n\n*◦ المجموعة:* ${groupName}\n*◦ في دهيه:* @${message.messageStubParameters[0].split('@')[0]}\n\n*𝙱𝚈┇օɮɨȶօֆǟʀ & ǟʏǟռօӄօʊʝɨ*`;
    await conn.sendMessage(message.chat, { image: { url: profilePicUrl }, caption: text, mentions: mentionBasic }, { quoted: contactMsg });
  }

  if (message.messageStubType === WAMessageStubType.GROUP_CHANGE_ANNOUNCE) {
    const status = message.messageStubParameters[0] === "true" ? "cerrado" : "abierto";
    let text = `*🧑‍💻تم تغيير إعدادات المجموعة مؤخرًا.*\n\n*◦ المجموعة:* ${groupName}\n*◦ الوضع:* \`\`\`${status}\`\`\`\n*◦ الي غير:* @${message.sender.split('@')[0]}\n\n*𝙱𝚈┇օɮɨȶօֆǟʀ & ǟʏǟռօӄօʊʝɨ*`;
    await conn.sendMessage(message.chat, { image: { url: profilePicUrl }, caption: text, mentions: mentionBasic }, { quoted: contactMsg });
  }

  if (message.messageStubType === WAMessageStubType.GROUP_CHANGE_SUBJECT) {
    let text = `*🧑‍💻تم تغيير اسم المجموعة مؤخرًا.*\n\n*◦ الاسم الجديد:* \`\`\`${groupName}\`\`\`\n*◦ المنفذ:* @${message.sender.split('@')[0]}\n\n*𝙱𝚈┇օɮɨȶօֆǟʀ & ǟʏǟռօӄօʊʝɨ*`;
    await conn.sendMessage(message.chat, { image: { url: profilePicUrl }, caption: text, mentions: mentionBasic }, { quoted: contactMsg });
  }

  return true;
}
