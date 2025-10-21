// Vercel Serverless Function: いいね数の統計情報を取得
// 人気順ランキング、総いいね数、ユニークユーザー数など

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate'); // 1分キャッシュ

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 環境変数チェック
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({
      success: false,
      error: 'Server configuration error'
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  try {
    const { type = 'summary' } = req.query;

    if (type === 'summary') {
      // サマリー統計を取得
      const summary = await getSummaryStats(supabase);
      return res.status(200).json({
        success: true,
        data: summary
      });
    } else if (type === 'ranking') {
      // 人気順ランキングを取得
      const limit = parseInt(req.query.limit) || 10;
      const ranking = await getPopularPhotos(supabase, limit);
      return res.status(200).json({
        success: true,
        data: ranking
      });
    } else if (type === 'recent') {
      // 最近いいねされた写真を取得
      const limit = parseInt(req.query.limit) || 10;
      const recent = await getRecentLikes(supabase, limit);
      return res.status(200).json({
        success: true,
        data: recent
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid type parameter. Use: summary, ranking, or recent'
      });
    }

  } catch (error) {
    console.error('Analytics error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * サマリー統計を取得
 */
async function getSummaryStats(supabase) {
  // 総いいね数
  const { count: totalLikes } = await supabase
    .from('photo_likes')
    .select('*', { count: 'exact', head: true });

  // ユニークな写真数（いいねされた写真の数）
  const { data: uniquePhotos } = await supabase
    .from('photo_likes')
    .select('photo_id')
    .limit(10000); // 最大10000件まで取得

  const uniquePhotoIds = new Set(uniquePhotos?.map(p => p.photo_id) || []);

  // ユニークユーザー数
  const { data: uniqueUsers } = await supabase
    .from('photo_likes')
    .select('user_fingerprint')
    .limit(10000);

  const uniqueUserIds = new Set(uniqueUsers?.map(u => u.user_fingerprint) || []);

  // 平均いいね数（写真あたり）
  const avgLikesPerPhoto = uniquePhotoIds.size > 0
    ? (totalLikes / uniquePhotoIds.size).toFixed(2)
    : 0;

  return {
    totalLikes: totalLikes || 0,
    uniquePhotos: uniquePhotoIds.size,
    uniqueUsers: uniqueUserIds.size,
    avgLikesPerPhoto: parseFloat(avgLikesPerPhoto)
  };
}

/**
 * 人気順ランキングを取得（いいね数の多い順）
 */
async function getPopularPhotos(supabase, limit) {
  const { data, error } = await supabase
    .from('photo_likes')
    .select('photo_id')
    .limit(10000); // 全データ取得

  if (error) {
    throw error;
  }

  // photo_idごとにいいね数を集計
  const likeCounts = {};
  data.forEach(row => {
    likeCounts[row.photo_id] = (likeCounts[row.photo_id] || 0) + 1;
  });

  // いいね数でソート
  const ranking = Object.entries(likeCounts)
    .map(([photoId, count]) => ({ photoId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  return {
    ranking,
    total: ranking.length
  };
}

/**
 * 最近いいねされた写真を取得
 */
async function getRecentLikes(supabase, limit) {
  const { data, error } = await supabase
    .from('photo_likes')
    .select('photo_id, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return {
    recent: data || [],
    total: data?.length || 0
  };
}
