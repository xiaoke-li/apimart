// VEO 系列生成代理（首尾帧 & 多参考图）
// 增大 body 限制至 20MB，防止两张图片的 base64 超出默认 4.5MB

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

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
    const url = `https://newapi.nfvid.vip/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    // 安全解析：上游偶尔返回纯文本错误（如 413 / 502），需先转 text 再 JSON
    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch (_) {
      // 上游返回了非 JSON（截取前 300 字符防止超长）
      result = { error: text.slice(0, 300) };
    }

    res.status(response.status).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
