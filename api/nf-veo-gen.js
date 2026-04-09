// 标准 Node.js 代理：VEO generateContent（解决 CORS）
// maxDuration 在 vercel.json 里设置

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST')    { res.status(405).json({ error: 'Method not allowed' }); return; }

  const { model, key } = req.query;
  if (!model || !key) {
    res.status(400).json({ error: 'Missing model or key' });
    return;
  }

  try {
    const url = `https://newapi.nfvid.vip/v1beta/models/${model}:generateContent?key=${key}`;

    // 拼接请求体
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks).toString();

    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    const data = await upstream.text();
    res.status(upstream.status)
       .setHeader('Content-Type', upstream.headers.get('Content-Type') || 'application/json')
       .send(data);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
