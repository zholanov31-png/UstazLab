export default async function handler(req, res) {
    // CORS рұқсаттарын қосу
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
  
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
  
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const { prompt } = req.body;
  
      // Мұнда генерация логикасы немесе API сұраныстары орындалады
      // Мысал ретінде қайтарылатын жауап:
      return res.status(200).json({ 
        success: true, 
        message: "Сәтті өңделді!", 
        result: `Алынған сұраныс бойынша жауап: ${prompt || 'Бос емес'}` 
      });
  
    } catch (error) {
      console.error('API Error:', error);
      return res.status(500).json({ error: 'Серверде қате орын алды' });
    }
  }