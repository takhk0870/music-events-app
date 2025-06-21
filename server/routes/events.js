import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url'; // Windowsのパス問題を解決するために追加

// ES Modulesで__dirnameを正しく取得するための推奨される方法
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 保存先ファイルのパスを定義
const eventsFilePath = path.join(__dirname, '..', 'data', 'events.json');

const router = express.Router();

// --- Helper Functions ---
const readEvents = async () => {
  try {
    const data = await fs.readFile(eventsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

const writeEvents = async (events) => {
  await fs.writeFile(eventsFilePath, JSON.stringify(events, null, 2));
};

// --- API Routes ---

/**
 * GET /api/events
 */
router.get('/', async (req, res) => {
  try {
    const events = await readEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'イベントデータの読み込みに失敗しました。' });
  }
});

/**
 * POST /api/events
 */
router.post('/', async (req, res) => {
  try {
    const events = await readEvents();
    const newEvent = req.body;
    const maxId = events.reduce((max, e) => (e.id > max ? e.id : max), 0);
    newEvent.id = maxId + 1;
    newEvent.createdAt = new Date().toISOString();
    events.push(newEvent);
    await writeEvents(events);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: 'イベントの作成に失敗しました。' });
  }
});

/**
 * PUT /api/events/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const events = await readEvents();
    const eventId = parseInt(req.params.id, 10);
    const updatedEventData = req.body;
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) {
      return res.status(404).json({ message: '指定されたイベントが見つかりません。' });
    }
    events[eventIndex] = { ...events[eventIndex], ...updatedEventData, id: eventId };
    await writeEvents(events);
    res.json(events[eventIndex]);
  } catch (error) {
    res.status(500).json({ message: 'イベントの更新に失敗しました。' });
  }
});

/**
 * DELETE /api/events/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    let events = await readEvents();
    const eventId = parseInt(req.params.id, 10);
    const filteredEvents = events.filter(e => e.id !== eventId);
    if (events.length === filteredEvents.length) {
      return res.status(404).json({ message: '指定されたイベントが見つかりません。' });
    }
    await writeEvents(filteredEvents);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'イベントの削除に失敗しました。' });
  }
});

export default router;
