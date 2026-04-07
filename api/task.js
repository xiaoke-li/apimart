export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { id } = req.query;
  const apiKey = req.headers['authorization'];
  const response = await fetch(`https://api.apimart.ai/v1/tasks/${id}?language=zh`, {
    headers: { 'Authorization': apiKey }
  });

  const result = await response.json();
  res.status(response.status).json(result);
}
