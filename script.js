// Lucideアイコンを初期化
lucide.createIcons();

// 固定ボタンのスクロール表示制御
window.addEventListener('scroll', function() {
  const fixedButton = document.querySelector('.fixed-apply-button');
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // ページトップから少しスクロールしたら表示
  if (scrollTop > 200) {
    fixedButton.style.opacity = '1';
    fixedButton.style.visibility = 'visible';
  } else {
    fixedButton.style.opacity = '0.8';
  }
});

// セクションファイルを動的に読み込み
async function loadSection(sectionName, containerId) {
  try {
    const response = await fetch(`sections/${sectionName}.html`);
    const sectionHtml = await response.text();
    
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = sectionHtml;
    }
  } catch (error) {
    console.error(`${sectionName}セクションの読み込みに失敗しました:`, error);
  }
}

// すべてのセクションを読み込み
async function loadAllSections() {
  const sections = [
    { name: 'header', id: 'header-container' },
    { name: 'results', id: 'results-container' },
    { name: 'requirements', id: 'requirements-container' },
    { name: 'awards', id: 'awards-container' },
    { name: 'terms', id: 'terms-container' },
    { name: 'ai-usage', id: 'ai-usage-container' },
    { name: 'schedule', id: 'schedule-container' },
    { name: 'judges', id: 'judges-container' },
    { name: 'organization', id: 'organization-container' },
    { name: 'footer', id: 'footer-container' }
  ];
  
  // すべてのセクションを並行して読み込み
  await Promise.all(sections.map(section => 
    loadSection(section.name, section.id)
  ));
  
  // セクション読み込み後に応募規約も読み込み
  await loadTerms();
}

// 応募規約を動的に読み込み
async function loadTerms() {
  try {
    const response = await fetch('terms.txt');
    const termsText = await response.text();
    
    // 規約テキストを解析してHTMLに変換
    const termsHtml = parseTermsText(termsText);
    
    // 応募規約セクションの内容を更新
    const termsContent = document.querySelector('.terms-content');
    if (termsContent) {
      termsContent.innerHTML = termsHtml;
    }
  } catch (error) {
    console.error('応募規約の読み込みに失敗しました:', error);
  }
}

// 規約テキストをHTMLに変換する関数
function parseTermsText(text) {
  const lines = text.split('\n');
  let html = '';
  let currentSection = '';
  let inList = false;
  
  lines.forEach(line => {
    line = line.trim();
    
    if (line === '') {
      return; // 空行はスキップ
    }
    
    // タイトル
    if (line.includes('舞鶴若狭道キャッチコピーコンテスト　応募規約') && !line.startsWith('第')) {
      html += `<h3 class="terms-title">${line}</h3>`;
      return;
    }
    
    // 第○条の見出し
    if (line.startsWith('第') && line.includes('条')) {
      if (currentSection) {
        html += '</div>'; // 前のセクションを閉じる
      }
      html += '<div class="terms-article">';
      html += `<h4>${line}</h4>`;
      currentSection = 'article';
      inList = false;
      return;
    }
    
    // 番号付きリスト（1. 2. 3.）
    if (/^\d+\./.test(line)) {
      if (!inList) {
        html += '<div class="terms-list">';
        inList = true;
      }
      html += `<p class="list-item">${line}</p>`;
      return;
    }
    
    // サブリスト項目（・、①、②、③、④）
    if (line.startsWith('　・') || line.startsWith('　①') || line.startsWith('　②') || 
        line.startsWith('　③') || line.startsWith('　④')) {
      html += `<p class="sub-list-item">${line}</p>`;
      return;
    }
    
    // リストが終了した場合
    if (inList && !line.startsWith('　') && !/^\d+\./.test(line)) {
      html += '</div>';
      inList = false;
    }
    
    // 通常のテキスト
    if (line.length > 0) {
      html += `<p class="terms-paragraph">${line}</p>`;
    }
  });
  
  // 最後のセクションを閉じる
  if (inList) {
    html += '</div>';
  }
  if (currentSection) {
    html += '</div>';
  }
  
  return html;
}

// 風景画像スライダーの初期化
function initializeLandscapeSlider() {
  // Swiperが読み込まれているかチェック
  if (typeof Swiper !== 'undefined') {
    const landscapeSwiper = new Swiper('.landscape-swiper', {
      // 基本設定
      loop: true,
      slidesPerView: 1,
      spaceBetween: 0,
      
      // 自動再生設定（3秒間隔）
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      
      // ページネーション設定
      pagination: {
        el: '.landscape-swiper .swiper-pagination',
        type: 'bullets',
        clickable: true,
      },
      
      // エフェクト設定
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      
      // 速度設定
      speed: 800,
    });
  } else {
    // Swiperが読み込まれていない場合は少し待ってから再試行
    setTimeout(initializeLandscapeSlider, 100);
  }
}

// マップ画像スライダーの初期化
function initializeMapSlider() {
  // Swiperが読み込まれているかチェック
  if (typeof Swiper !== 'undefined') {
    const mapSwiper = new Swiper('.map-swiper', {
      // 基本設定
      loop: true,
      slidesPerView: 1,
      spaceBetween: 0,
      
      // 自動再生設定（5秒間隔）
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      
      // ページネーション設定
      pagination: {
        el: '.map-swiper .swiper-pagination',
        type: 'bullets',
        clickable: true,
      },
      
      // エフェクト設定
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      
      // 速度設定
      speed: 800,
    });
  } else {
    // Swiperが読み込まれていない場合は少し待ってから再試行
    setTimeout(initializeMapSlider, 100);
  }
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
  // すべてのセクションを読み込み
  loadAllSections().then(() => {
    // 固定ボタンの初期化
    const fixedButton = document.querySelector('.fixed-apply-button');
    if (fixedButton) {
      fixedButton.style.opacity = '0.8';
      fixedButton.style.visibility = 'visible';
    }
    
    // アイコンを再初期化（動的に追加されたアイコンのため）
    lucide.createIcons();
    
    // 風景画像スライダーの初期化
    setTimeout(initializeLandscapeSlider, 500);
    
    // マップ画像スライダーの初期化
    setTimeout(initializeMapSlider, 600);
  });
});