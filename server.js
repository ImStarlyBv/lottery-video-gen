const express = require('express');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');
const crypto = require('crypto');

const API_KEY = process.env.RENDER_API_KEY;
if (!API_KEY) throw new Error('RENDER_API_KEY env var is required');

const app = express();
app.use(express.json({ limit: '50mb' }));

app.use((req, res, next) => {
  if (req.headers['x-api-key'] !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

app.post('/render', (req, res) => {
  const { html, audioBase64, filename } = req.body;
  const dir = path.join(os.tmpdir(), `render_${crypto.randomUUID()}`);

  try {
    fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
    fs.writeFileSync(path.join(dir, 'audio.mp3'), Buffer.from(audioBase64, 'base64'));

    const outPath = path.join(dir, `${filename}.mp4`);
    execSync(`npx hyperframes render --output ${outPath} --format mp4 --fps 30`, {
      cwd: dir,
      timeout: 300_000,
    });

    const videoBase64 = fs.readFileSync(outPath).toString('base64');
    res.json({ videoBase64 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

app.listen(3000, () => console.log('render-svc listening on :3000'));
