import axios from 'axios';
import { proto, generateWAMessageFromContent, generateWAMessageContent } from "@whiskeysockets/baileys";

let handler = async (message, { conn, text, command, usedPrefix }) => {
    if (!text) {
        return conn.reply(
            message.chat,
            `*- 「🚩」 ارسل رابط فيديو من tiktokimg*\n*~⬤⚡╎مثال ↧~*\n*${usedPrefix + command} https://vt.tiktok.com/ZSBrRuWTh/*`,
            message
        );
    }

    async function prepareImage(url) {
        const imageObject = { image: { url } };
        const waOptions = { upload: conn.waUploadToServer };
        const { imageMessage } = await generateWAMessageContent(imageObject, waOptions);
        return imageMessage;
    }

    try {
        await conn.sendMessage(message.chat, {
            react: { text: '⏳', key: message.key }
        });

        const { data } = await axios.get(`https://api.obito-sar.store/api/download/tiktokimg?url=${encodeURIComponent(text)}`);
        const images = data.obitosar?.images || [];
        const audioUrl = data.obitosar?.audio?.download;

        if (!images.length) throw new Error("لم يتم العثور على صور في الفيديو.");

        let carouselCards = [];
        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            carouselCards.push({
                body: proto.Message.InteractiveMessage.Body.fromObject({ text: null }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: "> ShadowBot" }),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: `⌠ الصورة رقم ${i + 1} ┊🖼️ ⌡`,
                    hasMediaAttachment: true,
                    imageMessage: await prepareImage(img.download_url)
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons: [] })
            });
        }

        const messageContent = generateWAMessageFromContent(
            message.chat,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                            body: proto.Message.InteractiveMessage.Body.create({ text: "🍷╎  تم التنزيل بنجاح" }),
                            footer: proto.Message.InteractiveMessage.Footer.create({ text: "> ShadowBot" }),
                            header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
                            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards: carouselCards })
                        })
                    }
                }
            },
            { quoted: message }
        );

        await conn.relayMessage(message.chat, messageContent.message, { messageId: messageContent.key.id });

        if (audioUrl) {
            await conn.sendMessage(
                message.chat,
                { audio: { url: audioUrl }, mimetype: "audio/mp4", ptt: true },
                { quoted: message }
            );
        }

        await conn.sendMessage(message.chat, { react: { text: '✅', key: message.key } });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(message.chat, { react: { text: '❌', key: message.key } });
    }
};

handler.help = ["tiktokimg"];
handler.tags = ["downloader"];
handler.command = /^(صورتيك)$/i;

export default handler;
