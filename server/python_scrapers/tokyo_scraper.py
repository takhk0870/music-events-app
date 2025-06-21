"""
東京の音楽イベント情報スクレイパー
"""
from .base_scraper import BaseScraper
from bs4 import BeautifulSoup
from typing import List, Dict, Any
import re
from datetime import datetime, timedelta


class TokyoMusicScraper(BaseScraper):
    """東京の音楽イベント情報をスクレイピング"""
    
    def __init__(self):
        super().__init__("https://www.tokyo-music.jp")
    
    def scrape_events(self, days: int = 30) -> List[Dict[str, Any]]:
        """東京の音楽イベントをスクレイピング"""
        events = []
        
        # 複数の音楽イベントサイトから情報を取得
        events.extend(self._scrape_tokyo_music(days))
        events.extend(self._scrape_live_house_info(days))
        
        return events
    
    def _scrape_tokyo_music(self, days: int) -> List[Dict[str, Any]]:
        """東京音楽サイトからスクレイピング"""
        events = []
        
        try:
            # 実際のサイトに合わせてURLを調整
            url = f"{self.base_url}/events"
            soup = self.get_page(url)
            
            if not soup:
                return events
            
            # イベント要素を検索
            event_elements = soup.find_all('div', class_='event-item')
            
            for element in event_elements:
                try:
                    event_data = self._parse_event_element(element)
                    if event_data:
                        events.append(event_data)
                except Exception as e:
                    print(f"Error parsing event element: {e}")
                    continue
            
        except Exception as e:
            print(f"Error scraping Tokyo Music: {e}")
        
        return events
    
    def _scrape_live_house_info(self, days: int) -> List[Dict[str, Any]]:
        """ライブハウス情報サイトからスクレイピング"""
        events = []
        
        try:
            # 複数のライブハウスサイトをチェック
            live_house_sites = [
                "https://www.livehouse.co.jp",
                "https://www.tokyo-music.jp/livehouse"
            ]
            
            for site_url in live_house_sites:
                try:
                    soup = self.get_page(site_url)
                    if soup:
                        site_events = self._parse_live_house_site(soup, site_url)
                        events.extend(site_events)
                except Exception as e:
                    print(f"Error scraping {site_url}: {e}")
                    continue
                    
        except Exception as e:
            print(f"Error scraping live house info: {e}")
        
        return events
    
    def _parse_event_element(self, element) -> Dict[str, Any]:
        """イベント要素をパース"""
        try:
            # タイトル
            title_elem = element.find('h3') or element.find('h2') or element.find('a')
            title = title_elem.get_text(strip=True) if title_elem else "不明なイベント"
            
            # 日付
            date_elem = element.find(class_='date') or element.find(class_='event-date')
            date = date_elem.get_text(strip=True) if date_elem else ""
            
            # 場所
            location_elem = element.find(class_='venue') or element.find(class_='location')
            location = location_elem.get_text(strip=True) if location_elem else "東京"
            
            # アーティスト
            artists_elem = element.find(class_='artists') or element.find(class_='performers')
            artists = []
            if artists_elem:
                artists = [artist.strip() for artist in artists_elem.get_text().split(',') if artist.strip()]
            
            # 価格
            price_elem = element.find(class_='price') or element.find(class_='ticket-price')
            price = price_elem.get_text(strip=True) if price_elem else "要確認"
            
            # リンク
            link_elem = element.find('a')
            links = []
            if link_elem and link_elem.get('href'):
                link_url = link_elem['href']
                if not link_url.startswith('http'):
                    link_url = self.base_url + link_url
                links.append({
                    'label': '詳細情報',
                    'url': link_url
                })
            
            return {
                'name': title,
                'date': date,
                'time': '',  # 時間情報が取得できない場合
                'location': location,
                'artists': artists,
                'price': price,
                'scale': self._estimate_scale(artists, location),
                'links': links,
                'genre': self._detect_genre(title, artists),
                'region': '東京',
                'source': 'Tokyo Music Scraper'
            }
            
        except Exception as e:
            print(f"Error parsing event element: {e}")
            return {}
    
    def _parse_live_house_site(self, soup: BeautifulSoup, site_url: str) -> List[Dict[str, Any]]:
        """ライブハウスサイトをパース"""
        events = []
        
        # サイト固有のパース処理
        event_elements = soup.find_all(['div', 'article'], class_=re.compile(r'event|live|schedule'))
        
        for element in event_elements:
            try:
                event_data = self._parse_event_element(element)
                if event_data:
                    events.append(event_data)
            except Exception as e:
                print(f"Error parsing live house event: {e}")
                continue
        
        return events
    
    def _estimate_scale(self, artists: List[str], location: str) -> str:
        """イベント規模を推定"""
        if len(artists) > 5:
            return "大規模"
        elif len(artists) > 2:
            return "中規模"
        else:
            return "小規模"
    
    def _detect_genre(self, title: str, artists: List[str]) -> str:
        """ジャンルを検出"""
        title_lower = title.lower()
        artists_text = ' '.join(artists).lower()
        
        if any(word in title_lower or word in artists_text for word in ['rock', 'ロック', 'rock']):
            return "ロック"
        elif any(word in title_lower or word in artists_text for word in ['jazz', 'ジャズ']):
            return "ジャズ"
        elif any(word in title_lower or word in artists_text for word in ['classical', 'クラシック', 'classic']):
            return "クラシック"
        elif any(word in title_lower or word in artists_text for word in ['edm', 'electronic', 'エレクトロ']):
            return "EDM"
        else:
            return "ポップ" 