import axios from 'axios';
import FormData from 'form-data';
import crypto from 'crypto';

let handler = async (m, { conn, args }) => {
  m.react('🏮');

  let quotedMessage = m.quoted ? m.quoted : m;
  let mimetype = (quotedMessage.msg || quotedMessage).mimetype || '';

  if (!mimetype.startsWith("image/")) {
    throw "*🍷╎ قم برد على الصورة التي تريد تحسين جودتها*";
  }

  let buffer = await quotedMessage.download();
  let upscaledUrl = await upscaleImage(buffer, "input.jpg", 4, 0);

  if (upscaledUrl instanceof Error) throw upscaledUrl.message;
  if (!upscaledUrl) throw "❌ فشل في عملية التكبير....";

  let senderName = await conn.getName(m.sender);

  const contactKey = {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  };

  const quoted = {
    key: contactKey,
    message: {
      contactMessage: {
        displayName: senderName,
        vcard:
          "BEGIN:VCARD\n" +
          "VERSION:3.0\n" +
          "N:;a,;;;\n" +
          "FN:" + senderName + "\n" +
          "item1.TEL;waid=" + m.sender.split('@')[0] + ":" + m.sender.split('@')[0] + "\n" +
          "item1.X-ABLabel:Ponsel\n" +
          "END:VCARD"
      }
    }
  };

  await conn.sendMessage(m.chat, {
    image: { url: upscaledUrl },
    caption: "*🍭╎تـفـضــل طـلـبــك˙⁠❥⁠*"
  }, { quoted });
};

async function upscaleImage(fileBuffer, filename, scale, type) {
  try {
    let username = crypto.randomBytes(8).toString("hex") + "_aiimglarger";
    let form = new FormData();
    form.append("type", type);
    form.append("username", username);
    form.append("scaleRadio", scale.toString());
    form.append("file", fileBuffer, { filename, contentType: "image/jpeg" });

    let uploadRes = await axios.post("https://photoai.imglarger.com/api/PhoAi/Upload", form, {
      headers: {
        ...form.getHeaders(),
        'User-Agent': "Dart/3.5 (dart:io)",
        'Accept-Encoding': "gzip"
      }
    });

    let code = uploadRes.data.data.code;
    let statusPayload = { code, type, username, scaleRadio: scale.toString() };

    for (let i = 0; i < 1000; i++) {
      let statusRes = await axios.post("https://photoai.imglarger.com/api/PhoAi/CheckStatus", statusPayload, {
        headers: {
          'User-Agent': "Dart/3.5 (dart:io)",
          'Content-Type': "application/json",
          'Accept-Encoding': "gzip"
        }
      });

      let statusData = statusRes.data.data;
      if (statusData.status === "success") return statusData.downloadUrls[0];
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    throw new Error("انتهت مهلة الانتظار لمعالجة الصورة");
  } catch (err) {
    console.error(err);
    return err;
  }
}

handler.help = ["img-large"];
handler.command = ["جوده", "جودة"];
handler.tags = ["tools"];

export default handler;