import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { plaka, isim } = req.query;

  if (!plaka && !isim) {
    return res.status(400).json({ error: "Lütfen 'plaka' veya 'isim' parametresi girin. Örnek: ?plaka=34ABC123" });
  }

  try {
    const filePath = path.join(process.cwd(), 'plaka_data.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const plakaData = JSON.parse(fileData);

    let results = [];

    if (plaka) {
      const searchPlaka = plaka.replace(/\s+/g, '').toUpperCase();
      results = plakaData.filter(item => item.plaka === searchPlaka);
    } else if (isim) {
      const searchIsim = isim.toLowerCase();
      results = plakaData.filter(item => item.ad_soyad.includes(searchIsim));
    }

    if (results.length > 0) {
      return res.status(200).json(results);
    } else {
      return res.status(404).json({ message: "Kayıt bulunamadı." });
    }
  } catch (error) {
    return res.status(500).json({ error: "Sunucu hatası: Veri okunamadı." });
  }
}
