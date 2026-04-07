export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const apiKey = req.headers['authorization'];
  const contentType = req.headers['content-type']; // ← 추가: multipart boundary 포함
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks);

  const response = await fetch('https://api.apimart.ai/v1/uploads/images', {
    method: 'POST',
    headers: {
      'Authorization': apiKey,
      'Content-Type': contentType,  // ← 수정: boundary 포함한 Content-Type 전달
    },
    body: body,
    duplex: 'half'
  });

  const resContentType = response.headers.get('content-type');
  const result = await response.text();
  res.setHeader('Content-Type', resContentType || 'application/json');
  res.status(response.status).send(result);
}
