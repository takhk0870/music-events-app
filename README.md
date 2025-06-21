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
- 札幌教育文化会館（Node.js）
- 東京・大阪の音楽イベント（Python）
- 自動データ更新

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

#### Node.jsスクレイパー（札幌教育文化会館）
```bash
cd server
npm run scrape
```

#### Pythonスクレイパー（東京・大阪）
```bash
cd server
npm run scrape:python
```

#### 全スクレイパーの実行
```bash
cd server
npm run scrape:all
```

#### カスタムオプション付きスクレイピング
```bash
cd server
python run_python_scraper.py --days 60 --output custom_events.json
```

## プロジェクト構造

```
music-events/
├── client/                 # フロントエンド（TypeScript + React）
│   ├── src/
│   │   ├── types/         # TypeScript型定義
│   │   ├── App.tsx        # メインアプリケーション
│   │   ├── EventDetail.tsx # イベント詳細コンポーネント
│   │   └── main.tsx       # エントリーポイント
│   ├── package.json
│   └── vite.config.ts
├── server/                # バックエンド（Node.js + Python）
│   ├── routes/           # APIルート
│   ├── scrapers/         # Node.jsスクレイパー
│   ├── python_scrapers/  # Pythonスクレイパー
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

### Node.jsスクレイパー
- 札幌教育文化会館 (https://www.kyobun.org/)

### Pythonスクレイパー
- 東京音楽イベントサイト
- 大阪音楽イベントサイト
- ライブハウス情報サイト

## 開発者向け情報

### TypeScript設定
- 厳密な型チェック
- ESLint設定
- Vite設定

### スクレイピング設定
- サーバー負荷軽減のための遅延設定
- エラーハンドリング
- データ正規化

### データ形式
```json
{
  "id": 1,
  "name": "イベント名",
  "date": "2024-01-01",
  "time": "19:00-21:00",
  "location": "会場名",
  "artists": ["アーティスト1", "アーティスト2"],
  "price": "¥1000",
  "scale": "中規模",
  "links": [{"label": "詳細", "url": "https://..."}],
  "genre": "ロック",
  "region": "東京",
  "source": "スクレイパー名"
}
```

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します。 