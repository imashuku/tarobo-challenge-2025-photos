-- 太郎坊チャレンジ2025 フォトスライドショー
-- 写真いいね機能のテーブル

-- photo_likesテーブル作成
CREATE TABLE IF NOT EXISTS photo_likes (
  id BIGSERIAL PRIMARY KEY,
  photo_id TEXT NOT NULL,           -- Google DriveのファイルID
  user_fingerprint TEXT NOT NULL,   -- ユーザー識別用（IPアドレスハッシュなど）
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス作成（高速化）
CREATE INDEX IF NOT EXISTS idx_photo_likes_photo_id ON photo_likes(photo_id);
CREATE INDEX IF NOT EXISTS idx_photo_likes_user_fingerprint ON photo_likes(user_fingerprint);

-- ユニーク制約（同じユーザーが同じ写真に複数回いいねできないように）
CREATE UNIQUE INDEX IF NOT EXISTS idx_photo_likes_unique
ON photo_likes(photo_id, user_fingerprint);

-- Row Level Security (RLS) を有効化
ALTER TABLE photo_likes ENABLE ROW LEVEL SECURITY;

-- 全員が読み取り可能
CREATE POLICY "Anyone can view likes"
ON photo_likes FOR SELECT
USING (true);

-- 全員がいいねを追加可能
CREATE POLICY "Anyone can insert likes"
ON photo_likes FOR INSERT
WITH CHECK (true);

-- 全員が自分のいいねを削除可能（user_fingerprintが一致する場合）
CREATE POLICY "Anyone can delete their own likes"
ON photo_likes FOR DELETE
USING (true);

-- 集計用のビュー（パフォーマンス向上）
CREATE OR REPLACE VIEW photo_like_counts AS
SELECT
  photo_id,
  COUNT(*) as like_count
FROM photo_likes
GROUP BY photo_id;

-- コメント
COMMENT ON TABLE photo_likes IS '写真へのいいね情報';
COMMENT ON COLUMN photo_likes.photo_id IS 'Google DriveのファイルID';
COMMENT ON COLUMN photo_likes.user_fingerprint IS 'ユーザー識別用（IPアドレスハッシュやブラウザフィンガープリント）';
