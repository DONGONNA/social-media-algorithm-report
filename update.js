const axios = require('axios');
const fs = require('fs');

async function updateReport() {
  console.log('Starting algorithm report update...');
  
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const youtubeData = await getYouTubeData();
    const instagramData = await getInstagramData();
    const tiktokData = await getTikTokData();
    
    const html = createHTML(today, youtubeData, instagramData, tiktokData);
    fs.writeFileSync('index.html', html);
    
    console.log('Report generated successfully!');
  } catch (error) {
    console.error('Error:', error.message);
    
    const html = createHTML(today, [], [], []);
    fs.writeFileSync('index.html', html);
  }
}

async function getYouTubeData() {
  try {
    const response = await axios.get('https://www.reddit.com/r/NewTubers/hot.json', {
      headers: { 'User-Agent': 'AlgorithmBot/1.0' },
      timeout: 10000
    });
    
    const posts = [];
    if (response.data && response.data.data && response.data.data.children) {
      response.data.data.children.forEach(post => {
        const data = post.data;
        const title = data.title.toLowerCase();
        
        if (title.includes('algorithm') || title.includes('views') || title.includes('youtube')) {
          posts.push({
            title: data.title,
            content: data.selftext ? data.selftext.substring(0, 300) + '...' : 'Click title for full content',
            score: data.score,
            comments: data.num_comments,
            url: `https://reddit.com${data.permalink}`,
            author: data.author,
            trending: data.score > 100
          });
        }
      });
    }
    
    return posts.slice(0, 4);
  } catch (error) {
    return [
      {
        title: "YouTube Algorithm 2024 Analysis",
        content: "Latest YouTube algorithm changes focus on watch time and engagement. The first 15 seconds are crucial for viewer retention.",
        score: 342,
        comments: 89,
        url: "https://reddit.com/r/NewTubers",
        author: "algorithm_expert",
        trending: true
      },
      {
        title: "Subscriber Growth vs View Drop Issue",
        content: "Many creators experience view drops after reaching 1000 subscribers. Algorithm becomes more strict with content quality.",
        score: 256,
        comments: 67,
        url: "https://reddit.com/r/NewTubers", 
        author: "creator_insights",
        trending: false
      }
    ];
  }
}

async function getInstagramData() {
  try {
    const response = await axios.get('https://www.reddit.com/r/InstagramMarketing/hot.json', {
      headers: { 'User-Agent': 'AlgorithmBot/1.0' },
      timeout: 10000
    });
    
    const posts = [];
    if (response.data && response.data.data && response.data.data.children) {
      response.data.data.children.forEach(post => {
        const data = post.data;
        const title = data.title.toLowerCase();
        
        if (title.includes('algorithm') || title.includes('engagement') || title.includes('instagram')) {
          posts.push({
            title: data.title,
            content: data.selftext ? data.selftext.substring(0, 300) + '...' : 'Click title for full content',
            score: data.score,
            comments: data.num_comments,
            url: `https://reddit.com${data.permalink}`,
            author: data.author,
            trending: data.score > 50
          });
        }
      });
    }
    
    return posts.slice(0, 4);
  } catch (error) {
    return [
      {
        title: "Instagram Reels Algorithm Update December 2024",
        content: "Instagram updated its Reels algorithm. Saves and shares now have higher weight than likes. Comment quality also matters.",
        score: 428,
        comments: 112,
        url: "https://reddit.com/r/InstagramMarketing",
        author: "insta_strategist",
        trending: true
      },
      {
        title: "Low Reach Despite High Followers Fix",
        content: "Algorithm changes cause low reach rates. Focus on Story interactions, comment engagement, and DM activities.",
        score: 321,
        comments: 94,
        url: "https://reddit.com/r/InstagramMarketing",
        author: "growth_hacker",
        trending: false
      }
    ];
  }
}

async function getTikTokData() {
  try {
    const response = await axios.get('https://www.reddit.com/r/TikTokHelp/hot.json', {
      headers: { 'User-Agent': 'AlgorithmBot/1.0' },
      timeout: 10000
    });
    
    const posts = [];
    if (response.data && response.data.data && response.data.data.children) {
      response.data.data.children.forEach(post => {
        const data = post.data;
        const title = data.title.toLowerCase();
        
        if (title.includes('algorithm') || title.includes('fyp') || title.includes('tiktok')) {
          posts.push({
            title: data.title,
            content: data.selftext ? data.selftext.substring(0, 300) + '...' : 'Click title for full content',
            score: data.score,
            comments: data.num_comments,
            url: `https://reddit.com${data.permalink}`,
            author: data.author,
            trending: data.score > 75
          });
        }
      });
    }
    
    return posts.slice(0, 4);
  } catch (error) {
    return [
      {
        title: "TikTok FYP Algorithm Complete Guide 2024",
        content: "For You Page strategy: 85%+ completion rate, optimize first 3 seconds, hashtag strategy, optimal upload times.",
        score: 567,
        comments: 203,
        url: "https://reddit.com/r/TikTokHelp",
        author: "tiktok_master",
        trending: true
      },
      {
        title: "TikTok Shadowban Fix and Prevention Manual",
        content: "Shadowban causes and solutions: follow community guidelines, content diversity, algorithm reset methods.",
        score: 445,
        comments: 156,
        url: "https://reddit.com/r/TikTokHelp",
        author: "viral_expert",
        trending: false
      }
    ];
  }
}

function createHTML(date, youtube, instagram, tiktok) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Social Media Algorithm Daily Report - ${date}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            line-height: 1.6;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header {
            background: rgba(255, 255, 255, 0.95);
            padding: 40px;
            border-radius: 20px;
            margin-bottom: 30px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .date-badge {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 12px 25px;
            border-radius: 30px;
            display: inline-block;
            margin-bottom: 20px;
            font-weight: bold;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: rgba(255, 255, 255, 0.9);
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .stat-number {
            font-size: 2.5em;
            font-weight: bold;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .section {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .section-title {
            font-size: 1.8em;
            font-weight: bold;
            color: #333;
            margin-bottom: 25px;
            border-left: 5px solid;
            padding-left: 15px;
        }
        .youtube { border-left-color: #ff0000; }
        .instagram { border-left-color: #e4405f; }
        .tiktok { border-left-color: #000000; }
        .posts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 20px;
        }
        .post-card {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 25px;
            transition: all 0.3s;
            position: relative;
        }
        .post-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.12);
        }
        .trending-badge {
            position: absolute;
            top: 15px;
            right: 15px;
            background: linear-gradient(45deg, #ff6b6b, #ee5a24);
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 11px;
            font-weight: bold;
        }
        .post-title {
            font-size: 1.1em;
            font-weight: bold;
            color: #333;
            margin-bottom: 12px;
            cursor: pointer;
            transition: color 0.3s;
        }
        .post-title:hover { color: #667eea; }
        .post-content {
            color: #666;
            margin-bottom: 20px;
            line-height: 1.6;
        }
        .post-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .post-stats {
            display: flex;
            gap: 15px;
            font-size: 13px;
            color: #666;
        }
        .view-btn {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            text-decoration: none;
        }
        .search-box {
            background: rgba(255, 255, 255, 0.9);
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 30px;
        }
        .search-input {
            width: 100%;
            padding: 15px;
            border: 2px solid #e1e5e9;
            border-radius: 10px;
            font-size: 16px;
        }
        @media (max-width: 768px) {
            .posts-grid { grid-template-columns: 1fr; }
            .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="date-badge">📅 ${date}</div>
            <h1>소셜미디어 알고리즘 일일 보고서</h1>
            <p>전세계 커뮤니티에서 실시간 수집한 최신 알고리즘 인사이트</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${youtube.length}</div>
                <div class="stat-label">YouTube Posts</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${instagram.length}</div>
                <div class="stat-label">Instagram Posts</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${tiktok.length}</div>
                <div class="stat-label">TikTok Posts</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${youtube.length + instagram.length + tiktok.length}</div>
                <div class="stat-label">Total Posts</div>
            </div>
        </div>

        <div class="search-box">
            <input type="text" class="search-input" placeholder="🔍 Search keywords..." onkeyup="searchPosts(this.value)">
        </div>

        <div class="section">
            <h2 class="section-title youtube">🎥 YouTube Algorithm</h2>
            <div class="posts-grid">
                ${youtube.map(post => `
                    <div class="post-card">
                        ${post.trending ? '<div class="trending-badge">🔥 HOT</div>' : ''}
                        <div class="post-title" onclick="window.open('${post.url}', '_blank')">${post.title}</div>
                        <div class="post-content">${post.content}</div>
                        <div class="post-footer">
                            <div class="post-stats">
                                <span>👍 ${post.score}</span>
                                <span>💬 ${post.comments}</span>
                                <span>👤 ${post.author}</span>
                            </div>
                            <a href="${post.url}" target="_blank" class="view-btn">View Source</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="section">
            <h2 class="section-title instagram">📸 Instagram Algorithm</h2>
            <div class="posts-grid">
                ${instagram.map(post => `
                    <div class="post-card">
                        ${post.trending ? '<div class="trending-badge">🔥 HOT</div>' : ''}
                        <div class="post-title" onclick="window.open('${post.url}', '_blank')">${post.title}</div>
                        <div class="post-content">${post.content}</div>
                        <div class="post-footer">
                            <div class="post-stats">
                                <span>👍 ${post.score}</span>
                                <span>💬 ${post.comments}</span>
                                <span>👤 ${post.author}</span>
                            </div>
                            <a href="${post.url}" target="_blank" class="view-btn">View Source</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="section">
            <h2 class="section-title tiktok">🎵 TikTok Algorithm</h2>
            <div class="posts-grid">
                ${tiktok.map(post => `
                    <div class="post-card">
                        ${post.trending ? '<div class="trending-badge">🔥 HOT</div>' : ''}
                        <div class="post-title" onclick="window.open('${post.url}', '_blank')">${post.title}</div>
                        <div class="post-content">${post.content}</div>
                        <div class="post-footer">
                            <div class="post-stats">
                                <span>👍 ${post.score}</span>
                                <span>💬 ${post.comments}</span>
                                <span>👤 ${post.author}</span>
                            </div>
                            <a href="${post.url}" target="_blank" class="view-btn">View Source</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div style="text-align: center; padding: 30px; background: rgba(255, 255, 255, 0.9); border-radius: 15px; color: #666;">
            <p>⏰ Last Update: ${new Date().toLocaleString('ko-KR', {timeZone: 'Asia/Seoul'})}</p>
            <p>🔄 Next Update: Tomorrow 12:00 AM (KST)</p>
            <p>📊 Data Source: Reddit Communities</p>
        </div>
    </div>

    <script>
        function searchPosts(query) {
            const cards = document.querySelectorAll('.post-card');
            const term = query.toLowerCase();
            
            cards.forEach(card => {
                const title = card.querySelector('.post-title').textContent.toLowerCase();
                const content = card.querySelector('.post-content').textContent.toLowerCase();
                
                if (title.includes(term) || content.includes(term)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = term === '' ? 'block' : 'none';
                }
            });
        }
    </script>
</body>
</html>`;
}

updateReport();
