const axios = require('axios');
const fs = require('fs');

async function updateReport() {
  console.log('🚀 알고리즘 보고서 업데이트 시작...');
  
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const youtubeData = await collectData('youtube');
    const instagramData = await collectData('instagram');
    const tiktokData = await collectData('tiktok');
    
    const html = generateHTML(today, youtubeData, instagramData, tiktokData);
    fs.writeFileSync('index.html', html);
    
    console.log('✅ 보고서 생성 완료!');
  } catch (error) {
    console.error('❌ 오류:', error.message);
    const html = generateHTML(today, [], [], []);
    fs.writeFileSync('index.html', html);
  }
}

async function collectData(platform) {
  // 안전한 더미 데이터 반환
  return [
    {
      id: `${platform}_1`,
      title: `${platform} 알고리즘 최신 분석`,
      content: `2024년 ${platform} 알고리즘의 주요 변화사항과 대응 전략을 분석합니다.`,
      score: 150,
      comments: 45,
      trending: true
    },
    {
      id: `${platform}_2`, 
      title: `${platform} 성장 전략 가이드`,
      content: `효과적인 ${platform} 마케팅을 위한 실전 전략을 제시합니다.`,
      score: 89,
      comments: 23,
      trending: false
    }
  ];
}

function generateHTML(date, youtube, instagram, tiktok) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>소셜미디어 알고리즘 보고서 - ${date}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 40px; border-radius: 15px; text-align: center; margin-bottom: 30px; }
        .section { background: white; padding: 30px; margin-bottom: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .post-card { background: #f8f9fa; padding: 20px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid #667eea; }
        .post-title { font-weight: bold; color: #333; margin-bottom: 10px; cursor: pointer; }
        .post-content { color: #666; margin-bottom: 10px; }
        .post-meta { font-size: 12px; color: #999; }
        .trending { border-left-color: #ff6b6b; }
        .analyze-btn { background: #667eea; color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 소셜미디어 알고리즘 일일 보고서</h1>
            <p>📅 ${date}</p>
        </div>
        
        <div class="section">
            <h2>🎥 YouTube (${youtube.length}개)</h2>
            ${youtube.map(post => `
                <div class="post-card ${post.trending ? 'trending' : ''}">
                    <div class="post-title">${post.title}</div>
                    <div class="post-content">${post.content}</div>
                    <div class="post-meta">
                        👍 ${post.score} | 💬 ${post.comments}
                        <button class="analyze-btn" onclick="alert('포스트 분석 기능')">분석</button>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="section">
            <h2>📸 Instagram (${instagram.length}개)</h2>
            ${instagram.map(post => `
                <div class="post-card ${post.trending ? 'trending' : ''}">
                    <div class="post-title">${post.title}</div>
                    <div class="post-content">${post.content}</div>
                    <div class="post-meta">
                        👍 ${post.score} | 💬 ${post.comments}
                        <button class="analyze-btn" onclick="alert('포스트 분석 기능')">분석</button>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="section">
            <h2>🎵 TikTok (${tiktok.length}개)</h2>
            ${tiktok.map(post => `
                <div class="post-card ${post.trending ? 'trending' : ''}">
                    <div class="post-title">${post.title}</div>
                    <div class="post-content">${post.content}</div>
                    <div class="post-meta">
                        👍 ${post.score} | 💬 ${post.comments}
                        <button class="analyze-btn" onclick="alert('포스트 분석 기능')">분석</button>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;
}

updateReport();
