// Vercel Serverless Function: 写真へのいいね機能
// Supabaseを使用して全ユーザーのいいね数を集計

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// 環境変数チェック
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Environment variables SUPABASE_URL and SUPABASE_ANON_KEY are required');
}

// ユーザー識別用のフィンガープリントを生成（IPアドレスベース）
function getUserFingerprint(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0] : req.headers['x-real-ip'] || 'unknown';

  // IPアドレスとUser-Agentを組み合わせてハッシュ化
  const userAgent = req.headers['user-agent'] || '';
  const fingerprint = `${ip}-${userAgent}`;

  // 簡易ハッシュ（本格的にはcrypto.createHash使用）
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  return `user_${Math.abs(hash)}`;
}

export default async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const userFingerprint = getUserFingerprint(req);

  try {
    if (req.method === 'POST') {
      // いいねを追加
      const { photoId } = req.body;

      if (!photoId) {
        return res.status(400).json({ error: 'photoId is required' });
      }

      // 既にいいねしているかチェック
      const { data: existing } = await supabase
        .from('photo_likes')
        .select('id')
        .eq('photo_id', photoId)
        .eq('user_fingerprint', userFingerprint)
        .single();

      if (existing) {
        return res.status(200).json({
          success: true,
          message: 'Already liked',
          alreadyLiked: true
        });
      }

      // いいねを追加
      const { error: insertError } = await supabase
        .from('photo_likes')
        .insert({
          photo_id: photoId,
          user_fingerprint: userFingerprint
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        return res.status(500).json({ error: insertError.message });
      }

      // 最新のいいね数を取得
      const { count } = await supabase
        .from('photo_likes')
        .select('*', { count: 'exact', head: true })
        .eq('photo_id', photoId);

      return res.status(200).json({
        success: true,
        liked: true,
        count: count || 1
      });

    } else if (req.method === 'DELETE') {
      // いいねを削除
      const { photoId } = req.query;

      if (!photoId) {
        return res.status(400).json({ error: 'photoId is required' });
      }

      const { error: deleteError } = await supabase
        .from('photo_likes')
        .delete()
        .eq('photo_id', photoId)
        .eq('user_fingerprint', userFingerprint);

      if (deleteError) {
        console.error('Delete error:', deleteError);
        return res.status(500).json({ error: deleteError.message });
      }

      // 最新のいいね数を取得
      const { count } = await supabase
        .from('photo_likes')
        .select('*', { count: 'exact', head: true })
        .eq('photo_id', photoId);

      return res.status(200).json({
        success: true,
        liked: false,
        count: count || 0
      });

    } else if (req.method === 'GET') {
      // いいね数を取得
      const { photoId } = req.query;

      if (!photoId) {
        return res.status(400).json({ error: 'photoId is required' });
      }

      // いいね数を取得
      const { count } = await supabase
        .from('photo_likes')
        .select('*', { count: 'exact', head: true })
        .eq('photo_id', photoId);

      // 自分がいいねしているかチェック
      const { data: userLike } = await supabase
        .from('photo_likes')
        .select('id')
        .eq('photo_id', photoId)
        .eq('user_fingerprint', userFingerprint)
        .single();

      return res.status(200).json({
        success: true,
        count: count || 0,
        liked: !!userLike
      });

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
