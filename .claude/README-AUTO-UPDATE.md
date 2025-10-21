# README自動更新ガイド

このドキュメントは、重要な変更があった際にREADME.mdを自動的に更新する方法を説明します。

## 📝 自動更新の原則

重要な変更（新機能追加、バグ修正、APIエンドポイント追加など）があった場合、以下のセクションを自動的に更新してください。

---

## 🔄 更新すべきセクション

### 1. **特徴** セクション
**場所**: `## 特徴`

新しい機能を追加した場合、以下の形式で追記：
```markdown
### 🆕 新機能名
- **機能1**: 説明
- **機能2**: 説明
```

**例**:
```markdown
### 🆕 Analytics機能
- **統計情報**: 総いいね数、ユニーク写真数、ユーザー数、平均いいね数
- **人気ランキング**: いいね数の多い順にTOP10を表示
```

---

### 2. **技術スタック** セクション
**場所**: `## 技術スタック`

新しい技術やライブラリを導入した場合、該当するサブセクションに追記：

**フロントエンド**:
```markdown
- **新技術名** - 説明 🆕
```

**バックエンド**:
```markdown
- **Vercel Serverless Functions** - 3つのAPIエンドポイント
  - `/api/photos.js` - 説明
  - `/api/新API.js` - 説明 🆕
```

**データベース**:
```markdown
- **データベース名** - 説明 🆕
  - テーブル: `table_name`
  - 特徴1
  - 特徴2
```

---

### 3. **環境変数** セクション
**場所**: `### 3. 環境変数を設定`

新しい環境変数を追加した場合：
```markdown
**サービス名** 🆕:
- `ENV_VAR_NAME`: 説明
```

---

### 4. **ファイル構成** セクション
**場所**: `## ファイル構成`

新しいファイルやディレクトリを追加した場合：
```markdown
├── 新ファイル.js               # 説明 🆕
```

---

### 5. **API エンドポイント** セクション
**場所**: `## API エンドポイント`

新しいAPIエンドポイントを追加した場合：

```markdown
### N. エンドポイント名 🆕
\`\`\`
GET /api/endpoint?param={value}
\`\`\`
説明文。

**レスポンス例**:
\`\`\`json
{
  "success": true,
  "data": { ... }
}
\`\`\`
```

---

### 6. **更新履歴** セクション（最重要）
**場所**: `## 更新履歴`

**新しいバージョンを追加する場合**:

```markdown
### vX.Y.Z (YYYY-MM-DD) 🆕
**重要な機能追加**
- ✅ 機能1
- ✅ 機能2

**バグフィックス**
- 🐛 バグ1の修正
- 🐛 バグ2の修正

**技術的改善**
- 📦 改善1
- 📦 改善2
```

**バージョニングルール**:
- **メジャー更新 (X.0.0)**: 破壊的変更、大規模なアーキテクチャ変更
- **マイナー更新 (1.X.0)**: 新機能追加、重要な改善
- **パッチ更新 (1.0.X)**: バグ修正、小さな改善

---

## 🤖 自動化の方法

### 方法1: Git Hooksを使用

`.git/hooks/pre-commit` を作成：

```bash
#!/bin/bash

# 変更されたファイルをチェック
CHANGED_FILES=$(git diff --cached --name-only)

# APIファイルが変更された場合、READMEの更新を促す
if echo "$CHANGED_FILES" | grep -q "^api/"; then
  echo "⚠️  API files changed. Please update README.md:"
  echo "   - API エンドポイント セクション"
  echo "   - 更新履歴 セクション"
fi

# 新しいパッケージが追加された場合
if echo "$CHANGED_FILES" | grep -q "package.json"; then
  echo "⚠️  package.json changed. Please update README.md:"
  echo "   - 技術スタック セクション"
fi

exit 0
```

---

### 方法2: GitHub Actionsを使用

`.github/workflows/readme-check.yml` を作成：

```yaml
name: README Update Check

on:
  pull_request:
    paths:
      - 'api/**'
      - 'package.json'
      - 'index.html'

jobs:
  check-readme:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Check if README was updated
        run: |
          if git diff origin/main...HEAD --name-only | grep -q "README.md"; then
            echo "✅ README.md was updated"
          else
            echo "⚠️  WARNING: Code changed but README.md was not updated"
            echo "Please update the following sections:"
            echo "  - API エンドポイント"
            echo "  - 更新履歴"
            exit 1
          fi
```

---

### 方法3: Claudeに依頼する（推奨）

重要な変更をコミットする際、以下のように依頼してください：

```
重要な機能を追加しました。README.mdを更新してください。

変更内容:
- 新しいAPIエンドポイント /api/analytics を追加
- 統計情報機能を実装
- Supabaseデータベースを統合

以下のセクションを更新してください:
- 特徴
- 技術スタック
- API エンドポイント
- 更新履歴
```

Claudeは自動的に適切なセクションを更新し、以下を行います：
1. 🆕マークを新機能に追加
2. バージョン番号を適切にインクリメント
3. 更新履歴に詳細を追記
4. APIドキュメントを追加

---

## 📋 更新チェックリスト

コミット前に以下を確認してください：

- [ ] 新機能を「特徴」セクションに追加
- [ ] 新しい技術を「技術スタック」に追加
- [ ] 新しいAPIを「APIエンドポイント」に追加
- [ ] 環境変数を「環境変数」に追加
- [ ] ファイル構成を更新
- [ ] 更新履歴にバージョン情報を追加
- [ ] バージョン番号が適切か確認

---

## 🎯 ベストプラクティス

1. **常に🆕マークを使う**: 新しい機能には必ず 🆕 を付ける
2. **更新履歴は詳細に**: どんな小さな変更でも記録する
3. **バージョニングは厳密に**: セマンティックバージョニングに従う
4. **APIドキュメントは完全に**: リクエスト例とレスポンス例を必ず含める
5. **リンクを活用**: 関連する外部ドキュメントへのリンクを追加

---

## 📚 参考資料

- [セマンティックバージョニング](https://semver.org/lang/ja/)
- [Keep a Changelog](https://keepachangelog.com/ja/1.0.0/)
- [README Best Practices](https://github.com/hackergrrl/art-of-readme)

---

**最終更新**: 2025-10-22
