// Sora-2 任务状态轮询代理
// GET /v1/videos/{task_id} → https://newapi.nfvid.vip/v1/videos/{id}
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  try {
    const { id } = req.query;
    if (!id) { res.status(400).json({ error: 'Missing id' }); return; }
    const apiKey = (req.headers['authorization'] || '').replace(/^Bearer\s+/i, '');
    const response = await fetch(`https://newapi.nfvid.vip/v1/videos/${encodeURIComponent(id)}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    const result = await response.json();
    res.status(response.status).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
