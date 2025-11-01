import fs from 'fs';

let handler = async (m, { usedPrefix, command, text }) => {
    let menu = `بك في أزرار التحكم بلبوت`.trim();

    const interactiveMessage = {
        body: { text: menu },
        footer: {
            text: `*اقـرأ تـعـلـيـمـات:*
*🍷╎  اقـفـل: البوت يعمل مع مشرفين فقط*
*🍷╎  افـتـح: البوت يعمل مع الاعضاء والمشرفين*
`
        },
        header: { title: `اهلا`, subtitle: "test4", hasMediaAttachment: false },
        nativeFlowMessage: {
            buttons: [
                {
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({
                        display_text: 'أقـفـل الـبـوت',
                        id: usedPrefix + 'افتح الادمن-فقط'
                    })
                },
                {
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({
                        display_text: 'افـتـح الـبـوت',
                        id: usedPrefix + 'اقفل الادمن-فقط'
                    })
                },
                {
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({
                        display_text: 'افـتـح مـضـاد الـشـتـائـم',
                        id: usedPrefix + 'افتح مضادالشتائم'
                    })
                },
                {
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({
                        display_text: 'اقـفـل مـضـاد الـشـتـائم',
                        id: usedPrefix + 'اقفل مضادالشتائم'
                    })
                }
            ]
        }
    };

    const message = { messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 }, interactiveMessage };
    await conn.relayMessage(m.chat, { viewOnceMessage: { message } }, {});
};

handler.help = ['getplugin'].map(v => v + ' <teks>');
handler.tags = ['host'];
handler.command = /^(تحكم|التحكم)$/i;

export default handler;