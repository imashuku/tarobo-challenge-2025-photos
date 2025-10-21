# 太郎坊チャレンジ 2025 - Photo Slideshow

**歴史を駆け抜け、未来を掴め**

太郎坊チャレンジ2025の参加者の「あと30mの表情」を記録したフォトギャラリー＆スライドショーサイトです。

## 概要

- 379段の石段を駆け上がる参加者の表情を、マニュアルフォーカスで一日中追い続けた記録
- Google Drive APIから直接画像を取得し、ランダムに50枚をスライドショー表示
- ミニマルでストイックなデザイン
- フェードトランジション、いいね機能、SNSシェア機能を搭載

## 特徴

### 基本機能
- **ランダム表示**: 毎回異なる50枚の写真をランダムに選択
- **スムーズなフェード**: 1.2秒のクロスフェードで滑らかな切り替え
- **スピード調整**: スロー（6秒）、ノーマル（3.5秒）、ファスト（1.5秒）
- **キーボード操作**: Space（再生/停止）、矢印キー（画像送り）、L（いいね）など
- **サムネイル表示**: 全50枚を一覧表示し、クリックでジャンプ
- **SNSシェア**: Twitter、Facebook、LINEで共有可能
- **BGM再生**: バックグラウンドミュージック対応

### 🆕 いいね機能（Supabase連携）
- **永続化**: Supabase PostgreSQLにいいね情報を保存
- **リアルタイム更新**: 5秒ごとのポーリングで他ユーザーのいいねを即座に反映
- **通知機能**: 誰かがいいねした時にリアルタイム通知を表示
- **フィルター**: いいねした写真だけを表示可能
- **ユーザー識別**: IPアドレス + User-Agentでフィンガープリント生成

### 🆕 Analytics機能
- **統計情報**: 総いいね数、ユニーク写真数、ユーザー数、平均いいね数
- **人気ランキング**: いいね数の多い順にTOP10を表示
- **ランキングジャンプ**: クリックで該当写真に直接移動
- **キャッシング**: 1分間キャッシュで高速表示

### 🆕 ビジュアルエフェクト強化
- **ハートポップアニメーション**: 回転＋拡大の豪華なアニメーション
- **リップルエフェクト**: いいねボタンから波紋が広がる
- **フローティングハート**: 3つのハートが浮き上がるエフェクト
- **スムーズトランジション**: すべてのUI要素にアニメーション適用

## 技術スタック

### フロントエンド
- **Pure HTML/CSS/JavaScript** - フレームワーク不使用（1900行以上の統合ファイル）
- **CSS3 Animations** - ハートポップ、リップル、フローティングハート
- **LocalStorage** - いいね情報のローカルバックアップ

### バックエンド
- **Vercel Serverless Functions** - 3つのAPIエンドポイント
  - `/api/photos.js` - 画像リスト取得（1時間キャッシュ）
  - `/api/like.js` - いいね機能（GET/POST/DELETE）
  - `/api/analytics.js` - 統計情報（1分キャッシュ）🆕
- **Google Drive API v3** - 画像の動的取得
- **Edge Caching** - Vercel Edgeで高速配信

### データベース
- **Supabase (PostgreSQL)** - いいね情報の永続化 🆕
  - テーブル: `photo_likes`
  - Row Level Security (RLS) 有効化
  - インデックス最適化済み

### セキュリティ
- **ユーザー識別**: IPアドレス + User-Agentハッシュ
- **重複防止**: ユニーク制約でデータ整合性を保証
- **RLSポリシー**: 読み取り・書き込み・削除の権限管理

## セットアップ

### 1. リポジトリをクローン
```bash
git clone https://github.com/imashuku/tarobo-challenge-2025-photos.git
cd tarobo-challenge-2025-photos
```

### 2. Google Drive API キーを取得
1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成（または既存のものを使用）
3. Google Drive API を有効化
4. 「認証情報」→「APIキーを作成」
5. **重要**: APIキーに制限をかける
   - 「HTTPリファラー」制限を設定し、あなたのドメインのみを許可
   - 例: `https://yourdomain.com/*`

### 3. 設定ファイルを作成
```bash
cp config.example.js config.js
```

`config.js` を編集して、実際の値を入力：
```javascript
const CONFIG = {
  FOLDER_ID: 'あなたのGoogle DriveフォルダID',
  API_KEY: 'あなたのGoogle API Key'
};
```

**注意**: `config.js` はGitHubにコミットされません（`.gitignore`に含まれています）

### 4. ブラウザで開く
```bash
open index.html
```

または、ローカルサーバーを起動：
```bash
python3 -m http.server 8000
# http://localhost:8000 にアクセス
```

## Vercelへのデプロイ（推奨）

大規模なアクセスに対応するため、Vercelへのデプロイを推奨します。

### 1. Vercelアカウントを作成
https://vercel.com にアクセスしてサインアップ

### 2. GitHubリポジトリをインポート
1. Vercelダッシュボードで「New Project」をクリック
2. GitHubリポジトリ `tarobo-challenge-2025-photos` を選択
3. 「Import」をクリック

### 3. 環境変数を設定
「Environment Variables」セクションで以下を追加：

**Google Drive API**:
- `FOLDER_ID`: `1SjdlmWER2n6kRT0CB0zuO4OmIrnc9aR1`
- `API_KEY`: Google Drive APIキー

**Supabase** 🆕:
- `SUPABASE_URL`: `https://your-project.supabase.co`
- `SUPABASE_ANON_KEY`: Supabaseの匿名キー（anon public key）

### 4. デプロイ
「Deploy」をクリックすると、自動的にデプロイされます。

### 5. カスタムドメイン（オプション）
Vercelの設定で独自ドメインを設定できます。

## キーボード操作

| キー | 動作 |
|------|------|
| Space | 再生/一時停止 |
| ← → | 前後の画像に移動 |
| ↑ ↓ | 速度変更 |
| L | いいね |
| Enter | 画像拡大表示 |
| Esc | モーダルを閉じる |
| T | サムネイル表示切替 |
| F | フィルター切替（全表示/いいねのみ） |

## ファイル構成

```
.
├── index.html                   # メインファイル（HTML/CSS/JS統合、1900行以上）
├── api/
│   ├── photos.js                # 画像リスト取得API
│   ├── like.js                  # いいね機能API（GET/POST/DELETE）
│   └── analytics.js             # 統計情報API 🆕
├── supabase_photo_likes.sql     # Supabaseテーブル定義 🆕
├── config.example.js            # 設定ファイルのテンプレート
├── tarobo-logo-white.png        # ロゴ（透過PNG、白文字）
├── message.md                   # プロジェクトの理念
├── vercel.json                  # Vercel設定
├── package.json                 # Node.js依存関係
├── .gitignore                   # Git除外設定
└── README.md                    # このファイル
```

## セキュリティについて

- **API Key**: `config.js` に保存されており、GitHubにコミットされています
- **HTTPリファラー制限**: APIキーには以下のドメイン制限がかかっています：
  - `file:///*` - ローカル開発用
  - `https://imashuku.github.io/*` - GitHub Pages公開用
- **重要**: これらのドメイン以外からはAPIキーを使用できないため、第三者による不正利用のリスクは最小限です
- **Google Driveフォルダ**: 公開設定の場合、誰でもアクセス可能です（必要に応じて制限してください）

### 429エラーの防止（改善済み）

**Vercel Serverless Functionsとキャッシュ機能により、429エラーを防止しています。**

**改善内容：**
- サーバーサイドで画像リストを1時間キャッシュ
- 複数のユーザーがアクセスしても、1時間に1回だけGoogle Drive APIを呼び出す
- 大規模なアクセスにも対応可能

**旧バージョンとの互換性：**
- API経由での取得に失敗した場合、自動的に直接Google Drive APIにフォールバック
- `config.js`がある場合は、ローカル開発でも動作します

## API エンドポイント

### 1. 画像リスト取得
```
GET /api/photos
```
Google Driveからランダムに50枚の写真を取得。1時間キャッシュ。

**レスポンス例**:
```json
{
  "success": true,
  "cached": false,
  "data": {
    "total": 1146,
    "count": 50,
    "photos": [
      { "url": "...", "name": "...", "id": "..." }
    ]
  }
}
```

### 2. いいね機能 🆕
```
GET /api/like?photoId={id}      # いいね数取得
POST /api/like                  # いいね追加
DELETE /api/like?photoId={id}   # いいね削除
```

**POSTリクエスト例**:
```json
{
  "photoId": "1abc123xyz"
}
```

**レスポンス例**:
```json
{
  "success": true,
  "liked": true,
  "count": 5
}
```

### 3. 統計情報 🆕
```
GET /api/analytics?type=summary     # サマリー統計
GET /api/analytics?type=ranking&limit=10  # 人気ランキング
GET /api/analytics?type=recent&limit=10   # 最近のいいね
```

**サマリーレスポンス例**:
```json
{
  "success": true,
  "data": {
    "totalLikes": 123,
    "uniquePhotos": 45,
    "uniqueUsers": 67,
    "avgLikesPerPhoto": 2.7
  }
}
```

**ランキングレスポンス例**:
```json
{
  "success": true,
  "data": {
    "ranking": [
      { "photoId": "abc123", "count": 15 },
      { "photoId": "def456", "count": 12 }
    ],
    "total": 10
  }
}
```

## 更新履歴

### v2.0.0 (2025-10-22) 🆕
**重要な機能追加**
- ✅ Analytics API実装（統計情報・ランキング）
- ✅ いいね機能のSupabase永続化
- ✅ リアルタイム更新（5秒ポーリング）
- ✅ ビジュアルエフェクト強化（3重アニメーション）
- ✅ 統計情報パネル追加（📊ボタン）
- ✅ 人気ランキングTOP10表示
- ✅ リアルタイム通知機能

**バグフィックス**
- 🐛 `.single()`を`.maybeSingle()`に修正してSupabase接続エラーを解消
- 🐛 Invalid API keyエラーの修正

**技術的改善**
- 📦 Supabase統合（PostgreSQL）
- 📦 APIエンドポイント追加（analytics.js）
- 📦 キャッシュ戦略の最適化

### v1.0.0 (2025-10-20)
**初回リリース**
- ✅ ランダムスライドショー機能
- ✅ いいね機能（LocalStorage）
- ✅ SNSシェア機能
- ✅ BGM再生機能
- ✅ サムネイル表示
- ✅ フィルター機能

## クレジット

**太郎坊チャレンジ実行委員会**
実行委員長: 奥田素之（太郎坊宮・阿賀神社 宮司）

開催日: 2025年10月12日
会場: 太郎坊宮（阿賀神社）- 滋賀県東近江市

---

*これは、未来を掴もうとした全ての人の記録です。*
