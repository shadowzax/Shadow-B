import fetch from 'node-fetch';
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

let handler = async (message, { conn }) => {
  let packsRaw = await (await fetch("https://raw.githubusercontent.com/Afghhjjkoo/GURU-BOT/main/lib/miku54.json")).json();
  let pack = packsRaw[Math.floor(Math.random() * packsRaw.length)];

  let maleImageBuffer = Buffer.from(await (await fetch(pack.cowo)).arrayBuffer());
  let femaleImageBuffer = Buffer.from(await (await fetch(pack.cewe)).arrayBuffer());

  const maleMedia = { image: maleImageBuffer };
  const uploadOptions = { upload: conn.waUploadToServer };
  const preparedMale = await prepareWAMessageMedia(maleMedia, uploadOptions);

  const maleText = { text: "الـصـورة الـأولـي" };
  const maleHeader = {
    hasMediaAttachment: true,
    imageMessage: preparedMale.imageMessage
  };
  const maleQuickReply = {
    name: "quick_reply",
    buttonParamsJson: "{\"display_text\":\"الـتــالـي\",\"id\":\".طقم\"}"
  };
  const maleCta = {
    name: "cta_url",
    buttonParamsJson: "{\"display_text\":\"⌗ SHADOW ⋮ サポート\",\"url\":\"https://whatsapp.com/channel/0029VbB0faVKLaHuzgBCR83H\",\"merchant_url\":\"https://whatsapp.com/channel/0029VbB0faVKLaHuzgBCR83H\"}"
  };
  const maleNativeFlow = {
    buttons: [maleQuickReply, maleCta],
    messageParamsJson: ''
  };
  const maleInteractive = {
    body: maleText,
    header: maleHeader,
    nativeFlowMessage: maleNativeFlow
  };
  const maleMessage = { interactiveMessage: maleInteractive };
  const maleViewOnce = { message: maleMessage };
  const maleWrapper = { viewOnceMessage: maleViewOnce };

  let maleWaMessage = generateWAMessageFromContent(message.chat, maleWrapper, {
    userJid: conn.user.jid,
    quoted: message
  });

  await conn.relayMessage(message.chat, maleWaMessage.message, {
    messageId: maleWaMessage.key.id
  });

  const femaleMedia = { image: femaleImageBuffer };
  const preparedFemale = await prepareWAMessageMedia(femaleMedia, uploadOptions);

  const femaleText = { text: "الـصـورة الـثـانـيـة" };
  const femaleHeader = {
    hasMediaAttachment: true,
    imageMessage: preparedFemale.imageMessage
  };
  const femaleCta = {
    name: "cta_url",
    buttonParamsJson: "{\"display_text\":\"⌗ SHADOW ⋮ サポート\",\"url\":\"https://whatsapp.com/channel/0029VbB0faVKLaHuzgBCR83H\",\"merchant_url\":\"https://whatsapp.com/channel/0029VbB0faVKLaHuzgBCR83H\"}"
  };
  const femaleNativeFlow = {
    buttons: [femaleCta],
    messageParamsJson: ''
  };
  const femaleInteractive = {
    body: femaleText,
    header: femaleHeader,
    nativeFlowMessage: femaleNativeFlow
  };
  const femaleMessage = { interactiveMessage: femaleInteractive };
  const femaleViewOnce = { message: femaleMessage };
  const femaleWrapper = { viewOnceMessage: femaleViewOnce };

  let femaleWaMessage = generateWAMessageFromContent(message.chat, femaleWrapper, {
    userJid: conn.user.jid,
    quoted: message
  });

  await conn.relayMessage(message.chat, femaleWaMessage.message, {
    messageId: femaleWaMessage.key.id
  });
};

handler.command = /^طقمي/i;
handler.limit = true;

export default handler;
