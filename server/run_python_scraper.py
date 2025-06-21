#!/usr/bin/env python3
"""
Pythonスクレイパー実行スクリプト
"""
import sys
import os
import argparse
from datetime import datetime

# プロジェクトルートをパスに追加
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from python_scrapers.scraper_manager import ScraperManager


def main():
    parser = argparse.ArgumentParser(description='音楽イベント情報スクレイパー')
    parser.add_argument('--days', type=int, default=30, help='スクレイピングする日数（デフォルト: 30）')
    parser.add_argument('--output', type=str, default='events.json', help='出力ファイル名（デフォルト: events.json）')
    parser.add_argument('--data-dir', type=str, default='data', help='データディレクトリ（デフォルト: data）')
    
    args = parser.parse_args()
    
    print(f"=== 音楽イベント情報スクレイピング開始 ===")
    print(f"日時: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"対象日数: {args.days}日")
    print(f"出力ファイル: {args.output}")
    print(f"データディレクトリ: {args.data_dir}")
    print("=" * 50)
    
    try:
        # スクレイパーマネージャーを初期化
        manager = ScraperManager(data_dir=args.data_dir)
        
        # スクレイピングパイプラインを実行
        filepath = manager.run_scraping_pipeline(days=args.days, filename=args.output)
        
        print("=" * 50)
        print(f"スクレイピング完了！")
        print(f"保存先: {filepath}")
        print(f"完了時刻: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
    except Exception as e:
        print(f"エラーが発生しました: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main() 