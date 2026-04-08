// VEO 操作轮询代理
// 兼容 Vertex AI 风格 operation name: operations/xxx 或 projects/.../operations/xxx
// GET https://newapi.nfvid.vip/v1beta/{operation}?key=xxx
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  try {
    const { operation, key } = req.query;
    if (!operation || !key) {
      res.status(400).json({ error: 'Missing operation or key' });
      return;
    }
    // operation 可能为 "operations/xxx"，直接拼接到 /v1beta/ 后面
    // 去掉开头的斜线（如果有）
    const opPath = operation.replace(/^\//, '');
    const url = `https://newapi.nfvid.vip/v1beta/${opPath}?key=${encodeURIComponent(key)}`;
    const response = await fetch(url);
    const result = await response.json();
    res.status(response.status).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
