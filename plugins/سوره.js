import fetch from 'node-fetch';

let quranSurahHandler = async (m, { conn }) => {
  try {
    // Extract the surah number or name from the command text.
    let surahInput = m.text.split(' ')[1];

    if (!surahInput) {
      throw new Error(`*اكتب الأمر بجانبه رقم السورة او اسمها ❓*`);
    }

    let surahListRes = await fetch('https://quran-endpoint.vercel.app/quran');
    let surahList = await surahListRes.json();

    let surahData = surahList.data.find(surah => 
        surah.number === Number(surahInput) || 
        surah.asma.ar.short.toLowerCase() === surahInput.toLowerCase() || 
        surah.asma.en.short.toLowerCase() === surahInput.toLowerCase()
    );

    if (!surahData) {
      throw new Error(`لا يمكن إيجاد سورة "${surahInput}"`);
    }

    let res = await fetch(`https://quran-endpoint.vercel.app/quran/${surahData.number}`);

    if (!res.ok) {
      let error = await res.json(); 
      throw new Error(`API request failed with status ${res.status} and message ${error.message}`);
    }

    let json = await res.json();

    let quranSurah = `
🕋 *القرآن الكريم* 🕋\n
🕌 ¦ *معلومات عن السورة :*
    *• اسمها بالعربية : ${json.data.asma.ar.long}* 
    *• ترتيبها في القرآن : ${json.data.number}*\n
📜 ¦ *نزلت بـ* : *${json.data.type.ar}*
🩶 | *عدد آياتها* : ${json.data.ayahCount}`;

    m.reply(quranSurah);

    if (json.data.recitation.full) {
      conn.sendFile(m.chat, json.data.recitation.full, 'recitation.mp3', null, m, true, { type: 'audioMessage', ptt: true });
    }
  } catch (error) {
    console.error(error);
    m.reply(`Error: ${error.message}`);
  }
};

quranSurahHandler.help = ['quran [surah_number|surah_name]'];
quranSurahHandler.tags = ['quran', 'surah'];
quranSurahHandler.command = ['سوره']

export default quranSurahHandler;