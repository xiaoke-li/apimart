// VEO 系列生成代理（首尾帧 & 多参考图）
// maxDuration: Vercel Pro 可用 60s，Hobby 仍是 10s（填了也无害）
// bodyParser sizeLimit: 防止大图片超出 Vercel 默认 4.5MB 限制

export const config = {
  maxDuration: 60,
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

    // 给上游请求设 55s 超时，确保在 Vercel 杀进程前能返回一个错误
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 55000);

    let response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
        signal: controller.signal,
      });
    } catch (fetchErr) {
      clearTimeout(timer);
      const msg = fetchErr.name === 'AbortError'
        ? 'VEO API 响应超时（>55s），请稍后重试'
        : fetchErr.message;
      res.status(504).json({ error: msg });
      return;
    }
    clearTimeout(timer);

    // 安全解析：上游偶尔返回纯文本错误（如 413 / 502）
    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch (_) {
      result = { error: text.slice(0, 300) };
    }

    res.status(response.status).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
