// VEO 系列生成代理（首尾帧 & 多参考图）
// POST /v1beta/models/{model}:generateContent?key=xxx
// → https://newapi.nfvid.vip/v1beta/models/{model}:generateContent?key=xxx
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  try {
    const { model, key } = req.query;
    if (!model || !key) {
      res.status(400).json({ error: 'Missing model or key' });
      return;
    }
    // model 只传 identifier，本proxy 拼 :generateContent
    const url = `https://newapi.nfvid.vip/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const result = await response.json();
    res.status(response.status).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
