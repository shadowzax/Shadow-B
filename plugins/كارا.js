import fetch from 'node-fetch'
import uploadImage from '../lib/uploadImage.js'

let handler = async (m, { text, conn }) => {
  if (!text && !(m.quoted && m.quoted.text)) {
    throw `
*❆━━━═⏣⊰🌸⊱⏣═━━━❆*

🌸⤺┇ استخدام خاطئ، يرجى الرد على رسالة تحتوي على نص.

*❆━━━═⏣⊰🌸⊱⏣═━━━❆*
`.trim()
  }

  try {
    let imageUrl = ''
    let quoted = m.quoted ? m.quoted : m
    let mime = (quoted.msg || quoted).mimetype || quoted.mediaType || ''

    if (mime && mime.startsWith('video/')) {
      return conn.sendMessage(m.chat, { text: `
*❆━━━═⏣⊰🌸⊱⏣═━━━❆*

🌸⤺┇ يرجى الرد على صورة، لا فيديو!

*❆━━━═⏣⊰🌸⊱⏣═━━━❆*
`.trim() }, { quoted: m })
    }

    if (mime && /image\/(png|jpe?g|gif)/.test(mime)) {
      let media = await quoted.download()
      imageUrl = await uploadImage(media)
    }

    let prompt = text || quoted.text || ''
    let apiUrl = imageUrl
      ? `https://api-streamline.vercel.app/gemini?prompt=${encodeURIComponent(prompt)}&img=${imageUrl}`
      : `https://api-streamline.vercel.app/gemini?prompt=${encodeURIComponent(prompt)}`

    conn.sendPresenceUpdate('composing', m.chat)
    conn.sendMessage(m.chat, { text: '⏳ جاري الكتابة...' }, { quoted: m })

    const response = await fetch(apiUrl)
    const result = await response.json()
    const replyText = (result && result.text) ? result.text.trim() : `
*❆━━━═⏣⊰🌸⊱⏣═━━━❆*

🌸⤺┇ لم يتم العثور على نتيجة صحيحة، يرجى المحاولة لاحقاً.

*❆━━━═⏣⊰🌸⊱⏣═━━━❆*
`.trim()

    conn.sendMessage(m.chat, { text: replyText }, { quoted: m })
  } catch (err) {
    console.log('Error:', err)
    conn.sendMessage(m.chat, { text: `
*❆━━━═⏣⊰🌸⊱⏣═━━━❆*

🌸⤺┇ حدث خطأ أثناء المعالجة، يرجى المحاولة لاحقاً.

*❆━━━═⏣⊰🌸⊱⏣═━━━❆*
`.trim() }, { quoted: m })
  }
}

handler.help = ['googlegenai']
handler.tags = ['AI']
handler.command = ['الوكارد', 'googlegenai', 'الاكارا', 'الكارا', 'كارا']

export default handler
