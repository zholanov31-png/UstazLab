export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Тек POST сұранысы қабылданады' });
    }
  
    try {
      const { prompt } = req.body;
      const apiKey = process.env.GEMINI_API_KEY; // Vercel-дегі кілт
  
      if (!apiKey) {
        return res.status(500).json({ error: 'API кілт табылмады' });
      }
  
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
  
      const data = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        const aiText = data.candidates[0].content.parts[0].text;
        return res.status(200).json({ text: aiText });
      } else {
        return res.status(500).json({ error: 'AI жауап бермеді', details: data });
      }
  
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }