// Sora-2 视频生成代理
// POST /v1/videos → https://newapi.nfvid.vip/v1/videos
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  try {
    const raw = (req.headers['authorization'] || '').replace(/^Bearer\s+/i, '');
    const apiKey = raw || req.query.key || '';
    const response = await fetch('https://newapi.nfvid.vip/v1/videos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const result = await response.json();
    res.status(response.status).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
