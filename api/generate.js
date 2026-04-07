export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const apiKey = req.headers['authorization'];
  const response = await fetch('https://api.apimart.ai/v1/videos/generations', {
    method: 'POST',
    headers: { 'Authorization': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });

  const result = await response.json();
  res.status(response.status).json(result);
}
