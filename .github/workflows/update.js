const axios = require('axios');
const fs = require('fs');

async function updateReport() {
  console.log('🚀 알고리즘 보고서 업데이트 시작...');
  
  const today = new Date().toISOString().split('T')[0];
  
  // 유튜브 알고리즘 정보 수집 (Reddit API)
  const youtubeData = await collectYouTubeInsights();
  
  // 인스타그램 알고리즘 정보 수집
  const instagramData = await collectInstagramInsights();
  
  // 틱톡 알고리즘 정보 수집
  const tiktokData = await collectTikTokInsights();
  
  // HTML 생성
  const html = generateHTML(today, youtubeData, instagramData, tiktokData);
  
  // index.html 파일 업데이트
  fs.writeFileSync('index.html', html);
  
  console.log('✅ 보고서 업데이트 완료!');
}

async function collectYouTubeInsights() {
  try {
    // Reddit r/NewTubers에서 최신 포스트 수집
    const response = await axios.get('https://www.reddit.com/r/NewTubers/hot.json?limit=10');
    const posts = response.data.data.children;
    
    let insights = [];
    posts.forEach(post => {
      if (post.data.title.toLowerCase().includes('algorithm') || 
          post.data.title.toLowerCase().includes('youtube')) {
        insights.push({
          title: post.data.title,
          content: post.data.selftext.substring(0, 300) + '...',
          score: post.data.score,
          url: `https://reddit.com${post.data.permalink}`
        });
      }
    });
    
    return insights.slice(0, 3); // 상위 3개만
  } catch (error) {
    console.error('유튜브 데이터 수집 오류:', error);
    return [];
  }
}

async function collectInstagramInsights() {
  try {
    const response = await axios.get('https://www.reddit.com/r/InstagramMarketing/hot.json?limit=10');
    const posts = response.data.data.children;
    
    let insights = [];
    posts.forEach(post => {
      if (post.data.title.toLowerCase().includes('algorithm') || 
          post.data.title.toLowerCase().includes('instagram')) {
        insights.push({
          title: post.data.title,
          content: post.data.selftext.substring(0, 300) + '...',
          score: post.data.score,
          url: `https://reddit.com${post.data.permalink}`
        });
      }
    });
    
    return insights.slice(0, 3);
  } catch (error) {
    console.error('인스타그램 데이터 수집 오류:', error);
    return [];
  }
}

async function collectTikTokInsights() {
  try {
    const response = await axios.get('https://www.reddit.com/r/TikTokHelp/hot.json?limit=10');
    const posts = response.data.data.children;
    
    let insights = [];
    posts.forEach(post => {
      if (post.data.title.toLowerCase().includes('algorithm') || 
          post.data.title.toLowerCase().includes('tiktok')) {
        insights.push({
          title: post.data.title,
          content: post.data.selftext.substring(0, 300) + '...',
          score: post.data.score,
          url: `https://reddit.com${post.data.permalink}`
        });
      }
    });
    
    return insights.slice(0, 3);
  } catch (error) {
    console.error('틱톡 데이터 수집 오류:', error);
    return [];
  }
}

function generateHTML(date, youtube, instagram, tiktok) {
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>소셜미디어 알고리즘 일일 보고서 - ${date}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f7fa; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 15px; margin-bottom: 30px; text-align: center; }
        .date-badge { background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 25px; display: inline-block; margin-bottom: 20px; }
        .platform-section { background: white; border-radius: 15px; padding: 30px; margin-bottom: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .platform-title { font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #333; }
        .insight-card { background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #667eea; }
        .insight-title { font-weight: bold; color: #333; margin-bottom: 10px; }
        .insight-content { color: #666; line-height: 1.6; margin-bottom: 10px; }
        .insight-meta { font-size: 12px; color: #999; }
        .youtube { border-left-color: #ff0000; }
        .instagram { border-left-color: #e4405f; }
        .tiktok { border-left-color: #000000; }
        .update-time { text-align: center; color: #666; margin-top: 30px; padding: 20px; background: white; border-radius: 10px; }
        .search-box { background: white; padding: 20px; border-radius: 15px; margin-bottom: 30px; }
        #searchInput { width: 100%; padding: 15px; border: 2px solid #ddd; border-radius: 10px; font-size: 16px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="date-badge">📅 ${date}</div>
            <h1>소셜미디어 알고리즘 일일 보고서</h1>
            <p>전세계 커뮤니티에서 수집한 최신 알고리즘 인사이트</p>
        </div>

        <div class="search-box">
            <input type="text" id="searchInput" placeholder="🔍 키워드 검색 (예: 유튜브, 인스타그램, 알고리즘)" onkeyup="searchReports()">
        </div>

        <div class="platform-section youtube">
            <h2 class="platform-title">🎥 유튜브 알고리즘</h2>
            ${youtube.map(insight => `
                <div class="insight-card">
                    <div class="insight-title">${insight.title}</div>
                    <div class="insight-content">${insight.content}</div>
                    <div class="insight-meta">👍 ${insight.score} | 출처: Reddit</div>
                </div>
            `).join('')}
        </div>

        <div class="platform-section instagram">
            <h2 class="platform-title">📸 인스타그램 알고리즘</h2>
            ${instagram.map(insight => `
                <div class="insight-card">
                    <div class="insight-title">${insight.title}</div>
                    <div class="insight-content">${insight.content}</div>
                    <div class="insight-meta">👍 ${insight.score} | 출처: Reddit</div>
                </div>
            `).join('')}
        </div>

        <div class="platform-section tiktok">
            <h2 class="platform-title">🎵 틱톡 알고리즘</h2>
            ${tiktok.map(insight => `
                <div class="insight-card">
                    <div class="insight-title">${insight.title}</div>
                    <div class="insight-content">${insight.content}</div>
                    <div class="insight-meta">👍 ${insight.score} | 출처: Reddit</div>
                </div>
            `).join('')}
        </div>

        <div class="update-time">
            <p>⏰ 마지막 업데이트: ${new Date().toLocaleString('ko-KR', {timeZone: 'Asia/Seoul'})}</p>
            <p>🔄 다음 업데이트: 내일 오전 12:00 (KST)</p>
        </div>
    </div>

    <script>
        function searchReports() {
            const input = document.getElementById('searchInput').value.toLowerCase();
            const cards = document.getElementsByClassName('insight-card');
            
            for (let card of cards) {
                const title = card.getElementsByClassName('insight-title')[0].textContent.toLowerCase();
                const content = card.getElementsByClassName('insight-content')[0].textContent.toLowerCase();
                
                if (title.includes(input) || content.includes(input)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = input === '' ? 'block' : 'none';
                }
            }
        }
    </script>
</body>
</html>`;
}

// 스크립트 실행
updateReport();
