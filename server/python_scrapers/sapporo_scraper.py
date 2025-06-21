"""
札幌教育文化会館のイベント情報スクレイパー
"""
from .base_scraper import BaseScraper
from bs4 import BeautifulSoup
from typing import List, Dict, Any
import re
from datetime import datetime, timedelta
from urllib.parse import urljoin


class SapporoKyobunScraper(BaseScraper):
    """札幌教育文化会館のイベント情報をスクレイピング"""
    
    def __init__(self):
        super().__init__("https://www.kyobun.org")
    
    def scrape_events(self, months: int = 3) -> List[Dict[str, Any]]:
        """札幌教育文化会館のイベントをスクレイピング"""
        events = []
        
        # 指定された月数分スクレイピング
        for i in range(months):
            target_date = datetime.now() + timedelta(days=30 * i)
            year_month = target_date.strftime("%Y%m")
            
            try:
                month_events = self._scrape_month(year_month)
                events.extend(month_events)
                print(f"Scraped {len(month_events)} events for {year_month}")
            except Exception as e:
                print(f"Error scraping {year_month}: {e}")
                continue
        
        return events
    
    def _scrape_month(self, year_month: str) -> List[Dict[str, Any]]:
        """指定された年月のイベントをスクレイピング"""
        events = []
        
        # URL構築
        url = f"{self.base_url}/event_schedule.html?k=lst&ym={year_month}"
        
        try:
            soup = self.get_page(url)
            if not soup:
                return events
            
            # イベント要素を直接抽出
            event_elements = self._extract_event_elements(soup)
            
            for element in event_elements:
                try:
                    event_data = self._parse_event_element(element, year_month)
                    if event_data:
                        events.append(event_data)
                except Exception as e:
                    print(f"Error parsing event element: {e}")
                    continue
            
        except Exception as e:
            print(f"Error scraping month {year_month}: {e}")
        
        return events
    
    def _extract_event_elements(self, soup: BeautifulSoup) -> List[Dict[str, Any]]:
        """イベント要素を抽出"""
        events = []
        
        # 日付のパターン: YYYY年M月D日（曜日）
        date_pattern = r'(\d{4}年\d{1,2}月\d{1,2}日（[月火水木金土日]）)'
        
        # ページ全体のテキストを取得
        page_text = soup.get_text()
        
        # 日付で分割して各イベントを抽出
        date_matches = list(re.finditer(date_pattern, page_text))
        
        for i, date_match in enumerate(date_matches):
            try:
                # 現在の日付の位置
                current_pos = date_match.start()
                
                # 次の日付の位置（最後の場合はページの終わり）
                if i + 1 < len(date_matches):
                    next_pos = date_matches[i + 1].start()
                else:
                    next_pos = len(page_text)
                
                # この日付のイベント情報を抽出
                event_text = page_text[current_pos:next_pos]
                
                # イベントデータを解析
                event_data = self._parse_event_text(event_text, date_match.group(1))
                if event_data:
                    events.append(event_data)
                    
            except Exception as e:
                print(f"Error extracting event {i}: {e}")
                continue
        
        return events
    
    def _parse_event_text(self, event_text: str, date_str: str) -> Dict[str, Any]:
        """イベントテキストを解析"""
        try:
            # 会場を抽出
            venue_match = re.search(r'(大ホール|小ホール|ギャラリー)', event_text)
            venue = venue_match.group(1) if venue_match else "不明"
            
            # ジャンルを抽出
            genre_match = re.search(r'(音楽|洋舞・邦舞|展示|オペラ|演劇|その他)', event_text)
            genre = genre_match.group(1) if genre_match else "その他"
            
            # タイトルを抽出
            # 日付の後のテキストから、会場やジャンル、時間情報の前までをタイトルとする
            title_start = event_text.find(date_str) + len(date_str)
            title_end = len(event_text)
            
            # 会場、ジャンル、時間情報の位置をチェック
            for pattern in [r'大ホール', r'小ホール', r'ギャラリー', r'音楽', r'洋舞・邦舞', r'展示', r'オペラ', r'演劇', r'【開場】', r'【開演】']:
                match = re.search(pattern, event_text[title_start:])
                if match and match.start() < title_end - title_start:
                    title_end = title_start + match.start()
            
            title = event_text[title_start:title_end].strip()
            if not title:
                title = "不明なイベント"
            
            # 時間を抽出
            time_pattern = r'【開場】(\d{1,2}:\d{2})\s*【開演】(\d{1,2}:\d{2})'
            time_match = re.search(time_pattern, event_text)
            time_str = ""
            if time_match:
                open_time = time_match.group(1)
                start_time = time_match.group(2)
                time_str = f"{open_time}開場・{start_time}開演"
            
            # アーティスト情報を抽出
            artists = self._extract_artists(event_text)
            
            # イベントデータを構築
            event_data = {
                'name': title,
                'date': date_str,
                'time': time_str,
                'location': f"札幌教育文化会館 {venue}",
                'artists': artists,
                'price': '要確認',
                'scale': self._estimate_scale(venue, genre),
                'links': [],  # 詳細ページへのリンクは別途取得が必要
                'genre': self._normalize_genre(genre),
                'region': '札幌',
                'source': '札幌教育文化会館'
            }
            
            return event_data
            
        except Exception as e:
            print(f"Error parsing event text: {e}")
            return {}
    
    def _parse_event_element(self, element: BeautifulSoup, year_month: str) -> Dict[str, Any]:
        """イベント要素をパース（後方互換性のため残す）"""
        return self._parse_event_text(element.get_text(), "")
    
    def _estimate_scale(self, venue: str, genre: str) -> str:
        """イベント規模を推定"""
        if venue == "大ホール":
            return "大規模"
        elif venue == "小ホール":
            return "中規模"
        elif venue == "ギャラリー":
            return "小規模"
        else:
            return "中規模"
    
    def _normalize_genre(self, genre: str) -> str:
        """ジャンルを正規化"""
        genre_mapping = {
            '音楽': 'クラシック',
            '洋舞・邦舞': 'ダンス',
            '展示': '展示',
            'オペラ': 'クラシック',
            '演劇': '演劇',
            'その他': 'その他'
        }
        return genre_mapping.get(genre, 'その他')
    
    def _extract_artists(self, text: str) -> List[str]:
        """アーティスト情報を抽出"""
        artists = []
        
        # アーティスト名のパターンを検索
        # 例: "○○○"、"○○○＆○○○" などのパターン
        artist_patterns = [
            r'「([^」]+)」',
            r'『([^』]+)』',
            r'([^、。\n]+?)(?:＆|&)([^、。\n]+)',
        ]
        
        for pattern in artist_patterns:
            matches = re.findall(pattern, text)
            for match in matches:
                if isinstance(match, tuple):
                    artists.extend([m.strip() for m in match if m.strip()])
                else:
                    artists.append(match.strip())
        
        return list(set(artists))  # 重複を除去 