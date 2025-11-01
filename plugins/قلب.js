import fetch from 'node-fetch';

let points = 50;
let maxPlayers;
let lastAnsweredBy;

const heartColors = ['💙', '💜', '💛', '💚', '❤️', '🤍', '🤎', '🖤'];

let handler = async (m, { conn, command, text }) => {
    let id = m.chat;
    conn.tekateki8 = conn.tekateki8 ? conn.tekateki8 : {};
    
    if (command === "مسابقه-قلب") {
        // بدء مسابقة جديدة
        if (id in conn.tekateki8) {
            await conn.reply(m.chat, 'المسابقه شغاله ينجم', conn.tekateki8[id][0]);
            return;
        }
        if (!text) {
            await conn.reply(m.chat, 'ادخل عدد اللاعبين', m);
            return;
        }
        if (isNaN(text)) {
            await conn.reply(m.chat, 'يرجى إدخال رقم لعدد اللاعبين', m);
            return;
        }
        if (text > 8 || text < 2) {
            await conn.reply(m.chat, 'الحد الأقصى للاعبين ثمانية, والحد الأدنى اثنين', m);
            return;
        }
        maxPlayers = parseInt(text);
        let initialHearts = Array(5).fill(heartColors[0]);
        conn.tekateki8[id] = [
            await conn.reply(m.chat, '1 - جاوب علي السوأل بسرعه\n2 - جمع  50 نقطه\n3 - اتبع التعليمات', m),
            [], // سيتم تخزين الأسئلة هنا
            [], // سيتم تخزين اللاعبين وقلوبهم هنا
            0, // عداد الأسئلة
            null, // lastAnsweredBy
            initialHearts // قلوب البداية لكل لاعب
        ];

        const joinCode = JSON.stringify({
            display_text: "🌸 انضمام 🌸",
            id: `.انضم-قلب`
        });

        const deleteCode = JSON.stringify({
            display_text: "🗑️ حذف-قلب",
            id: `.حذف-قلب`
        });

        const interactiveMessage = {
            body: { text: `*🎡| المسابقة بدأت اضغط علي. انضمام*` },
            footer: { text: `*مسابقه القلوب تتكون من خمس لاعبين يرسل بوت سؤال واول شخص يجاوب عليه يزيل قلب من خصومه ومن يصفر كل قلوب بقية لاعبين يربح*` },
            nativeFlowMessage: { 
                buttons: [
                    { name: "quick_reply", buttonParamsJson: joinCode },
                    { name: "quick_reply", buttonParamsJson: deleteCode }
                ]
            }
        };

        const message = { 
            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 }, 
            interactiveMessage 
        };

        await conn.relayMessage(m.chat, { viewOnceMessage: { message } }, {});

        return;
    }

    if (command === "انضم-قلب") {
        // الانضمام إلى المسابقة
        if (!(id in conn.tekateki8)) {
            await conn.reply(m.chat, 'لا يوجد مسابقة قائمة حالياً!', m);
            return;
        }
        if (conn.tekateki8[id][2].length >= maxPlayers) {
            await conn.reply(m.chat, 'اكتمل العدد', m);
            return;
        }
        if (conn.tekateki8[id][2].findIndex(player => player.id === m.sender) !== -1) {
            await conn.reply(m.chat, 'أنت مسجل بالفعل', m);
            return;
        }
        let playerHearts = Array(5).fill(heartColors[conn.tekateki8[id][2].length % heartColors.length]);
        conn.tekateki8[id][2].push({ id: m.sender, points: 0, hearts: playerHearts });
        await conn.reply(m.chat, 'تم التسجيل بنجاح!', m);

        // إذا كان عدد اللاعبين مكتملاً، أضف زر "بدء"
        if (conn.tekateki8[id][2].length === maxPlayers) {
            const startButtonCode = JSON.stringify({
                display_text: "بدء",
                id: `.بدء-قلب`
            });

            const startButton = {
                name: "quick_reply",
                buttonParamsJson: startButtonCode
            };

            const interactiveMessage = {
                body: { text: `🎡 المسابقة بدأت! اضغط على زر "بدء" لبدء اللعبة.` },
                footer: { text: `مسابقة القلوب تتكون من خمس لاعبين يرسل بوت سؤال واول شخص يجاوب عليه يزيل قلب من خصومه ومن يصفر كل قلوب بقية لاعبين يربح.` },
                nativeFlowMessage: { buttons: [startButton] }
            };

            const message = { messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 }, interactiveMessage };

            await conn.relayMessage(m.chat, { viewOnceMessage: { message } }, {});
        }

        return;
    }

    if (command === "بدء-قلب") {
        // بدء المسابقة
        if (!(id in conn.tekateki8)) {
            await conn.reply(m.chat, 'لا يوجد مسابقة قائمة حالياً!', m);
            return;
        }
        if (conn.tekateki8[id][2].length < maxPlayers) {
            await conn.reply(m.chat, 'لم يتم تسجيل عدد كافٍ من اللاعبين بعد!', m);
            return;
        }
        let tekateki8 = await (await fetch(`https://raw.githubusercontent.com/Afghhjjkoo/GURU-BOT/main/src/Kt.json`)).json();
        let json = tekateki8[Math.floor(Math.random() * tekateki8.length)];
        conn.tekateki8[id][1] = json;
        conn.tekateki8[id][4] = null; // تصفير متغير lastAnsweredBy عند بدء اللعبة
        let question = `السؤال: ${json.question}`;
        await conn.reply(m.chat, question, m);
        return;
    }

    if (command === "حذف-قلب") {
        // حذف المسابقة
        if (!conn.tekateki8[id]) {
            await conn.reply(m.chat, 'لـم تـبـدأ الـمـبـاره بـعـد', m);
            return;
        }
        delete conn.tekateki8[id];
        await conn.reply(m.chat, 'تـم حـذف الـلـعـبـه بـنـجـاح', m);
        return;
    }

    if (command === "سكب-قلب") {
        // تخطي السؤال
        if (!(id in conn.tekateki8) || conn.tekateki8[id][2].length === 0) {
            await conn.reply(m.chat, 'لا يوجد مسابقة قائمة حالياً!', m);
            return;
        }

        // عرض الإجابة الصحيحة
        let correctAnswer = conn.tekateki8[id][1].response;
        await conn.reply(m.chat, `الاجابة الصحيحه هي: ${correctAnswer}`, m);

        // جلب سؤال جديد وتحديث قائمة اللاعبين
        let tekateki8 = await (await fetch(`https://raw.githubusercontent.com/Afghhjjkoo/GURU-BOT/main/src/Kt.json`)).json();
        let json = tekateki8[Math.floor(Math.random() * tekateki8.length)];
        conn.tekateki8[id][1] = json;
        let playersList = conn.tekateki8[id][2].map((player, i) => `${i + 1} - @${player.id.split('@')[0]} [${player.hearts.join(' ')}]`).join('\n');
        let question = `السؤال: ${json.question}`;
        await conn.reply(m.chat, question, m);
        return;
    }

    if (command === "انسحب-قلب") {
        // الانسحاب من المسابقة
        if (!(id in conn.tekateki8)) {
            await conn.reply(m.chat, 'لا يوجد مسابقة قائمة حالياً!', m);
            return;
        }

        let playerIndex = conn.tekateki8[id][2].findIndex(player => player.id === m.sender);
        if (playerIndex === -1) {
            await conn.reply(m.chat, 'أنت لست مسجلاً في المسابقة!', m);
            return;
        }

        conn.tekateki8[id][2].splice(playerIndex, 1);
        await conn.reply(m.chat, 'تم انسحابك من المسابقة بنجاح!', m);

        if (conn.tekateki8[id][2].length < 2) {
            await conn.reply(m.chat, 'تم إلغاء المسابقة لعدم وجود لاعبين كافيين.', m);
            delete conn.tekateki8[id];
        }

        return;
    }

    // ... باقي الكود ...
};

handler.before = async function (m, { conn }) {
    let id = m.chat;
    this.tekateki8 = this.tekateki8 ? this.tekateki8 : {};
    if (!(id in this.tekateki8)) return;

    let json = this.tekateki8[id][1];
    let players = this.tekateki8[id][2];
    let questionCount = this.tekateki8[id][3];

    // التحقق من الإجابة الصحيحة
    if (json && json.response && m.text.toLowerCase() === json.response.toLowerCase()) {
        if (!this.tekateki8[id][4]) { // إذا لم يكن هناك مجاوب سابق
            let playerIndex = players.findIndex(player => player.id === m.sender);
            players[playerIndex].points += points; // إضافة النقاط للمجاوب
            questionCount++;
            this.tekateki8[id][4] = m.sender; // تحديث المتغير بمعرف اللاعب الذي أجاب بشكل صحيح

            // إعلان الفائز إذا تبقى لاعب واحد فقط بقلوب
            let remainingPlayers = players.filter(player => player.hearts.length > 0);
            if (remainingPlayers.length === 1) {
                let winner = remainingPlayers[0];
                conn.reply(m.chat, `المسابقة انتهت! الفائز هو @${winner.id.split('@')[0]} بـ ${winner.points} نقطة و ${winner.hearts.length} قلوب.`, m, { mentions: [winner.id] });
                delete this.tekateki8[id];
            } else {
                // إعلان الإجابة الصحيحة وطلب الاستبعاد
                let playersList = players.map((player, i) => `${i + 1} - @${player.id.split('@')[0]} [${player.hearts.join(' ')}]`).join('\n');
                conn.reply(m.chat, `@${m.sender.split('@')[0]} أجاب بشكل صحيح! يمكنه الآن إزالة قلب من لاعب آخر عن طريق كتابة "#" متبوعًا برقم ترتيب اللاعب.\n\nاللاعبون المتبقون:\n\n${playersList}`, m, { mentions: conn.parseMention(playersList) });
            }
        }
    } else if (!isNaN(m.text) && players.length > 1 && m.sender === this.tekateki8[id][4]) {
        let playerIndex = parseInt(m.text) - 1;
        if (playerIndex >= 0 && playerIndex < players.length && playerIndex !== players.findIndex(player => player.id === m.sender)) {
            let targetPlayer = players[playerIndex];
            if (targetPlayer.hearts.length > 0) {
                targetPlayer.hearts.pop();
            }
            if (targetPlayer.hearts.length === 0) {
                players.splice(playerIndex, 1);
                conn.reply(m.chat, `تم استبعاد اللاعب رقم ${playerIndex + 1}.`, m);
            } else {
                conn.reply(m.chat, `تم إزالة قلب من اللاعب رقم ${playerIndex + 1}. لديه الآن ${targetPlayer.hearts.length} قلوب.`, m);
            }
            // إعادة تعيين lastAnsweredBy إذا كان اللاعب المستبعد هو آخر من أجاب
            if (this.tekateki8[id][4] === targetPlayer.id) {
                this.tekateki8[id][4] = null;
            }
            // إرسال سؤال جديد بعد كل استبعاد
            let newTekateki8 = await (await fetch(`https://raw.githubusercontent.com/Afghhjjkoo/GURU-BOT/main/src/Kt.json`)).json();
            let newJson = newTekateki8[Math.floor(Math.random() * newTekateki8.length)];
            this.tekateki8[id][1] = newJson;
            let newQuestion = `السؤال: ${newJson.question}`;
            await conn.reply(m.chat, newQuestion, m);
            this.tekateki8[id][3]++; // زيادة عداد الأسئلة
            this.tekateki8[id][4] = null; // تصفير متغير lastAnsweredBy للسماح بإجابة السؤال الجديد
        } else {
            conn.reply(m.chat, 'انت لست المجاوب أو حاولت استبعاد نفسك', m);
        }
    }
};

handler.command = /^(مسابقه-قلب|انضم-قلب|حذف-قلب|بدء-قلب|سكب-قلب|انسحب-قلب)$/i;

export default handler;