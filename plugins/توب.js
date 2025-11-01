import util from 'util'
import path from 'path'

let user = a => '@' + a.split('@')[0]

function handler(m, { groupMetadata, command, conn, text, usedPrefix}) {
    if (!text) throw `غلط يحب نسيت النص مثال:\n.توب متفاعلين`
    
    let participants = groupMetadata.participants.map(v => v.id)
    
    // التأكد من وجود عدد كافٍ من الأعضاء
    if (participants.length < 10) {
        throw `المجموعة فيها ${participants.length} أعضاء فقط، محتاج 10 عالأقل!`
    }
    
    // اختيار 10 أعضاء عشوائيين بدون تكرار
    let shuffled = [...participants].sort(() => 0.5 - Math.random())
    let selected = shuffled.slice(0, 10)
    
    let [a, b, c, d, e, f, g, h, i, j] = selected
    
    let k = Math.floor(Math.random() * 70);
    let x = pickRandom(['🤓','😅','😂','😳','😎', '💫', '😱', '🤑', '🙄', '🤍','✨','🤨','🥴','🔥','👇🏻','😔', '👀','🌚'])
    
    let top = `*${x} توب 10 ${text} ${x}*

*1. ${user(a)}.*
*2. ${user(b)}.*
*3. ${user(c)}.*
*4. ${user(d)}.*
*5. ${user(e)}.*
*6. ${user(f)}.*
*7. ${user(g)}.*
*8. ${user(h)}.*
*9. ${user(i)}.*
*10. ${user(j)}.*`

    // إرسال الرسالة مع المنشنات
    conn.sendMessage(m.chat, { 
        text: top,
        mentions: selected
    }, { quoted: m })
    
    // إرسال الصوت
    let vn = `https://hansxd.nasihosting.com/sound/sound${k}.mp3`
    conn.sendFile(m.chat, vn, 'error.mp3', '', m, true, {
        type: 'audioMessage',
        ptt: true 
    })
}

handler.help = handler.command = ['توب']
handler.tags = ['fun']
handler.group = true
handler.limit = 6

export default handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}
