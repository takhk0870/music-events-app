"""
基本スクレイパークラス
"""
import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Any, Optional
import time
import random
from abc import ABC, abstractmethod


class BaseScraper(ABC):
    """スクレイピングの基本クラス"""
    
    def __init__(self, base_url: str, headers: Optional[Dict[str, str]] = None):
        self.base_url = base_url
        self.headers = headers or {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)
    
    def get_page(self, url: str, delay: float = 1.0) -> Optional[BeautifulSoup]:
        """ページを取得してBeautifulSoupオブジェクトを返す"""
        try:
            # サーバーに負荷をかけないようランダムな遅延
            time.sleep(delay + random.uniform(0, 1))
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            return BeautifulSoup(response.content, 'html.parser')
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return None
    
    @abstractmethod
    def scrape_events(self, **kwargs) -> List[Dict[str, Any]]:
        """イベント情報をスクレイピングする抽象メソッド"""
        pass
    
    def normalize_event(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """イベントデータを正規化する"""
        return {
            'id': event_data.get('id'),
            'name': event_data.get('name') or event_data.get('title', ''),
            'date': event_data.get('date', ''),
            'time': event_data.get('time', ''),
            'location': event_data.get('location') or event_data.get('venue', ''),
            'artists': event_data.get('artists', []),
            'price': event_data.get('price') or event_data.get('ticket_price', ''),
            'scale': event_data.get('scale', '中規模'),
            'links': event_data.get('links', []),
            'genre': event_data.get('genre', 'その他'),
            'region': event_data.get('region', ''),
            'source': event_data.get('source', ''),
            'image': event_data.get('image'),
            'createdAt': event_data.get('createdAt')
        } 