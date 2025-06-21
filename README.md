# Music Events - 音楽イベント情報アプリケーション

各地の音楽イベント情報を集めて表示し、ユーザー登録をすればイベントにお気に入りを付けたりイベントの登録が可能なWebアプリケーションです。

## 技術スタック

### フロントエンド
- **TypeScript** + **React** + **Vite**
- **Tailwind CSS** - スタイリング
- **React Router** - ルーティング

### バックエンド
- **Node.js** + **Express** - APIサーバー
- **Python** - Webスクレイピング
- **BeautifulSoup** + **Requests** - スクレイピングライブラリ

## 機能

### ユーザー機能
- ユーザー登録・ログイン
- イベントのお気に入り登録
- アーティストのお気に入り登録
- イベント投稿（ログイン後）

### イベント表示
- イベント一覧表示（リスト・カレンダー・アーティストビュー）
- ジャンル・地域別フィルタリング
- イベント詳細表示
- お気に入り機能

### スクレイピング機能
- **札幌教育文化会館** - Pythonスクレイパー
- **東京・大阪の音楽イベント** - Pythonスクレイパー
- 自動データ更新・重複除去

## セットアップ

### 前提条件
- Node.js 18以上
- Python 3.8以上
- npm または yarn

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd music-events
```

### 2. フロントエンドのセットアップ
```bash
cd client
npm install
```

### 3. バックエンドのセットアップ
```bash
cd ../server
npm install
```

### 4. Python依存関係のインストール
```bash
cd server
npm run install:python
```

## 実行方法

### 開発環境での実行

1. **バックエンドサーバーの起動**
```bash
cd server
npm run dev
```
サーバーは http://localhost:3001 で起動します。

2. **フロントエンドの起動**
```bash
cd client
npm run dev
```
アプリケーションは http://localhost:3000 で起動します。

### スクレイピングの実行

#### Pythonスクレイパー（全地域）
```bash
cd server
npm run scrape:python
```

#### カスタムオプション付きスクレイピング
```bash
cd server
python run_python_scraper.py --days 60 --output custom_events.json
```

#### 全スクレイパーの実行
```bash
cd server
npm run scrape:all
```

## プロジェクト構造

```
music-events/
├── client/                 # フロントエンド（TypeScript + React）
│   ├── src/
│   │   ├── types/         # TypeScript型定義
│   │   ├── App.tsx        # メインアプリケーション
│   │   ├── EventDetail.tsx # イベント詳細コンポーネント
│   │   ├── main.tsx       # エントリーポイント
│   │   └── index.css      # スタイル
│   ├── public/            # 静的ファイル
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── server/                # バックエンド（Node.js + Python）
│   ├── routes/           # APIルート
│   ├── python_scrapers/  # Pythonスクレイパー
│   │   ├── base_scraper.py      # 基本スクレイパークラス
│   │   ├── sapporo_scraper.py   # 札幌教育文化会館
│   │   ├── tokyo_scraper.py     # 東京音楽イベント
│   │   ├── osaka_scraper.py     # 大阪音楽イベント
│   │   └── scraper_manager.py   # スクレイパー管理
│   ├── data/             # スクレイピングデータ
│   ├── server.js         # Expressサーバー
│   ├── requirements.txt  # Python依存関係
│   └── package.json
└── README.md
```

## API エンドポイント

### イベント関連
- `GET /api/events` - イベント一覧取得
- `POST /api/events` - イベント作成
- `PUT /api/events/:id` - イベント更新
- `DELETE /api/events/:id` - イベント削除

## スクレイピング対象サイト

### Pythonスクレイパー
- **札幌教育文化会館** (https://www.kyobun.org/)
  - 月別イベントスケジュール
  - 大ホール・小ホール・ギャラリーのイベント
  - 音楽・洋舞・邦舞・展示・オペラ・演劇
- **東京音楽イベントサイト**
  - ライブハウス情報
  - 音楽イベント情報
- **大阪音楽イベントサイト**
  - ライブハウス情報
  - 音楽イベント情報

## スクレイピング機能詳細

### 札幌教育文化会館スクレイパー
- **URL構造**: `https://www.kyobun.org/event_schedule.html?k=lst&ym=YYYYMM`
- **抽出情報**:
  - イベント名・日付・会場・ジャンル
  - 開場・開演時間
  - アーティスト情報（タイトルから抽出）
  - イベント規模（会場に基づく推定）

### データ正規化
- **ジャンル統一**: 音楽→クラシック、洋舞・邦舞→ダンス
- **規模推定**: 大ホール→大規模、小ホール→中規模、ギャラリー→小規模
- **地域分類**: 札幌、東京、大阪
- **重複除去**: 同じ名前・日付のイベントは除外

## 開発者向け情報

### TypeScript設定
- 厳密な型チェック
- ESLint設定
- Vite設定

### スクレイピング設定
- サーバー負荷軽減のための遅延設定
- エラーハンドリング
- データ正規化
- 重複除去機能

### データ形式
```json
{
  "id": 1,
  "name": "イベント名",
  "date": "2025年6月22日（日）",
  "time": "15:00開場・16:00開演",
  "location": "札幌教育文化会館 大ホール",
  "artists": ["アーティスト1", "アーティスト2"],
  "price": "要確認",
  "scale": "大規模",
  "links": [{"label": "詳細", "url": "https://..."}],
  "genre": "クラシック",
  "region": "札幌",
  "source": "札幌教育文化会館",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## トラブルシューティング

### よくある問題

1. **Pythonスクレイパーが動作しない**
   ```bash
   cd server
   pip install -r requirements.txt
   ```

2. **フロントエンドのビルドエラー**
   ```bash
   cd client
   npm install
   npm run build
   ```

3. **APIサーバーが起動しない**
   ```bash
   cd server
   npm install
   npm run dev
   ```

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します。 