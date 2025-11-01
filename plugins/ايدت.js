import fetch from 'node-fetch';
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const dir = [
    'https://telegra.ph/file/5f55b1eb6e28985dc8609.mp4',
    'https://telegra.ph/file/1267f15b697632ed6f6da.mp4',
    'https://telegra.ph/file/27142efbb014593882921.mp4',
    'https://telegra.ph/file/2af0c5875707cd318f68b.mp4',
    'https://telegra.ph/file/92a48810a6fa076c05659.mp4',
    'https://telegra.ph/file/42011356c4b2e275b23d1.mp4',
    'https://telegra.ph/file/b4774eed9a2b9a5312cd0.mp4',
    'https://telegra.ph/file/f01a4a0b687fe685668c2.mp4',
    'https://telegra.ph/file/d5ead2dd31eb1ec56786f.mp4',
'https://telegra.ph/file/fd62a65117bf2d796cdbd.mp4', 'https://telegra.ph/file/fbe8b6804e2a74aaa3947.mp4',
    'https://telegra.ph/file/3bceaa9f07670df020480.mp4',
    'https://telegra.ph/file/2aecfdad166219922b8e6.mp4',
];

let handler = async (m, { conn }) => {
    const name = conn.getName(m.sender);
    const videoUrl = pickRandom(dir);
    const tagUser = '@' + m.sender.split("@s.whatsapp.net")[0];
    const more = String.fromCharCode(8206);
    const teks = `${pickRandom([`🍷╎ Shadow Bot`])}`.trim();

    const media = await prepareWAMessageMedia({ video: { url: videoUrl } }, { upload: conn.waUploadToServer });

    const interactiveMessage = {
        body: { text: teks },
        header: {
            hasMediaAttachment: true,
            videoMessage: media.videoMessage,
        },
        nativeFlowMessage: {
            buttons: [
                {
                    "name": "quick_reply",
                    "buttonParamsJson": `{"display_text":"التالي","id":".edit"}`,
                },
                {
                    "name": "cta_url",
                    "buttonParamsJson": `{"display_text":"⌗ SHADOW ⋮ サポート","url":"https://whatsapp.com/channel/0029VbB0faVKLaHuzgBCR83H","merchant_url":"https://whatsapp.com/channel/0029VbB0faVKLaHuzgBCR83H"}`
                }
            ],
            messageParamsJson: ''
        }
    };

    let msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage,
            },
        },
    }, { userJid: conn.user.jid, quoted: m });

    conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
};

handler.command = ['ايديت', 'ايدت'];

export default handler;

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}