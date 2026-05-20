const express = require('express');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
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

const jobs = new Map();
const JOB_TTL_MS = 30 * 60 * 1000; // 30 minutes

app.post('/render', (req, res) => {
  const { html, audioBase64, filename } = req.body;
  if (!html || !filename) {
    return res.status(400).json({ error: 'html and filename are required' });
  }

  const taskId = crypto.randomUUID();
  const dir = path.join(os.tmpdir(), `render_${taskId}`);
  const outPath = path.join(dir, `${filename}.mp4`);

  fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  if (audioBase64) {
    fs.writeFileSync(path.join(dir, 'audio.mp3'), Buffer.from(audioBase64, 'base64'));
  }

  jobs.set(taskId, { status: 'processing' });
  console.log(`[${taskId}] render started — dir: ${dir}`);

  const proc = spawn(
    'npx',
    ['hyperframes', 'render', '--output', outPath, '--format', 'mp4', '--fps', '30'],
    { cwd: dir }
  );

  proc.stdout.on('data', (data) => {
    process.stdout.write(`[${taskId}] ${data}`);
  });

  proc.stderr.on('data', (data) => {
    process.stderr.write(`[${taskId}] ${data}`);
  });

  const timer = setTimeout(() => {
    console.error(`[${taskId}] TIMEOUT — killing process after 10 minutes`);
    proc.kill('SIGKILL');
    jobs.set(taskId, { status: 'failed', error: 'Render timed out after 10 minutes' });
    fs.rmSync(dir, { recursive: true, force: true });
    setTimeout(() => jobs.delete(taskId), JOB_TTL_MS);
  }, 600_000);

  proc.on('close', (code) => {
    clearTimeout(timer);
    console.log(`[${taskId}] process exited with code ${code}`);
    if (code !== 0) {
      jobs.set(taskId, { status: 'failed', error: `hyperframes exited with code ${code}` });
    } else {
      try {
        const videoBase64 = fs.readFileSync(outPath).toString('base64');
        console.log(`[${taskId}] done — video size: ${Math.round(videoBase64.length * 0.75 / 1024)}KB`);
        jobs.set(taskId, { status: 'done', videoBase64 });
      } catch (readErr) {
        console.error(`[${taskId}] failed to read output: ${readErr.message}`);
        jobs.set(taskId, { status: 'failed', error: readErr.message });
      }
    }
    fs.rmSync(dir, { recursive: true, force: true });
    setTimeout(() => jobs.delete(taskId), JOB_TTL_MS);
  });

  proc.on('error', (err) => {
    clearTimeout(timer);
    console.error(`[${taskId}] spawn error: ${err.message}`);
    jobs.set(taskId, { status: 'failed', error: err.message });
    fs.rmSync(dir, { recursive: true, force: true });
    setTimeout(() => jobs.delete(taskId), JOB_TTL_MS);
  });

  res.json({ taskId });
});

app.get('/tasks/:taskId', (req, res) => {
  const job = jobs.get(req.params.taskId);
  if (!job) return res.status(404).json({ error: 'Task not found or expired' });
  res.json(job);
});

app.listen(3000, () => console.log('render-svc listening on :3000'));
