// run-scraper.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { scrapeSapporoKyobunEvents } from './scrapers/sapporo-kyobun-scraper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const eventsFile = path.join(__dirname, 'data', 'events.json');

async function run() {
  console.log('Start scraping...');
  const events = await scrapeSapporoKyobunEvents(1);
  if (!events.length) {
    console.log('No events found, exiting.');
    return;
  }

  // 既存イベントを読み込み（なければ新規作成）
  let existing = [];
  try {
    existing = JSON.parse(await fs.readFile(eventsFile, 'utf-8'));
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
    console.log('No existing data, will create new events file.');
  }

  // 「札幌教育文化会館」以外の既存エントリとマージ
  const filtered = existing.filter(ev => ev.source !== '札幌教育文化会館');
  const merged = [...filtered, ...events].map((ev, idx) => ({ id: idx + 1, ...ev }));

  // 保存先ディレクトリを保証しつつ書き込み
  await fs.mkdir(path.dirname(eventsFile), { recursive: true });
  await fs.writeFile(eventsFile, JSON.stringify(merged, null, 2), 'utf-8');
  console.log(`Saved ${merged.length} events to ${eventsFile}`);
}

run().catch(err => {
  console.error('Scraping failed:', err);
  process.exit(1);
});
