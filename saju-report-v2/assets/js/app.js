// assets/js/app.js

/**
 * 메인 섹션 (첫 화면)을 렌더링합니다.
 */
function renderMainSection(data, staticData, petName) {
    const container = document.getElementById('section-main');
    if (!container) return;

    const petPersona = data.persona && data.persona.find(p => p.type === 'pet');
    const petImage = petPersona && petPersona.profile_image ? petPersona.profile_image : 'https://via.placeholder.com/300x300?text=Pet+Image';

    container.innerHTML = `
        <div class="main-container">
            <div class="text-center fade-in">
                <h1 id="main-title" class="main-title">
                    ${wrapSpecialCharacters(interpolateTemplate(staticData.main.title_template, { petName }))}
                </h1>
                <div class="title-divider">
                    <div class="divider-line"></div>
                </div>
            </div>

            <div class="main-image-wrapper fade-in delay-200">
                <div id="pet-image-container" class="pet-image-container">
                    <img id="pet-image" src="${petImage}" alt="Pet" class="pet-image">
                    <div class="pet-image-badge">🔍</div>
                </div>
            </div>

            <div class="main-scroll-section">
                <div id="start-report-btn" class="start-btn">
                    <svg class="scroll-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 13l-7 7-7-7m14-8l-7 7-7-7"></path>
                    </svg>
                    <p class="scroll-hint">
                        ${staticData.main.scroll_hint.replace('<br>', ' ')}
                    </p>
                </div>
            </div>
        </div>
    `;
}

/**
 * 인트로 섹션 (도입부)을 렌더링합니다.
 */
function renderIntroSection(data, staticData, petName, ownerName, petPersona, ownerPersona) {
    const container = document.getElementById('section-intro');
    if (!container) return;

    container.className = 'report-section pb-12';
    const formatPersonaInfo = (persona) => persona ? `${persona.birth} (${persona.solar_lunar}) / ${persona.gender}` : '';
    
    container.innerHTML = `
        <div class="safe-area">
            <div class="intro-profile-section">
                <div class="profile-frame">
                    <div class="profile-frame-inner"></div>
                    <img id="pet-profile" src="${staticData.intro.intro_profile || (petPersona && petPersona.profile_image) || 'https://via.placeholder.com/80x80'}" alt="Pet" class="profile-image">
                </div>
                <div class="intro-welcome">
                    <p id="welcome-title" class="welcome-title"><span class="highlight">${wrapSpecialCharacters(staticData.intro.welcome_title)}</span></p>
                    <div id="welcome-msg" class="welcome-message">
                        ${interpolateTemplate(staticData.intro.welcome_msg_template, { petName, ownerName })
                            .split('\n\n')
                            .map((p, i) => `<p class="${i > 0 ? 'welcome-paragraph-spaced' : 'welcome-paragraph'}">${wrapSpecialCharacters(p).replace(/\n/g, '<br>')}</p>`)
                            .join('')}
                    </div>
                </div>
            </div>

            <div class="divider"></div>

            <div class="saju-section">
                <div class="saju-header">
                    <h3 id="pet-saju-title" class="saju-title">${wrapSpecialCharacters(interpolateTemplate(staticData.intro.pet_saju_title_template, { petName }))}</h3>
                    <p id="pet-persona-info" class="saju-info">${formatPersonaInfo(petPersona)}</p>
                </div>
                <div id="pet-saju-grid"></div>
            </div>

            <div class="saju-section">
                <div class="saju-header">
                    <h3 id="owner-saju-title" class="saju-title">${wrapSpecialCharacters(interpolateTemplate(staticData.intro.owner_saju_title_template, { ownerName }))}</h3>
                    <p id="owner-persona-info" class="saju-info">${formatPersonaInfo(ownerPersona)}</p>
                </div>
                <div id="owner-saju-grid"></div>
            </div>

            <div class="chapters-preview">
                <div class="chapters-preview-header">
                    <h3 class="chapters-preview-title">리포트에서 확인 가능한 내용</h3>
                    <button id="toggle-all-btn" class="toggle-all-btn">
                        모두 접기
                    </button>
                </div>
                <div id="chapter-toggles" class="space-y-4"></div>
            </div>
        </div>
    `;

    const petSaju = data.saju && data.saju.find(s => s.type === 'pet');
    const ownerSaju = data.saju && data.saju.find(s => s.type === 'owner');
    
    renderSajuGrid('pet-saju-grid', petSaju);
    renderSajuGrid('owner-saju-grid', ownerSaju);
    renderChapterToggles('chapter-toggles', staticData.chapters, { petName, ownerName }, 'toggle-all-btn', data);
    initToggleAllButton('toggle-all-btn', 'chapter-toggles');
}

/**
 * 챕터 시작 섹션을 렌더링합니다.
 */
function renderChapterStartSection(idx, data, staticData, petName, container) {
    const staticChapter = staticData.chapters[idx];
    
    container.innerHTML = `
        <div class="chapter-start-wrapper">
            <div class="chapter-start-content">
                <div class="chapter-start-orbs">
                    <div class="bg-orb orb-1"></div>
                    <div class="bg-orb orb-2"></div>
                    <div class="bg-orb orb-3"></div>
                </div>
                <div class="chapter-start-inner">
                    <div id="chapter-title-container" class="chapter-title-section">
                        <span class="chapter-number reveal-text">Chapter. ${idx + 1}</span>
                        <span class="chapter-title reveal-text" style="animation-delay: 0.1s;">${wrapSpecialCharacters(staticChapter.title)}</span>
                    </div>
                    <div class="chapter-icon-wrapper reveal-text" style="animation-delay: 0.3s;">
                        <div class="chapter-icon-frame">
                            <img src="${staticChapter.icon}" alt="Chapter Icon" class="chapter-icon">
                        </div>
                    </div>
                    <p class="chapter-question reveal-text" style="animation-delay: 0.5s;">
                        ${wrapSpecialCharacters(interpolateTemplate(staticChapter.questionTemplate, { petName }))}
                    </p>
                </div>
            </div>
        </div>
    `;

    // 챕터 렌더링 이후 추가 동작이 필요한 경우 여기서 처리 (예: 개별 섹션 애니메이션 등록)
}

/**
 * 챕터 설명 섹션을 렌더링합니다.
 */
function renderChapterDescSection(idx, data, staticData, petName, petProfileImg, container) {
    const staticChapter = staticData.chapters[idx];
    const report = data.report_contents && data.report_contents[idx];
    if (!report || !report.reportContent) return;
    
    // v2 형식: reportContent의 각 항목에 있는 question 필드를 사용
    const queries = report.reportContent.map(item => item.question);

    container.innerHTML = `
        <div class="chapter-desc-wrapper">
            <div class="chapter-desc-hero">
                <div class="teller-avatar-wrapper">
                    <img src="${staticChapter.teller_icon}" alt="Teller" class="teller-avatar">
                </div>
                <h3 class="chapter-desc-title">
                    이번 챕터는<br><span class="chapter-desc-highlight">${wrapSpecialCharacters(staticChapter.title)}</span> 이에요
                </h3>
            </div>
            <div class="chapter-overview-section">
                <div class="chapter-overview-card">
                    <p class="chapter-overview-text">
                        ${wrapSpecialCharacters(interpolateTemplate(staticChapter.chapter_overview, { petName }))}
                    </p>
                </div>
            </div>
            <div class="chapter-queries-section">
                <div class="queries-card">
                    <ol class="space-y-4">
                        ${queries.map((qText, qIdx) => `
                            <li class="query-list-item">
                                <span class="query-number">${qIdx + 1}.</span>
                                <span>${wrapSpecialCharacters(interpolateTemplate(qText, { petName }))}</span>
                            </li>
                        `).join('')}
                    </ol>
                    <p class="keywords-suffix">${wrapSpecialCharacters(staticData.chapter_desc.keywords_suffix)}</p>
                </div>
            </div>
            <div class="chapter-analysis-section">
                <h4 class="section-title-with-icon">
                    <span class="title-icon"></span>
                    ${wrapSpecialCharacters(staticData.chapter_desc.analysis_title)}
                </h4>
                <div class="analysis-card">
                    <ul id="analysis-list" class="space-y-4">
                        ${staticChapter.analysis_elements.map(el => `
                            <li>
                                <span>${wrapSpecialCharacters(interpolateTemplate(el, { petName }))}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            <div class="chapter-faq-section">
                <h4 class="section-title-with-icon-flexible">
                    <span class="title-icon-flexible"></span>
                    <span class="section-title-text">${wrapSpecialCharacters(interpolateTemplate(staticData.chapter_desc.faq_title, { petName }))}</span>
                </h4>
                <div class="faq-content-wrapper">
                    <div id="faq-chat-container-${idx}" class="faq-chat-container space-y-6"></div>
                    <div id="faq-options-${idx}" class="faq-options"></div>
                </div>
            </div>
            <div id="common-scroll-footer-${idx}" class="scroll-footer"></div>
        </div>
    `;
    initFaqChat(idx, staticChapter, petName, petProfileImg, staticData);
}

/**
 * 챕터 내용 섹션을 렌더링합니다.
 */
function renderChapterContentSection(idx, data, staticData, petName, container) {
    const report = data.report_contents && data.report_contents[idx];
    if (!report || !report.reportContent) return;

    const staticChapter = staticData.chapters[idx];
    const pageStatic = staticData.chapter_content;
    
    container.innerHTML = `
        <div class="chapter-content-wrapper">
            <div class="chapter-content-inner">
                <div class="score-card glass-card rounded-xl">
                    <div class="score-card-header">
                        <h4 class="score-label">${wrapSpecialCharacters(pageStatic.score_label)}</h4>
                        <span id="chapter-score-${idx}" class="score-value">0점</span>
                    </div>
                    <div class="score-chart-wrapper">
                        <svg viewBox="0 0 100 40" preserveAspectRatio="none" class="score-chart">
                            <path id="bell-curve-bg-${idx}" d="" fill="rgba(0,0,0,0.03)" />
                            <path id="bell-curve-highlight-${idx}" d="" fill="#EF4444" fill-opacity="0.3" />
                            <line x1="0" y1="40" x2="100" y2="40" stroke="#E5E7EB" stroke-width="1" />
                        </svg>
                        <div id="score-pointer-${idx}" class="score-pointer" style="left: 0%; top: 40px; height: 0%; transform: translateX(-50%);">
                            <div class="score-dot"></div>
                        </div>
                    </div>
                    <p id="score-avg-hint-${idx}" class="score-hint">${wrapSpecialCharacters(pageStatic.score_avg_hint).replace('${percentage}', '...')}</p>
                </div>
                <div class="detailed-report-section">
                    <h4 class="detailed-report-title">${wrapSpecialCharacters(pageStatic.detailed_report_title)}</h4>
                    <div id="report-sections-container-${idx}" class="report-content glass-card-gray rounded-xl">
                        ${report.reportContent.map((item, qIdx) => {
                            const queryText = item.question;
                            const contentText = item.explanation;
                            const paragraphs = contentText.split('\n').filter(p => p.trim() !== '');
                            
                            return `
                                <div class="report-query-item">
                                    <h5 class="report-query-title">
                                        <span class="report-query-number">Q${qIdx + 1}.</span>
                                        <span class="report-query-text">${wrapSpecialCharacters(interpolateTemplate(queryText, { petName }))}</span>
                                    </h5>
                                    <div class="content-paragraph">
                                        ${paragraphs.map(p => `<p>${wrapSpecialCharacters(interpolateTemplate(p, { petName }))}</p>`).join('')}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                <div class="lucky-tip glass-card-pink rounded-xl">
                    <div class="lucky-tip-header">
                        <span class="lucky-tip-icon">${report.lucky_tip.icon}</span>
                        <h4 class="lucky-tip-title">${wrapSpecialCharacters(pageStatic.lucky_tip_title)}</h4>
                    </div>
                    <p class="lucky-tip-text">${wrapSpecialCharacters(report.lucky_tip.text)}</p>
                </div>
            </div>
        </div>
    `;
    registerScrollCallback(`section-chapter-content-${idx}`, () => {
        animateScoreChart(idx, report.score, pageStatic.score_avg_hint);
    });
}

// --- 스크롤 애니메이션 시스템 ---

const scrollCallbacks = {};

/**
 * 특정 섹션이 뷰포트에 들어올 때 실행할 콜백을 등록합니다.
 */
function registerScrollCallback(id, callback) {
    scrollCallbacks[id] = { callback, executed: false };
}

/**
 * 특정 ID의 콜백을 강제로 실행합니다. (섹션이 unhide될 때 등)
 */
function triggerScrollCallback(id) {
    if (scrollCallbacks[id] && !scrollCallbacks[id].executed) {
        scrollCallbacks[id].callback();
        scrollCallbacks[id].executed = true;
    }
}

// 전역에서 접근 가능하도록 설정 (components.js 등에서 사용)
window.triggerScrollCallback = triggerScrollCallback;

/**
 * IntersectionObserver를 사용하여 스크롤 애니메이션을 초기화합니다.
 */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (scrollCallbacks[entry.target.id] && !scrollCallbacks[entry.target.id].executed) {
                    scrollCallbacks[entry.target.id].callback();
                    scrollCallbacks[entry.target.id].executed = true;
                }
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.report-section').forEach(el => observer.observe(el));
}

// --- 앱 초기화 ---

document.addEventListener('DOMContentLoaded', async () => {
    // 초기 상태: 스크롤 방지
    document.body.style.overflow = 'hidden';

    // 1. 데이터 로드
    const [data, staticData] = await Promise.all([loadSajuData(), loadStaticData()]);
    if (!data || !staticData) return;

    // 2. 페르소나 추출
    const petPersona = data.persona && data.persona.find(p => p.type === 'pet');
    const ownerPersona = data.persona && data.persona.find(p => p.type === 'owner');
    const petName = petPersona ? petPersona.name : '반려동물';
    const ownerName = ownerPersona ? ownerPersona.name : '보호자';
    const petProfileImg = petPersona ? petPersona.profile_image : 'https://via.placeholder.com/80x80';

    // 3. Main/Intro 섹션 렌더링
    renderMainSection(data, staticData, petName);
    renderIntroSection(data, staticData, petName, ownerName, petPersona, ownerPersona);
    
    // 전역 챕터 탭 초기화
    renderGlobalChapterTabs('global-chapter-tabs', staticData.chapters);

    // --- 리포트 시작 버튼 클릭 이벤트 ---
    const startBtn = document.getElementById('start-report-btn');
    const introSection = document.getElementById('section-intro');
    const chaptersContainer = document.getElementById('chapters-container');
    const footerElement = document.querySelector('footer');

    if (startBtn) {
        startBtn.onclick = () => {
            // 버튼 한 번만 작동하도록
            startBtn.onclick = null;
            
            // 스크롤 허용 및 숨겨진 섹션 표시
            document.body.style.overflow = '';
            if (introSection) introSection.classList.remove('hidden');
            if (chaptersContainer) chaptersContainer.classList.remove('hidden');
            if (footerElement) footerElement.classList.remove('hidden');

            // 렌더링 후 레이아웃이 반영될 시간을 주기 위해 약간의 지연 후 스크롤
            setTimeout(() => {
                if (introSection) {
                    const header = document.getElementById('global-chapter-tabs');
                    const headerHeight = header ? header.offsetHeight : 44;
                    // introSection의 위치를 정확히 다시 계산 (hidden 해제 후)
                    const targetPosition = introSection.getBoundingClientRect().top + window.pageYOffset - headerHeight + 1;
                    animateScrollTo(targetPosition, 1000);
                }
            }, 50);
        };
    }

    // 4. 모든 챕터 렌더링
    if (chaptersContainer) {
        for (let i = 0; i < staticData.chapters.length; i++) {
            const chapterWrapper = document.createElement('div');
            chapterWrapper.className = 'chapter-container';
            chapterWrapper.id = `chapter-wrapper-${i}`;
            
            // Chapter Start
            const startSec = document.createElement('section');
            startSec.id = `section-chapter-start-${i}`;
            startSec.className = 'report-section section-chapter-start';
            chapterWrapper.appendChild(startSec);

            // Chapter Desc
            const descSec = document.createElement('section');
            descSec.id = `section-chapter-desc-${i}`;
            descSec.className = 'report-section section-chapter-desc';
            chapterWrapper.appendChild(descSec);

            // Chapter Content
            const contentSec = document.createElement('section');
            contentSec.id = `section-chapter-content-${i}`;
            contentSec.className = 'report-section section-chapter-content hidden';
            chapterWrapper.appendChild(contentSec);

            chaptersContainer.appendChild(chapterWrapper);

            // 렌더링 실행
            renderChapterStartSection(i, data, staticData, petName, startSec);
            renderChapterDescSection(i, data, staticData, petName, petProfileImg, descSec);
            renderChapterContentSection(i, data, staticData, petName, contentSec);
        }
    }

    const chapterContainers = document.querySelectorAll('.chapter-container');

    // 5. 스크롤 애니메이션 초기화
    initScrollAnimations();

    // 6. 전역 챕터 탭 가시성 제어 (스크롤 위치에 따라)
    const appElement = document.getElementById('app');
    const firstChapterStart = document.getElementById('section-chapter-start-0');
    
    if (appElement && firstChapterStart) {
        const header = document.getElementById('global-chapter-tabs');
        
        window.addEventListener('scroll', () => {
            // 하위 컨텐츠가 아직 활성화되지 않았으면 탭 표시 로직 중단
            if (chaptersContainer && chaptersContainer.classList.contains('hidden')) return;

            const rect = firstChapterStart.getBoundingClientRect();
            const headerHeight = header ? header.offsetHeight : 44;
            
            // 1. 탭 가시성 제어
            if (rect.top <= headerHeight) {
                appElement.classList.add('tabs-visible');
            } else {
                appElement.classList.remove('tabs-visible');
            }

            // 2. 스크롤 스파이 (어떤 챕터가 현재 활성 상태인지 계산)
            if (appElement.classList.contains('tabs-visible')) {
                let currentActiveIdx = 0;
                
                for (let i = 0; i < chapterContainers.length; i++) {
                    const cRect = chapterContainers[i].getBoundingClientRect();
                    // 섹션 상단이 헤더 위치 부근(약간의 오차 허용)에 도달했는지 확인
                    if (cRect.top <= headerHeight + 10) {
                        currentActiveIdx = i;
                    } else {
                        break;
                    }
                }
                updateActiveTab(currentActiveIdx);
            }
        }, { passive: true });
    }
});
