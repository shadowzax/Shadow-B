import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { text, conn, participants, usedPrefix, command }) => {

  const groups = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats);

  const totalGroups = groups.length;

  const rows = await Promise.all(groups.map(async ([jid]) => {

    const groupMetadata = (conn.chats[jid]?.metadata || await conn.groupMetadata(jid).catch(() => ({}))) || {};

    const participants = groupMetadata.participants || [];

    const bot = participants.find((u) => conn.decodeJid(u.id) === conn.user.jid) || {};

    const isBotAdmin = bot?.admin || false;

    const totalParticipants = participants.length;

    return createGroupRows(conn, jid, isBotAdmin, totalParticipants, usedPrefix, command);

  }));

  const msg = await createInteractiveMessage(m, conn, totalGroups, rows);

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

};

handler.help = ['groups', 'grouplist'];

handler.tags = ['info'];

handler.command = ['الجروبات'];

handler.owner = true;

export default handler;

const createGroupRows = async (conn, jid, isBotAdmin, totalParticipants, usedPrefix, command) => {

  const groupName = await conn.getName(jid);

  return {

    header: `مجموعة: ${groupName}`,

    title: `البوت ادمن: ${isBotAdmin ? 'نعم' : 'لا'} - المشاركين: ${totalParticipants}`,

    description: 'قائمة خيارات المجموعة',

    id: `${usedPrefix + command} ${jid}`

  };

};

const createInteractiveMessage = async (m, conn, totalGroups, rows) => {

  const imgUrl = 'https://files.catbox.moe/icnjcp.jpg';

  const mediaMessage = await prepareWAMessageMedia({ image: { url: imgUrl } }, { upload: conn.waUploadToServer });

  const caption = `قائمة المجموعات المشارك بها البوت\nالعدد: ${totalGroups}`;

  const wm = "Shadow Bot"; 

  return generateWAMessageFromContent(m.chat, {

    viewOnceMessage: {

      message: {

        interactiveMessage: {

          body: { text: caption },

          footer: { text: wm },

          header: {

            hasMediaAttachment: true,

            imageMessage: mediaMessage.imageMessage

          },

          nativeFlowMessage: {

            buttons: [

              {

                name: 'single_select',

                buttonParamsJson: JSON.stringify({

                  title: 'قــائــمــة المجـموعـات',

                  sections: [

                    {

                      title: '「 المجـموعـات 」',

                      highlight_label: '🗃️',

                      rows: rows

                    }

                  ]

                })

              }

            ]

          }

        }

      }

    }

  }, { userJid: conn.user.jid, quoted: m });

};