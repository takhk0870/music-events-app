"""
スクレイパーマネージャー
複数のスクレイパーを統合管理
"""
import json
import os
from typing import List, Dict, Any
from datetime import datetime
from .tokyo_scraper import TokyoMusicScraper
from .osaka_scraper import OsakaMusicScraper
from .sapporo_scraper import SapporoKyobunScraper


class ScraperManager:
    """複数のスクレイパーを管理するクラス"""
    
    def __init__(self, data_dir: str = "data"):
        self.data_dir = data_dir
        self.scrapers = {
            'sapporo': SapporoKyobunScraper(),
            'tokyo': TokyoMusicScraper(),
            'osaka': OsakaMusicScraper(),
        }
        
        # データディレクトリを作成
        os.makedirs(data_dir, exist_ok=True)
    
    def run_all_scrapers(self, days: int = 30) -> List[Dict[str, Any]]:
        """全てのスクレイパーを実行"""
        all_events = []
        
        print(f"Starting scraping for the next {days} days...")
        
        for region, scraper in self.scrapers.items():
            try:
                print(f"Scraping {region} events...")
                if region == 'sapporo':
                    # 札幌は月単位でスクレイピング
                    months = max(1, days // 30)
                    events = scraper.scrape_events(months)
                else:
                    events = scraper.scrape_events(days)
                print(f"Found {len(events)} events in {region}")
                all_events.extend(events)
            except Exception as e:
                print(f"Error scraping {region}: {e}")
                continue
        
        # イベントにIDを付与
        for i, event in enumerate(all_events):
            event['id'] = i + 1
            event['createdAt'] = datetime.now().isoformat()
        
        return all_events
    
    def save_events(self, events: List[Dict[str, Any]], filename: str = "events.json") -> str:
        """イベントデータをJSONファイルに保存"""
        filepath = os.path.join(self.data_dir, filename)
        
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(events, f, ensure_ascii=False, indent=2)
            
            print(f"Saved {len(events)} events to {filepath}")
            return filepath
        except Exception as e:
            print(f"Error saving events: {e}")
            raise
    
    def load_events(self, filename: str = "events.json") -> List[Dict[str, Any]]:
        """既存のイベントデータを読み込み"""
        filepath = os.path.join(self.data_dir, filename)
        
        try:
            if os.path.exists(filepath):
                with open(filepath, 'r', encoding='utf-8') as f:
                    events = json.load(f)
                print(f"Loaded {len(events)} events from {filepath}")
                return events
            else:
                print(f"No existing events file found at {filepath}")
                return []
        except Exception as e:
            print(f"Error loading events: {e}")
            return []
    
    def merge_events(self, new_events: List[Dict[str, Any]], existing_events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """新しいイベントと既存イベントをマージ"""
        # 既存イベントのIDを保持
        existing_ids = {event.get('id', 0) for event in existing_events}
        
        # 新しいイベントにIDを付与
        next_id = max(existing_ids) + 1 if existing_ids else 1
        for event in new_events:
            if 'id' not in event:
                event['id'] = next_id
                next_id += 1
        
        # 重複を避けてマージ
        merged = existing_events.copy()
        for new_event in new_events:
            # 同じ名前と日付のイベントが既に存在するかチェック
            is_duplicate = any(
                existing.get('name') == new_event.get('name') and 
                existing.get('date') == new_event.get('date')
                for existing in existing_events
            )
            
            if not is_duplicate:
                merged.append(new_event)
        
        return merged
    
    def run_scraping_pipeline(self, days: int = 30, filename: str = "events.json") -> str:
        """完全なスクレイピングパイプラインを実行"""
        print("Starting scraping pipeline...")
        
        # 既存データを読み込み
        existing_events = self.load_events(filename)
        
        # 新しいデータをスクレイピング
        new_events = self.run_all_scrapers(days)
        
        # データをマージ
        merged_events = self.merge_events(new_events, existing_events)
        
        # 保存
        filepath = self.save_events(merged_events, filename)
        
        print(f"Scraping pipeline completed. Total events: {len(merged_events)}")
        return filepath


def main():
    """メイン実行関数"""
    manager = ScraperManager()
    
    try:
        # 30日分のイベントをスクレイピング
        filepath = manager.run_scraping_pipeline(days=30)
        print(f"Scraping completed successfully. Data saved to: {filepath}")
    except Exception as e:
        print(f"Scraping failed: {e}")


if __name__ == "__main__":
    main() 