const axios = require('axios');
const fs = require('fs');

async function updateReport() {
  console.log('🚀 알고리즘 보고서 업데이트 시작...');
  
  const today = new Date().toISOString().split('T')[0];
  
  try {
    // 더 안전한 데이터 수집
    const youtubeData = await collectYouTubeInsights();
    const instagramData = await collectInstagramInsights();
    const tiktokData = await collectTikTokInsights();
    
    console.log('YouTube 데이터:', youtubeData.length, '개');
    console.log('Instagram 데이터:', instagramData.length, '개');
    console.log('TikTok 데이터:', tiktokData.length, '개');
    
    // HTML 생성
    const html = generateHTML(today, youtubeData, instagramData, tiktokData);
    
    // index.html 파일 업데이트
    fs.writeFileSync('index.html', html);
    
    console.log('✅ 보고서 업데이트 완료!');
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    
    // 오류 발생 시 기본 템플릿 생성
    const html = generateHTML(today, [], [], []);
    fs.writeFileSync('index.html', html);
  }
}

async function collectYouTubeInsights() {
  try {
    const response = await axios.get('https://www.reddit.com/r/NewTubers/hot.json?limit=5', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const posts = response.data.data.children;
    let insights = [];
    
    posts.forEach(post => {
      const title = post.data.title.toLowerCase();
      if (title.includes('algorithm') || title.includes('youtube') || title.includes('views')) {
        insights.push({
          title: post.data.title,
          content: post.data.selftext ? post.data.selftext.substring(0, 200) + '...' : '상세 내용 확인 필요',
          score: post.data.score,
          url: `https://reddit.com${post.data.permalink}`,
          author: post.data.author
        });
      }
    });
    
    return insights.slice(0, 3);
  } catch (error) {
    console.error('YouTube 데이터 수집 오류:', error.message);
    return [{
      title: "Reddit API 접근 제한",
      content: "현재 Reddit API 접근에 제한이 있어 샘플 데이터를 표시합니다. 유튜브 알고리즘은 지속적으로 변화하고 있으며, 최신 트렌드를 파악하는 것이 중요합니다.",
      score: 0,
      url: "#",
      author: "system"
    }];
  }
}

async function collectInstagramInsights() {
  try {
    const response = await axios.get('https://www.reddit.com/r/InstagramMarketing/hot.json?limit=5', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const posts = response.data.data.children;
    let insights = [];
    
    posts.forEach(post => {
      const title = post.data.title.toLowerCase();
      if (title.includes('algorithm') || title.includes('instagram') || title.includes('engagement')) {
        insights.push({
          title: post.data.title,
          content: post.data.selftext ? post.data.selftext.substring(0, 200) + '...' : '상세 내용 확인 필요',
          score: post.data.score,
          url: `https://reddit.com${post.data.permalink}`,
          author: post.data.author
        });
      }
    });
    
    return insights.slice(0, 3);
  } catch (error) {
    console.error('Instagram 데이터 수집 오류:', error.message);
    return [{
      title: "인스타그램 알고리즘 변화 동향",
      content: "2024년 인스타그램 알고리즘은 릴스와 스토리에 더 큰 가중치를 두고 있습니다. 참여도와 저장률이 중요한 지표로 작용하고 있습니다.",
      score: 0,
      url: "#",
      author: "system"
    }];
  }
}

async function collectTikTokInsights() {
  try {
    const response = await axios.get('https://www.reddit.com/r/TikTokHelp/hot.json?limit=5', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const posts = response.data.data.children;
    let insights = [];
    
    posts.forEach(post => {
      const title = post.data.title.toLowerCase();
      if (title.includes('algorithm') || title.includes('tiktok') || title.includes('views')) {
        insights.push({
          title: post.data.title,
          content: post.data.selftext ? post.data.selftext.substring(0, 200) + '...' : '상세 내용 확인 필요',
          score: post.data.score,
          url: `https://reddit.com${post.data.permalink}`,
          author: post.data.author
        });
      }
    });
    
    return insights.slice(0, 3);
  } catch (error) {
    console.error('TikTok 데이터 수집 오류:', error.message);
    return [{
      title: "틱톡 알고리즘 최신 동향",
      content: "틱톡 알고리즘은 완료율(Completion Rate)을 가장 중요하게 평가합니다. 첫 3초 안에 시청자의 관심을 끌어야 FYP에 노출될 가능성이 높아집니다.",
      score: 0,
      url: "#",
      author: "system"
    }];
  }
}

function generateHTML(date, youtube, instagram, tiktok) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>소셜미디어 알고리즘 일일 보고서 - ${date}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f7fa; line-height: 1.6; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 15px; margin-bottom: 30px; text-align: center; }
        .date-badge { background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 25px; display: inline-block; margin-bottom: 20px; }
        .platform-section { background: white; border-radius: 15px; padding: 30px; margin-bottom: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .platform-title { font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #333; }
        .insight-card { background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #667eea; }
        .insight-title { font-weight: bold; color: #333; margin-bottom: 10px; font-size: 16px; }
        .insight-content { color: #666; line-height: 1.6; margin-bottom: 10px; }
        .insight-meta { font-size: 12px; color: #999; display: flex; justify-content: space-between; }
        .youtube { border-left-color: #ff0000; }
        .instagram { border-left-color: #e4405f; }
        .tiktok { border-left-color: #000000; }
        .update-time { text-align: center; color: #666; margin-top: 30px; padding: 20px; background: white; border-radius: 10px; }
        .search-box { background: white; padding: 20px; border-radius: 15px; margin-bottom: 30px; }
        #searchInput { width: 100%; padding: 15px; border: 2px solid #ddd; border-radius: 10px; font-size: 16px; }
        .no-data { text-align: center; color: #999; padding: 40px; font-style: italic; }
        .source-link { color: #667eea; text-decoration: none; font-size: 12px; }
        .source-link:hover { text-decoration: underline; }
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
            ${youtube.length > 0 ? youtube.map(insight => `
                <div class="insight-card">
                    <div class="insight-title">${insight.title}</div>
                    <div class="insight-content">${insight.content}</div>
                    <div class="insight-meta">
                        <span>👍 ${insight.score} | 작성자: ${insight.author}</span>
                        <a href="${insight.url}" class="source-link" target="_blank">원문 보기</a>
                    </div>
                </div>
            `).join('') : '<div class="no-data">현재 수집된 데이터가 없습니다.</div>'}
        </div>

        <div class="platform-section instagram">
            <h2 class="platform-title">📸 인스타그램 알고리즘</h2>
            ${instagram.length > 0 ? instagram.map(insight => `
                <div class="insight-card">
                    <div class="insight-title">${insight.title}</div>
                    <div class="insight-content">${insight.content}</div>
                    <div class="insight-meta">
                        <span>👍 ${insight.score} | 작성자: ${insight.author}</span>
                        <a href="${insight.url}" class="source-link" target="_blank">원문 보기</a>
                    </div>
                </div>
            `).join('') : '<div class="no-data">현재 수집된 데이터가 없습니다.</div>'}
        </div>

        <div class="platform-section tiktok">
            <h2 class="platform-title">🎵 틱톡 알고리즘</h2>
            ${tiktok.length > 0 ? tiktok.map(insight => `
                <div class="insight-card">
                    <div class="insight-title">${insight.title}</div>
                    <div class="insight-content">${insight.content}</div>
                    <div class="insight-meta">
                        <span>👍 ${insight.score} | 작성자: ${insight.author}</span>
                        <a href="${insight.url}" class="source-link" target="_blank">원문 보기</a>
                    </div>
                </div>
            `).join('') : '<div class="no-data">현재 수집된 데이터가 없습니다.</div>'}
        </div>

        <div class="update-time">
            <p>⏰ 마지막 업데이트: ${new Date().toLocaleString('ko-KR', {timeZone: 'Asia/Seoul'})}</p>
            <p>🔄 다음 업데이트: 내일 오전 12:00 (KST)</p>
            <p>📊 데이터 출처: Reddit 커뮤니티 (r/NewTubers, r/InstagramMarketing, r/TikTokHelp)</p>
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
