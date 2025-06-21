// sapporo-kyobun-scraper.js
import axios from 'axios';
import * as cheerio from 'cheerio';
import iconv from 'iconv-lite';

/**
 * ページを取得して Shift_JIS → UTF-8 に変換
 */
async function fetchHtml(url) {
  const resp = await axios.get(url, { responseType: 'arraybuffer' });
  return iconv.decode(resp.data, 'shift_jis');
}

/**
 * 札幌教育文化会館のイベントをスクレイピング
 * 月ごとの「一覧表示」セクションから <a href="…k=detail…"> のリンクを探し、
 * その前後のテキストノードから日付・会場・ジャンル・時間を抜き出します。
 *
 * @param {number} monthsToScrape 取得する月数（今日を含む連続月数）
 * @returns {Promise<Object[]>}
 */
export async function scrapeSapporoKyobunEvents(monthsToScrape = 1) {
  const baseUrl = 'https://www.kyobun.org/event_schedule.html?k=lst&ym=';
  const allEvents = [];
  const today = new Date();

  for (let i = 0; i < monthsToScrape; i++) {
    const dt = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const ym = `${dt.getFullYear()}${String(dt.getMonth() + 1).padStart(2, '0')}`;
    const url = `${baseUrl}${ym}`;
    console.log(`Fetching: ${url}`);
    let html;
    try {
      html = await fetchHtml(url);
    } catch (err) {
      console.error(`Error fetching ${url}: ${err.message}`);
      continue;
    }

    // 「### YYYY年M月」～次の「###」までを切り出す
    const monthRegex = new RegExp(`###\\s+${dt.getFullYear()}年${dt.getMonth()+1}月([\\s\\S]*?)(?=###|$)`);
    const match = html.match(monthRegex);
    if (!match) {
      console.warn(`Month section not found for ${ym}`);
      continue;
    }
    const sectionHtml = match[1];
    const $ = cheerio.load(sectionHtml);

    // 詳細ページへのリンクだけを抽出
    $('a[href*="k=detail"]').each((_, el) => {
      const $a = $(el);
      const title = $a.text().trim();
      const href = $a.attr('href');
      if (!title || !href) return;
      const link = new URL(href, url).href;

      // <a> の前後にあるテキストノードをまとめて配列化
      const texts = $a.parent().contents()
        .toArray()
        .map(n => $(n).text().trim())
        .filter(Boolean);

      // texts 例: ["2025年6月20日（金）", "大ホール", "音楽", "第71回…", "〖開場〗9：30〖開演〗10：00"]
      const [dateLine, venueType, genre, , timeLine] = texts;
      const timeMatch = timeLine && timeLine.match(/開場\s*([\d：]+)\s*開演\s*([\d：]+)/);

      allEvents.push({
        source: '札幌教育文化会館',
        title,
        date: dateLine || null,
        time: timeMatch
          ? { open: timeMatch[1], start: timeMatch[2] }
          : null,
        venue: venueType
          ? `札幌教育文化会館 ${venueType}`
          : '札幌教育文化会館',
        genre: genre || null,
        link,
        image: null,
        artists: [],
        ticket_price: null,
        scale: null,
        region: '札幌',
      });
    });

    console.log(`  → scraped ${allEvents.length} events so far`);
  }

  console.log(`Total events scraped: ${allEvents.length}`);
  return allEvents;
}
