# 太郎坊チャレンジ 2025 - Photo Slideshow

**歴史を駆け抜け、未来を掴め**

太郎坊チャレンジ2025の参加者の「あと30mの表情」を記録したフォトギャラリー＆スライドショーサイトです。

## 概要

- 379段の石段を駆け上がる参加者の表情を、マニュアルフォーカスで一日中追い続けた記録
- Google Drive APIから直接画像を取得し、ランダムに50枚をスライドショー表示
- ミニマルでストイックなデザイン
- フェードトランジション、いいね機能、SNSシェア機能を搭載

## 特徴

- **ランダム表示**: 毎回異なる50枚の写真をランダムに選択
- **スムーズなフェード**: 1.2秒のクロスフェードで滑らかな切り替え
- **スピード調整**: スロー（6秒）、ノーマル（3.5秒）、ファスト（1.5秒）
- **キーボード操作**: Space（再生/停止）、矢印キー（画像送り/速度変更）、L（いいね）など
- **いいね機能**: お気に入りの写真を保存し、フィルター表示可能
- **サムネイル表示**: 全50枚を一覧表示し、クリックでジャンプ
- **SNSシェア**: Twitter、Facebook、LINEで共有可能
- **BGM再生**: バックグラウンドミュージック対応

## 技術スタック

- **Pure HTML/CSS/JavaScript** - フレームワーク不使用
- **Google Drive API v3** - 画像の動的取得
- **LocalStorage** - いいね情報の永続化
- **CSS Transitions** - フェードエフェクト

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
├── index.html                   # メインファイル（HTML/CSS/JS統合）
├── config.example.js            # 設定ファイルのテンプレート
├── config.js                    # 実際の設定（.gitignoreに含まれる）
├── tarobo-logo-white.png        # ロゴ（透過PNG、白文字）
├── TAROBO CHALLENGE モバイル用.jpg  # 元画像（青文字）
├── message.md                   # プロジェクトの理念
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

### 429エラーについて

短時間に大量の画像を読み込むと、Google Driveの一時的なレート制限により429エラーが発生することがあります。その場合は30分〜1時間待ってから再度アクセスしてください。

## クレジット

**太郎坊チャレンジ実行委員会**
実行委員長: 奥田素之（太郎坊宮・阿賀神社 宮司）

開催日: 2025年10月12日
会場: 太郎坊宮（阿賀神社）- 滋賀県東近江市

---

*これは、未来を掴もうとした全ての人の記録です。*
