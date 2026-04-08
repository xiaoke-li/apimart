// Sora-2 视频内容下载代理（需要 Bearer 认证）
// GET /v1/videos/{task_id}/content → https://newapi.nfvid.vip/v1/videos/{id}/content
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  try {
    const { id } = req.query;
    if (!id) { res.status(400).send('Missing id'); return; }
    const apiKey = (req.headers['authorization'] || '').replace(/^Bearer\s+/i, '');
    const response = await fetch(
      `https://newapi.nfvid.vip/v1/videos/${encodeURIComponent(id)}/content`,
      { headers: { 'Authorization': `Bearer ${apiKey}` } }
    );
    if (!response.ok) {
      res.status(response.status).send(`Upstream error: ${response.status}`);
      return;
    }
    const contentType = response.headers.get('content-type') || 'video/mp4';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', 'attachment; filename="sora-video.mp4"');
    res.setHeader('Cache-Control', 'no-store');
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (e) {
    res.status(500).send('Content proxy error: ' + e.message);
  }
}
