let handler = async (m, { conn, text, participants }) => { 
let member = participants.map(u => u.id) 
if(!text) { 
var sum = member.length 
} else { 
var sum = text} 
var total = 0 
var sider = [] 
for(let i = 0; i < sum; i++) {
let users = m.isGroup ? participants.find(u => u.id == member[i]) : {}
if((typeof global.db.data.users[member[i]] == 'undefined' || global.db.data.users[member[i]].chat == 0) && !users.isAdmin && !users.isSuperAdmin) { 
if (typeof global.db.data.users[member[i]] !== 'undefined'){
if(global.db.data.users[member[i]].whitelist == false){
total++ 
sider.push(member[i])} 
}else { 
total++ 
sider.push(member[i])}}}
if(total == 0) return conn.reply(m.chat, `*[⚡]⌯ لا يوجد هنا اعضاء غير متفاعلين*`, m)  
const shadow = `⋅‏ ┈──── • ◞☆◜ • ────┈ ⋅
⪦ ⌊ ❁╎الـجـروب╎${await conn.getName(m.chat)}⌉
⪦ ⌊ ❁╎عـدد الاعـضـاء╎${sum}⌉
⋅‏ ┈──── • ◞☆◜ • ────┈ ⋅
${sider.map(v => '  ◯🧁╎ @' + v.replace(/@.+/, '')).join('\n')}
⋅‏ ┈──── • ◞☆◜ • ────┈ ⋅
❁╎تـفـاعـلـوا وهـديـكـوا شـوكـولـاتـه╎🍫⌉`
  conn.sendMessage(m.chat,{ caption : shadow , mentions: [...shadow.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')}, { quoted: m })
    return conn.sendMessage(m.chat, {
            react: {
              text: '⚡',
              key: m.key,
            }})
  }
handler.command = /^(الاصنام|الاشباح)$/i // S H A D O W
handler.admin = true 
handler.botAdmin = true 
export default handler