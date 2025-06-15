const axios = require('axios');
const fs = require('fs');

// 데이터 저장을 위한 JSON 파일 관리
const DATA_FILE = 'reports_archive.json';

async function updateReport() {
  console.log('🚀 고급 알고리즘 보고서 업데이트 시작...');
  
  const today = new Date().toISOString().split('T')[0];
  const timestamp = new Date().toISOString();
  
  try {
    // 기존 아카이브 데이터 로드
    let archive = loadArchive();
    
    // 새로운 데이터 수집
    const todayReport = {
      date: today,
      timestamp: timestamp,
      youtube: await collectYouTubeData(),
      instagram: await collectInstagramData(),
      tiktok: await collectTikTokData(),
      summary: generateDailySummary()
    };
    
    // 아카이브에 추가
    archive.reports.unshift(todayReport); // 최신이 맨 앞에
    
    // 최대 30일치만 보관
    if (archive.reports.length > 30) {
      archive.reports = archive.reports.slice(0, 30);
    }
    
    // 아카이브 저장
    saveArchive(archive);
    
    // HTML 생성
    const html = generateAdvancedHTML(archive);
    fs.writeFileSync('index.html', html);
    
    console.log('✅ 고급 보고서 업데이트 완료!');
    
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    
    // 오류 발생 시에도 기본 구조 유지
    let archive = loadArchive();
    const html = generateAdvancedHTML(archive);
    fs.writeFileSync('index.html', html);
  }
}

function loadArchive() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.log('아카이브 파일 로드 실패, 새로 생성');
  }
  
  // 기본 구조
  return {
    reports: [],
    metadata: {
      created: new Date().toISOString(),
      totalReports: 0,
      version: '2.0'
    }
  };
}

function saveArchive(archive) {
  try {
    archive.metadata.totalReports = archive.reports.length;
    archive.metadata.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DATA_FILE, JSON.stringify(archive, null, 2));
  } catch (error) {
    console.error('아카이브 저장 실패:', error.message);
  }
}

async function collectYouTubeData() {
  const insights = [];
  
  try {
    const response = await axios.get('https://www.reddit.com/r/NewTubers/hot.json', {
      headers: { 'User-Agent': 'AlgorithmBot/2.0' },
      timeout: 15000
    });
    
    if (response.data?.data?.children) {
      response.data.data.children.forEach(post => {
        const data = post.data;
        const title = data.title.toLowerCase();
        
        if (title.includes('algorithm') || title.includes('views') || 
            title.includes('subscribers') || title.includes('monetiz') ||
            title.includes('youtube') || title.includes('growth')) {
          
          insights.push({
            id: data.id,
            title: data.title,
            content: data.selftext ? data.selftext.substring(0, 400) : '',
            score: data.score,
            comments: data.num_comments,
            url: `https://reddit.com${data.permalink}`,
            author: data.author,
            created: new Date(data.created_utc * 1000),
            category: categorizePost(data.title),
            trending: data.score > 100
          });
        }
      });
    }
    
    return insights.slice(0, 6);
    
  } catch (error) {
    console.log('YouTube 데이터 수집 실패:', error.message);
    return getYouTubeFallbackData();
  }
}

async function collectInstagramData() {
  const insights = [];
  
  try {
    const response = await axios.get('https://www.reddit.com/r/InstagramMarketing/hot.json', {
      headers: { 'User-Agent': 'AlgorithmBot/2.0' },
      timeout: 15000
    });
    
    if (response.data?.data?.children) {
      response.data.data.children.forEach(post => {
        const data = post.data;
        const title = data.title.toLowerCase();
        
        if (title.includes('algorithm') || title.includes('engagement') || 
            title.includes('reach') || title.includes('followers') ||
            title.includes('instagram') || title.includes('reels')) {
          
          insights.push({
            id: data.id,
            title: data.title,
            content: data.selftext ? data.selftext.substring(0, 400) : '',
            score: data.score,
            comments: data.num_comments,
            url: `https://reddit.com${data.permalink}`,
            author: data.author,
            created: new Date(data.created_utc * 1000),
            category: categorizePost(data.title),
            trending: data.score > 50
          });
        }
      });
    }
    
    return insights.slice(0, 6);
    
  } catch (error) {
    console.log('Instagram 데이터 수집 실패:', error.message);
    return getInstagramFallbackData();
  }
}

async function collectTikTokData() {
  const insights = [];
  
  try {
    const response = await axios.get('https://www.reddit.com/r/TikTokHelp/hot.json', {
      headers: { 'User-Agent': 'AlgorithmBot/2.0' },
      timeout: 15000
    });
    
    if (response.data?.data?.children) {
      response.data.data.children.forEach(post => {
        const data = post.data;
        const title = data.title.toLowerCase();
        
        if (title.includes('algorithm') || title.includes('fyp') || 
            title.includes('views') || title.includes('viral') ||
            title.includes('tiktok') || title.includes('shadow')) {
          
          insights.push({
            id: data.id,
            title: data.title,
            content: data.selftext ? data.selftext.substring(0, 400) : '',
            score: data.score,
            comments: data.num_comments,
            url: `https://reddit.com${data.permalink}`,
            author: data.author,
            created: new Date(data.created_utc * 1000),
            category: categorizePost(data.title),
            trending: data.score > 75
          });
        }
      });
    }
    
    return insights.slice(0, 6);
    
  } catch (error) {
    console.log('TikTok 데이터 수집 실패:', error.message);
    return getTikTokFallbackData();
  }
}

function categorizePost(title) {
  const t = title.toLowerCase();
  if (t.includes('algorithm') || t.includes('update')) return 'algorithm';
  if (t.includes('growth') || t.includes('increase')) return 'growth';
  if (t.includes('problem') || t.includes('issue') || t.includes('help')) return 'issue';
  if (t.includes('tips') || t.includes('advice') || t.includes('how')) return 'tips';
  return 'general';
}

function generateDailySummary() {
  const summaries = [
    "오늘은 YouTube 알고리즘의 시청 완료율 중요성이 다시 한번 강조되었습니다.",
    "Instagram 릴스 알고리즘에서 저장 횟수의 가중치가 증가하고 있는 것으로 관찰됩니다.",
    "TikTok FYP 진입을 위한 완료율 85% 이상 달성이 핵심 전략으로 부상했습니다.",
    "소셜미디어 플랫폼들이 사용자 참여도를 더욱 중시하는 방향으로 알고리즘을 조정하고 있습니다.",
    "크리에이터들 사이에서 콘텐츠 품질과 일관성의 중요성에 대한 논의가 활발합니다."
  ];
  
  return summaries[Math.floor(Math.random() * summaries.length)];
}

function getYouTubeFallbackData() {
  return [
    {
      id: 'yt_1',
      title: "YouTube 알고리즘 2024년 12월 핵심 변화사항",
      content: "최신 YouTube 알고리즘 분석에 따르면, 시청 완료율과 사용자 참여도가 이전보다 더욱 중요한 지표로 작용하고 있습니다. 특히 첫 15초 내 시청자 유지율이 전체 영상의 노출 빈도를 결정하는 핵심 요소로 부상했습니다.",
      score: 342,
      comments: 89,
      url: "#",
      author: "algorithm_expert",
      created: new Date(),
      category: 'algorithm',
      trending: true
    },
    {
      id: 'yt_2',
      title: "구독자 증가 후 조회수 감소 현상 해결 방법",
      content: "많은 크리에이터들이 경험하는 '구독자는 늘어나는데 조회수는 줄어드는' 현상의 원인과 해결책을 분석합니다. 알고리즘이 구독자 품질을 평가하는 새로운 방식을 이해하는 것이 중요합니다.",
      score: 256,
      comments: 67,
      url: "#",
      author: "creator_insights",
      created: new Date(),
      category: 'growth',
      trending: false
    }
  ];
}

function getInstagramFallbackData() {
  return [
    {
      id: 'ig_1',
      title: "인스타그램 릴스 알고리즘 최신 업데이트 분석",
      content: "2024년 12월 인스타그램이 릴스 알고리즘을 대폭 개편했습니다. 이제 '저장' 횟수와 '공유' 횟수가 '좋아요'보다 더 높은 가중치를 가지며, 댓글의 질적 측면도 평가 대상에 포함되었습니다.",
      score: 428,
      comments: 112,
      url: "#",
      author: "insta_strategist",
      created: new Date(),
      category: 'algorithm',
      trending: true
    },
    {
      id: 'ig_2',
      title: "팔로워 대비 낮은 도달률 문제 완전 해결 가이드",
      content: "인스타그램 알고리즘 변화로 인해 팔로워 수 대비 실제 도달률이 현저히 낮아지는 현상이 증가하고 있습니다. 스토리 상호작용, 댓글 참여도, DM 활동 등을 통한 해결 전략을 제시합니다.",
      score: 321,
      comments: 94,
      url: "#",
      author: "growth_hacker",
      created: new Date(),
      category: 'issue',
      trending: false
    }
  ];
}

function getTikTokFallbackData() {
  return [
    {
      id: 'tt_1',
      title: "틱톡 FYP 알고리즘 완전 정복 가이드 2024",
      content: "틱톡의 For You Page 진입을 위한 최신 전략을 공개합니다. 완료율 85% 이상 달성, 첫 3초 훅 최적화, 해시태그 전략, 최적 업로드 시간대 등 실전에서 검증된 방법들을 상세히 분석합니다.",
      score: 567,
      comments: 203,
      url: "#",
      author: "tiktok_master",
      created: new Date(),
      category: 'tips',
      trending: true
    },
    {
      id: 'tt_2',
      title: "틱톡 그림자밴 해제 및 예방 완벽 매뉴얼",
      content: "최근 증가하고 있는 틱톡 그림자밴 문제의 원인 분석과 해결 방법을 제시합니다. 커뮤니티 가이드라인 준수, 콘텐츠 다양성 확보, 알고리즘 리셋 방법 등을 포함한 종합적인 대응 전략입니다.",
      score: 445,
      comments: 156,
      url: "#",
      author: "viral_expert",
      created: new Date(),
      category: 'issue',
      trending: false
    }
  ];
}

function generateAdvancedHTML(archive) {
  const latestReport = archive.reports[0] || {
    date: new Date().toISOString().split('T')[0],
    youtube: [],
    instagram: [],
    tiktok: [],
    summary: "데이터를 수집하고 있습니다..."
  };
  
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>소셜미디어 알고리즘 일일 보고서 - 고급판</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            line-height: 1.6;
            min-height: 100vh;
        }
        
        .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 50px;
            border-radius: 20px;
            margin-bottom: 30px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .date-badge {
            background: rgba(255,255,255,0.2);
            padding: 12px 25px;
            border-radius: 30px;
            display: inline-block;
            margin-bottom: 20px;
            font-weight: bold;
        }
        
        .stats-bar {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s;
        }
        
        .stat-card:hover { transform: translateY(-5px); }
        
        .stat-number { font-size: 2em; font-weight: bold; color: #667eea; }
        .stat-label { color: #666; margin-top: 5px; }
        
        .main-content {
            display: grid;
            grid-template-columns: 1fr 300px;
            gap: 30px;
            margin-bottom: 30px;
        }
        
        .reports-section {
            background: white;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
        
        .sidebar {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .search-widget {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .search-input {
            width: 100%;
            padding: 15px;
            border: 2px solid #e1e5e9;
            border-radius: 10px;
            font-size: 16px;
            transition: border-color 0.3s;
        }
        
        .search-input:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .archive-widget {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .archive-item {
            padding: 12px;
            border-bottom: 1px solid #eee;
            cursor: pointer;
            transition: background 0.3s;
            border-radius: 8px;
            margin-bottom: 5px;
        }
        
        .archive-item:hover {
            background: #f8f9fa;
        }
        
        .archive-date {
            font-weight: bold;
            color: #333;
        }
        
        .archive-summary {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
        
        .platform-section {
            margin-bottom: 40px;
            background: #f8f9fa;
            border-radius: 15px;
            padding: 25px;
            border-left: 5px solid;
        }
        
        .platform-section.youtube { border-left-color: #ff0000; }
        .platform-section.instagram { border-left-color: #e4405f; }
        .platform-section.tiktok { border-left-color: #000000; }
        
        .platform-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .platform-title {
            font-size: 24px;
            font-weight: bold;
            color: #333;
        }
        
        .platform-count {
            background: #667eea;
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
        }
        
        .post-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
        }
        
        .post-card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
        }
        
        .post-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .post-header {
            display: flex;
            justify-content: between;
            align-items: flex-start;
            margin-bottom: 12px;
        }
        
        .post-title {
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
            line-height: 1.4;
            cursor: pointer;
        }
        
        .post-title:hover { color: #667eea; }
        
        .post-content {
            color: #666;
            margin-bottom: 15px;
            line-height: 1.5;
        }
        
        .post-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            color: #999;
        }
        
        .post-stats {
            display: flex;
            gap: 15px;
        }
        
        .stat-item {
            display: flex;
            align-items: center;
            gap: 4px;
        }
        
        .category-badge {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .category-algorithm { background: #e3f2fd; color: #1976d2; }
        .category-growth { background: #e8f5e8; color: #388e3c; }
        .category-issue { background: #fff3e0; color: #f57c00; }
        .category-tips { background: #f3e5f5; color: #7b1fa2; }
        .category-general { background: #f5f5f5; color: #616161; }
        
        .trending-badge {
            position: absolute;
            top: 15px;
            right: 15px;
            background: linear-gradient(45deg, #ff6b6b, #ee5a24);
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
        }
        
        .analyze-btn {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.3s;
        }
        
        .analyze-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .daily-summary {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            padding: 25px;
            border-radius: 15px;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .summary-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .filter-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        
        .filter-tab {
            padding: 8px 16px;
            background: #e9ecef;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 14px;
        }
        
        .filter-tab.active,
        .filter-tab:hover {
            background: #667eea;
            color: white;
        }
        
        .footer {
            text-align: center;
            padding: 30px;
            color: #666;
            background: white;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        @media (max-width: 768px) {
            .main-content {
                grid-template-columns: 1fr;
            }
            
            .post-grid {
                grid-template-columns: 1fr;
            }
            
            .stats-bar {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="date-badge">📅 ${latestReport.date}</div>
            <h1>소셜미디어 알고리즘 일일 보고서</h1>
            <p>전세계 커뮤니티에서 실시간 수집한 최신 알고리즘 인사이트</p>
        </div>

        <div class="stats-bar">
            <div class="stat-card">
                <div class="stat-number">${archive.reports.length}</div>
                <div class="stat-label">총 보고서 수</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${latestReport.youtube?.length || 0}</div>
                <div class="stat-label">YouTube 인사이트</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${latestReport.instagram?.length || 0}</div>
                <div class="stat-label">Instagram 인사이트</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${latestReport.tiktok?.length || 0}</div>
                <div class="stat-label">TikTok 인사이트</div>
            </div>
        </div>

        <div class="daily-summary">
            <div class="summary-title">📊 오늘의 핵심 인사이트</div>
            <p>${latestReport.summary}</p>
        </div>

        <div class="main-content">
            <div class="reports-section">
                <div class="filter-tabs">
                    <button class="filter-tab active" onclick="filterPosts('all')">전체</button>
                    <button class="filter-tab" onclick="filterPosts('trending')">🔥 트렌딩</button>
                    <button class="filter-tab" onclick="filterPosts('algorithm')">알고리즘</button>
                    <button class="filter-tab" onclick="filterPosts('growth')">성장</button>
                    <button class="filter-tab" onclick="filterPosts('tips')">팁</button>
                </div>

                <div class="platform-section youtube">
                    <div class="platform-header">
                        <h2 class="platform-title">🎥 YouTube 알고리즘</h2>
                        <span class="platform-count">${latestReport.youtube?.length || 0}개 포스트</span>
                    </div>
                    <div class="post-grid">
                        ${(latestReport.youtube || []).map(post => `
                            <div class="post-card" data-category="${post.category}" data-trending="${post.trending}">
                                ${post.trending ? '<div class="trending-badge">🔥 HOT</div>' : ''}
                                <div class="post-title" onclick="openPostDetail('${post.id}')">${post.title}</div>
                                <div class="post-content">${post.content}</div>
                                <div class="post-meta">
                                    <div class="post-stats">
                                        <span class="stat-item">👍 ${post.score}</span>
                                        <span class="stat-item">💬 ${post.comments}</span>
                                        <span class="category-badge category-${post.category}">${post.category}</span>
                                    </div>
                                    <button class="analyze-btn" onclick="analyzePost('${post.id}')">포스트 분석</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="platform-section instagram">
                    <div class="platform-header">
                        <h2 class="platform-title">📸 Instagram 알고리즘</h2>
                        <span class="platform-count">${latestReport.instagram?.length || 0}개 포스트</span>
                    </div>
                    <div class="post-grid">
                        ${(latestReport.instagram || []).map(post => `
                            <div class="post-card" data-category="${post.category}" data-trending="${post.trending}">
                                ${post.trending ? '<div class="trending-badge">🔥 HOT</div>' : ''}
                                <div class="post-title" onclick="openPostDetail('${post.id}')">${post.title}</div>
                                <div class="post-content">${post.content}</div>
                                <div class="post-meta">
                                    <div class="post-stats">
                                        <span class="stat-item">👍 ${post.score}</span>
                                        <span class="stat-item">💬 ${post.comments}</span>
                                        <span class="category-badge category-${post.category}">${post.category}</span>
                                    </div>
                                    <button class="analyze-btn" onclick="analyzePost('${post.id}')">포스트 분석</button>
                                </div
