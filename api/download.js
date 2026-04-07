export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { url } = req.query;
  if (!url) { res.status(400).send('Missing url parameter'); return; }

  try {
    const decoded = decodeURIComponent(url);
    const response = await fetch(decoded);
    if (!response.ok) { res.status(response.status).send('Failed to fetch video'); return; }

    const contentType = response.headers.get('content-type') || 'video/mp4';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
    res.setHeader('Cache-Control', 'no-store');

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (e) {
    res.status(500).send('Download error: ' + e.message);
  }
}
