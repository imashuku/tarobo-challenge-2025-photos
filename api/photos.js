// Vercel Serverless Function: Google Drive APIからランダムな写真リストを取得
// キャッシュを使用して、429エラーを防ぎます

const FOLDER_ID = process.env.FOLDER_ID || '1SjdlmWER2n6kRT0CB0zuO4OmIrnc9aR1';
const API_KEY = process.env.API_KEY || 'AIzaSyAa9kU803qNBjvl0BY47ZATfJh5PzI4ELo';
const COUNT = 50; // 表示枚数

// キャッシュ用のグローバル変数
let cache = null;
let cacheTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1時間

/**
 * Google Drive APIから全画像リストを取得（ページネーション対応）
 */
async function fetchAllFiles() {
  let allFiles = [];
  let pageToken = null;

  do {
    const params = new URLSearchParams({
      q: `'${FOLDER_ID}' in parents and (mimeType contains 'image/')`,
      key: API_KEY,
      fields: 'files(id,name,mimeType,webContentLink),nextPageToken',
      pageSize: '1000',
      orderBy: 'name'
    });

    if (pageToken) {
      params.set('pageToken', pageToken);
    }

    const url = `https://www.googleapis.com/drive/v3/files?${params}`;

    const res = await fetch(url);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(`Google Drive API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await res.json();
    const files = data.files || [];
    allFiles = allFiles.concat(files);
    pageToken = data.nextPageToken;

  } while (pageToken);

  return allFiles;
}

/**
 * ランダムにシャッフルして指定枚数を返す
 */
function getRandomPhotos(files, count) {
  const shuffled = [...files].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, count).map(f => ({
    url: `https://drive.google.com/thumbnail?id=${f.id}&sz=w1200`,
    name: f.name,
    id: f.id
  }));

  return picked;
}

/**
 * Vercel Serverless Function のエントリーポイント
 */
export default async function handler(req, res) {
  try {
    // CORS設定
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

    // キャッシュチェック
    const now = Date.now();
    if (cache && (now - cacheTime < CACHE_DURATION)) {
      console.log('Returning cached data');
      return res.status(200).json({
        success: true,
        cached: true,
        cacheAge: Math.floor((now - cacheTime) / 1000),
        data: cache
      });
    }

    console.log('Fetching fresh data from Google Drive API');

    // Google Drive APIから画像リストを取得
    const allFiles = await fetchAllFiles();
    console.log(`Fetched ${allFiles.length} images from Google Drive`);

    // ランダムに選択
    const photos = getRandomPhotos(allFiles, COUNT);

    // キャッシュに保存
    cache = {
      total: allFiles.length,
      count: photos.length,
      photos: photos,
      timestamp: now
    };
    cacheTime = now;

    // レスポンス
    return res.status(200).json({
      success: true,
      cached: false,
      data: cache
    });

  } catch (error) {
    console.error('Error:', error);

    // エラーでもキャッシュがあれば返す
    if (cache) {
      return res.status(200).json({
        success: true,
        cached: true,
        cacheAge: Math.floor((Date.now() - cacheTime) / 1000),
        data: cache,
        warning: 'Returned cached data due to error'
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
