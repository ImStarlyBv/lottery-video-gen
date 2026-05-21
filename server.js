const express = require('express');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const os = require('os');
const crypto = require('crypto');

const API_KEY = process.env.RENDER_API_KEY;
if (!API_KEY) throw new Error('RENDER_API_KEY env var is required');

const app = express();
app.use(express.json({ limit: '500mb' }));

app.use((req, res, next) => {
  if (req.headers['x-api-key'] !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

// Persist job state to disk so it survives container restarts
const JOBS_DIR = path.join(os.tmpdir(), 'hf-jobs');
fs.mkdirSync(JOBS_DIR, { recursive: true });

const JOB_TTL_MS = 30 * 60 * 1000; // 30 minutes

function statusPath(taskId) { return path.join(JOBS_DIR, `${taskId}.json`); }
function videoPath(taskId)  { return path.join(JOBS_DIR, `${taskId}.mp4`); }

function writeStatus(taskId, data) {
  fs.writeFileSync(statusPath(taskId), JSON.stringify(data));
}

function readStatus(taskId) {
  const p = statusPath(taskId);
  if (!fs.existsSync(p)) return null;
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
}

function scheduleCleanup(taskId) {
  setTimeout(() => {
    try { fs.unlinkSync(statusPath(taskId)); } catch {}
    try { fs.unlinkSync(videoPath(taskId)); } catch {}
    console.log(`[${taskId}] job files cleaned up`);
  }, JOB_TTL_MS);
}

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

  writeStatus(taskId, { status: 'processing' });
  console.log(`[${taskId}] render started — dir: ${dir}`);

  const proc = spawn(
    'npx',
    ['hyperframes', 'render', '--output', outPath, '--format', 'mp4', '--fps', '30'],
    { cwd: dir }
  );

  proc.stdout.on('data', (data) => process.stdout.write(`[${taskId}] ${data}`));
  proc.stderr.on('data', (data) => process.stderr.write(`[${taskId}] ${data}`));

  proc.on('exit', (code) => {
    console.log(`[${taskId}] process exited with code ${code}`);

    if (code !== 0) {
      writeStatus(taskId, { status: 'failed', error: `hyperframes exited with code ${code}` });
    } else {
      try {
        const dest = videoPath(taskId);
        fs.copyFileSync(outPath, dest);
        const sizeMB = (fs.statSync(dest).size / 1024).toFixed(0);
        console.log(`[${taskId}] done — video saved to disk: ${sizeMB}KB`);
        writeStatus(taskId, { status: 'done' });
      } catch (err) {
        console.error(`[${taskId}] failed to save video: ${err.message}`);
        writeStatus(taskId, { status: 'failed', error: err.message });
      }
    }

    fs.rmSync(dir, { recursive: true, force: true });
    scheduleCleanup(taskId);
  });

  proc.on('error', (err) => {
    console.error(`[${taskId}] spawn error: ${err.message}`);
    writeStatus(taskId, { status: 'failed', error: err.message });
    fs.rmSync(dir, { recursive: true, force: true });
    scheduleCleanup(taskId);
  });

  res.json({ taskId });
});

app.get('/tasks/:taskId', (req, res) => {
  const { taskId } = req.params;
  const job = readStatus(taskId);
  console.log(`[${taskId}] poll → ${job ? job.status : 'not found'}`);

  if (!job) return res.status(404).json({ error: 'Task not found or expired' });

  if (job.status === 'done') {
    const vp = videoPath(taskId);
    if (!fs.existsSync(vp)) {
      return res.status(404).json({ error: 'Video file missing — job may have expired' });
    }
    const videoBase64 = fs.readFileSync(vp).toString('base64');
    return res.json({ status: 'done', videoBase64 });
  }

  res.json(job);
});

app.listen(3000, () => console.log('render-svc listening on :3000'));
