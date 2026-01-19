// assets/js/total_report.js

document.addEventListener('DOMContentLoaded', async () => {
    // 1. 데이터 로드
    const [data, staticData] = await Promise.all([loadSajuData(), loadStaticData()]);
    if (!data || !staticData) return;

    const petPersona = data.persona.find(p => p.type === 'pet');
    const ownerPersona = data.persona.find(p => p.type === 'owner');
    const petName = petPersona ? petPersona.name : '반려동물';
    const ownerName = ownerPersona ? ownerPersona.name : '보호자';
    const petProfileImg = petPersona ? petPersona.profile_image : 'https://via.placeholder.com/80x80';

    // 2. Main 섹션 렌더링
    renderMainSection(data, staticData, petName);

    // 3. Intro 섹션 렌더링
    renderIntroSection(data, staticData, petName, ownerName, petPersona, ownerPersona);

    // 4. 모든 챕터 렌더링
    const chaptersContainer = document.getElementById('chapters-container');
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
        contentSec.className = 'report-section section-chapter-content';
        chapterWrapper.appendChild(contentSec);

        chaptersContainer.appendChild(chapterWrapper);

        // 렌더링 실행
        renderChapterStartSection(i, data, staticData, petName, startSec);
        renderChapterDescSection(i, data, staticData, petName, petProfileImg, descSec);
        renderChapterContentSection(i, data, staticData, petName, contentSec);
    }

    // 5. Scroll Animations (Intersection Observer)
    initScrollAnimations();
});

// --- Helper: Render Tabs ---
function getTabsHTML(currentIndex, chapters) {
    let tabs = '';
    chapters.forEach((chapter, index) => {
        tabs += `
            <div class="flex-1 py-2 text-center text-sm font-bold border-b-2 ${
                index == currentIndex ? 'border-red-500 text-red-500' : 'border-transparent text-gray-400'
            }">
                ${chapter.title}
            </div>
        `;
    });
    return `<div class="chapter-tabs flex border-b bg-white sticky top-0 z-10">${tabs}</div>`;
}

// --- Rendering Functions ---

function renderMainSection(data, staticData, petName) {
    const container = document.getElementById('section-main');
    const petPersona = data.persona.find(p => p.type === 'pet');
    const petImage = petPersona && petPersona.profile_image ? petPersona.profile_image : 'https://via.placeholder.com/300x300?text=Pet+Image';

    // Standardized padding: px-5 (20px)
    container.innerHTML = `
        <div class="flex flex-col items-center justify-between py-12 px-5 overflow-hidden min-h-screen">
            <div class="text-center fade-in">
                <h1 id="main-title" class="text-2xl font-bold leading-tight">
                    ${interpolateTemplate(staticData.main.title_template, { petName })}
                </h1>
                <div class="mt-4 flex justify-center">
                    <div class="w-12 h-1 bg-black rounded-full"></div>
                </div>
            </div>

            <div class="flex-1 flex items-center justify-center fade-in delay-200">
                <div id="pet-image-container" class="relative">
                    <img id="pet-image" src="${petImage}" alt="Pet" class="w-64 h-64 object-cover rounded-full shadow-lg border-4 border-white">
                    <div class="absolute -top-4 -left-4 w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center text-2xl">🔍</div>
                </div>
            </div>

            <div class="w-full text-center pb-8">
                <div class="animate-bounce cursor-pointer flex flex-col items-center">
                    <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 13l-7 7-7-7m14-8l-7 7-7-7"></path>
                    </svg>
                    <p class="scroll-hint text-xs font-bold text-red-500 mt-2 uppercase tracking-widest">
                        ${staticData.main.scroll_hint.replace('<br>', ' ')}
                    </p>
                </div>
            </div>
        </div>
    `;
}

function renderIntroSection(data, staticData, petName, ownerName, petPersona, ownerPersona) {
    const container = document.getElementById('section-intro');
    container.className = 'report-section pb-12';
    const formatPersonaInfo = (persona) => `${persona.birth} (${persona.solar_lunar}) / ${persona.gender}`;
    
    // safe-area (20px) is used. Grids and titles align with 20px.
    container.innerHTML = `
        <div class="safe-area">
            <div class="flex flex-col items-center mt-8">
                <img id="pet-profile" src="${petPersona.profile_image || 'https://via.placeholder.com/80x80'}" alt="Pet" class="w-20 h-20 rounded-full border-2 border-gray-200 shadow-sm">
                <div class="mt-4 text-center">
                    <p id="welcome-title" class="text-lg font-bold">${staticData.intro.welcome_title}</p>
                    <p id="welcome-msg" class="text-sm text-gray-600 mt-1">
                        ${interpolateTemplate(staticData.intro.welcome_msg_template, { petName, ownerName }).replace(/\n/g, '<br>')}
                    </p>
                </div>
            </div>

            <hr class="my-8 border-gray-100">

            <div class="mb-10">
                <div class="text-center mb-4">
                    <h3 id="pet-saju-title" class="font-bold text-lg">${interpolateTemplate(staticData.intro.pet_saju_title_template, { petName })}</h3>
                    <p id="pet-persona-info" class="text-[11px] text-gray-400 mt-1">${formatPersonaInfo(petPersona)}</p>
                </div>
                <div id="pet-saju-grid" class="grid grid-cols-5 gap-1 p-2 rounded-xl"></div>
            </div>

            <div class="mb-10">
                <div class="text-center mb-4">
                    <h3 id="owner-saju-title" class="font-bold text-lg">${interpolateTemplate(staticData.intro.owner_saju_title_template, { ownerName })}</h3>
                    <p id="owner-persona-info" class="text-[11px] text-gray-400 mt-1">${formatPersonaInfo(ownerPersona)}</p>
                </div>
                <div id="owner-saju-grid" class="grid grid-cols-5 gap-1 p-2 rounded-xl"></div>
            </div>

            <div class="mb-12">
                <div class="flex justify-between items-center mb-4 px-0">
                    <h3 class="font-bold text-lg text-gray-800">리포트에서 확인 가능한 내용</h3>
                    <button id="toggle-all-btn" class="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors">
                        모두 접기
                    </button>
                </div>
                <div id="chapter-toggles" class="space-y-3"></div>
            </div>
        </div>
    `;

    const petSaju = data.saju.find(s => s.type === 'pet');
    const ownerSaju = data.saju.find(s => s.type === 'owner');
    renderSajuGrid('pet-saju-grid', petSaju);
    renderSajuGrid('owner-saju-grid', ownerSaju);
    renderChapterTogglesInIntro(staticData.chapters, { petName, ownerName });

    const toggleAllBtn = document.getElementById('toggle-all-btn');
    if (toggleAllBtn) {
        toggleAllBtn.onclick = () => {
            const items = document.querySelectorAll('.chapter-toggle-item');
            const allActive = Array.from(items).every(item => item.classList.contains('active'));
            items.forEach(item => allActive ? item.classList.remove('active') : item.classList.add('active'));
            toggleAllBtn.innerText = allActive ? '모두 펼치기' : '모두 접기';
        };
    }
}

function renderChapterTogglesInIntro(chapters, params) {
    const container = document.getElementById('chapter-toggles');
    if (!container) return;
    chapters.forEach(chapter => {
        const item = document.createElement('div');
        item.className = 'chapter-toggle-item active';
        item.innerHTML = `
            <button class="toggle-header">
                <div class="toggle-header-left">
                    <img src="${chapter.icon}" alt="${chapter.title}" class="toggle-icon">
                    <span class="toggle-title">${chapter.title}</span>
                </div>
                <svg class="toggle-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            <div class="toggle-content">
                <div class="query-list">
                    ${chapter.desc_queries.map(q => `
                        <div class="query-item">
                            <span class="query-bullet">Q.</span>
                            <span>${interpolateTemplate(q.template, params)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        container.appendChild(item);
        const header = item.querySelector('.toggle-header');
        header.onclick = () => item.classList.toggle('active');
    });
}

function renderChapterStartSection(idx, data, staticData, petName, container) {
    const staticChapter = staticData.chapters[idx];
    // Standardized padding: px-5 (20px) instead of p-8
    container.innerHTML = `
        <div class="flex flex-col">
            ${getTabsHTML(idx, staticData.chapters)}
            <div class="flex-1 flex flex-col items-center justify-center px-5 py-12 text-center relative overflow-hidden bg-white">
                <div class="absolute inset-0 pointer-events-none z-0">
                    <div class="bg-orb orb-1"></div>
                    <div class="bg-orb orb-2"></div>
                    <div class="bg-orb orb-3"></div>
                </div>
                <div class="fade-in flex flex-col items-center relative z-10">
                    <div id="chapter-title-container" class="flex flex-col items-center mb-12 relative z-10">
                        <span class="text-lg font-bold text-red-400 mb-4 uppercase tracking-[0.3em] reveal-text">Chapter. ${idx + 1}</span>
                        <span class="text-5xl font-black text-gray-900 reveal-text" style="animation-delay: 0.1s;">${staticChapter.title}</span>
                    </div>
                    <div class="relative mb-12 z-10 reveal-text" style="animation-delay: 0.3s;">
                        <div class="w-48 h-48 rounded-full bg-white shadow-xl flex items-center justify-center overflow-hidden border-4 border-red-100">
                            <img src="${staticChapter.teller_icon}" alt="Chapter Teller" class="w-full h-full object-cover">
                        </div>
                    </div>
                    <p class="text-2xl font-medium leading-relaxed text-gray-700 z-10 reveal-text" style="animation-delay: 0.5s;">
                        ${interpolateTemplate(staticChapter.questionTemplate, { petName })}
                    </p>
                </div>
            </div>
            <div class="px-5 py-8 text-center bg-white">
                <button class="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors">
                    ${staticData.chapter_content.next_btn || '알아보기'}
                </button>
            </div>
        </div>
    `;
}

function renderChapterDescSection(idx, data, staticData, petName, petProfileImg, container) {
    const staticChapter = staticData.chapters[idx];
    // Removed safe-area from outer div to control padding precisely
    // Using px-5 (20px) to match other sections
    container.innerHTML = `
        <div class="flex flex-col bg-gray-50/30">
            ${getTabsHTML(idx, staticData.chapters)}
            <div class="hero-section flex flex-col items-center pt-12 pb-14 px-5 bg-white border-b border-gray-50">
                <div class="relative mb-8">
                    <img src="${staticChapter.teller_icon}" alt="Teller" class="w-40 h-40 rounded-full border-4 border-white shadow-xl bg-gray-50">
                    <div class="absolute -bottom-2 -right-2 bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-md tracking-wider">TELLER</div>
                </div>
                <h3 class="text-2xl font-black text-center leading-tight">
                    이번 챕터는<br><span class="text-red-500">${staticChapter.title}</span> 이에요
                </h3>
            </div>
            <div class="px-5 -mt-6">
                <div class="bg-white rounded-3xl p-5 shadow-xl shadow-gray-200/50 border border-gray-50 relative z-10">
                    <p class="text-gray-600 text-center leading-relaxed font-medium text-sm">
                        ${interpolateTemplate(staticChapter.chapter_overview, { petName })}
                    </p>
                </div>
            </div>
            <div class="mt-10 px-5">
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <ol class="space-y-4">
                        ${staticChapter.desc_queries.map((q, qIdx) => `
                            <li class="text-lg font-bold flex items-start">
                                <span class="query-number">${qIdx + 1}.</span>
                                <span>${interpolateTemplate(q.template, { petName })}</span>
                            </li>
                        `).join('')}
                    </ol>
                    <p class="mt-6 font-bold text-gray-700">${staticData.chapter_desc.keywords_suffix}</p>
                </div>
            </div>
            <div class="mt-10 px-5">
                <h4 class="text-xl font-black text-gray-900 mb-6 flex items-center">
                    <span class="w-1.5 h-6 bg-red-500 rounded-full mr-3"></span>
                    ${staticData.chapter_desc.analysis_title}
                </h4>
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <ul class="space-y-4">
                        ${staticChapter.analysis_elements.map(el => `
                            <li class="flex items-start font-medium text-gray-600 text-sm">
                                <span>${interpolateTemplate(el, { petName })}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            <div class="mt-12 mb-12">
                <h4 class="px-5 text-xl font-black text-gray-900 mb-6 flex items-start">
                    <span class="w-1.5 h-6 bg-red-500 rounded-full mr-3 mt-1 shrink-0"></span>
                    <span class="flex-1">${interpolateTemplate(staticData.chapter_desc.faq_title, { petName })}</span>
                </h4>
                <div class="px-5">
                    <div id="faq-chat-container-${idx}" class="space-y-6"></div>
                    <div id="faq-options-${idx}" class="mt-8 space-y-3 px-0"></div>
                </div>
            </div>
            <div id="common-scroll-footer-${idx}" class="px-5 pb-12"></div>
        </div>
    `;
    initChapterFaq(idx, staticChapter, petName, petProfileImg, staticData);
}

function renderChapterContentSection(idx, data, staticData, petName, container) {
    const report = data.report_contents[idx];
    const staticChapter = staticData.chapters[idx];
    const pageStatic = staticData.chapter_content;
    
    // Standardized padding: px-5 (20px)
    container.innerHTML = `
        <div class="flex flex-col">
            ${getTabsHTML(idx, staticData.chapters)}
            <div class="px-5 pb-12 bg-white">
                <div class="mt-8 glass-card rounded-3xl px-5 py-6 mb-8">
                    <div class="flex items-center justify-between mb-4">
                        <h4 class="font-bold text-gray-800">${pageStatic.score_label}</h4>
                        <span id="chapter-score-${idx}" class="text-3xl font-black text-red-500">0점</span>
                    </div>
                    <div class="relative h-32 mt-4 mb-2 px-1">
                        <svg viewBox="0 0 100 40" preserveAspectRatio="none" class="w-full h-full overflow-visible">
                            <path id="bell-curve-bg-${idx}" d="" fill="rgba(0,0,0,0.03)" />
                            <path id="bell-curve-highlight-${idx}" d="" fill="#EF4444" fill-opacity="0.3" />
                            <line x1="0" y1="40" x2="100" y2="40" stroke="#E5E7EB" stroke-width="1" />
                        </svg>
                        <div id="score-pointer-${idx}" class="absolute w-0.5 bg-red-500 z-10 origin-bottom" style="left: 0%; top: 40px; height: 0%; transform: translateX(-50%);">
                            <div class="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
                        </div>
                    </div>
                    <p id="score-avg-hint-${idx}" class="text-center text-sm font-bold text-gray-800 mt-4">상위 ...% 수준입니다.</p>
                </div>
                <div class="mb-6">
                    <h4 class="font-black text-xl text-gray-900 mb-6">${pageStatic.detailed_report_title}</h4>
                    <div id="report-sections-container-${idx}" class="glass-card-gray rounded-3xl px-5 py-10 space-y-24">
                        ${report.reportContent.map((item, qIdx) => {
                            const staticQuery = staticChapter.desc_queries.find(q => q.query_id === item.query_id);
                            const queryText = interpolateTemplate(staticQuery ? staticQuery.template : '', { petName });
                            const paragraphs = item.content.split('\n').filter(p => p.trim() !== '');
                            return `
                                <div class="sub-query-item">
                                    <h5 class="text-lg font-bold text-gray-800 mb-4 flex items-start">
                                        <span class="text-red-500 mr-2 flex-shrink-0">Q${qIdx + 1}.</span>
                                        <span class="flex-1">${queryText}</span>
                                    </h5>
                                    <div class="text-gray-600 leading-relaxed font-medium content-paragraph">
                                        ${paragraphs.map(p => `<p>${p}</p>`).join('')}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                <div class="glass-card-pink rounded-3xl px-5 py-6 mb-12 mt-12">
                    <div class="flex items-center mb-4">
                        <span class="text-3xl mr-3">${report.lucky_tip.icon}</span>
                        <h4 class="font-bold text-pink-800 text-lg">${pageStatic.lucky_tip_title}</h4>
                    </div>
                    <p class="text-pink-900 leading-relaxed font-medium">${report.lucky_tip.text}</p>
                </div>
                <div class="flex gap-4">
                    <button class="flex-1 py-4 bg-gray-100 text-gray-500 rounded-xl font-bold hover:bg-gray-200 transition-colors">${pageStatic.prev_btn}</button>
                    <button class="flex-[2] py-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors">
                        ${idx < data.report_contents.length - 1 ? pageStatic.next_chapter_btn : pageStatic.last_chapter_btn}
                    </button>
                </div>
            </div>
        </div>
    `;
    registerScrollCallback(`section-chapter-content-${idx}`, () => {
        updateChapterScoreChart(idx, report.score, pageStatic.score_avg_hint);
    });
}

// --- Utils ---

function renderSajuGrid(containerId, saju) {
    const container = document.getElementById(containerId);
    if (!container || !saju) return;
    container.innerHTML = '';
    const labels = ['년주', '월주', '일주', '시주'];
    appendRowHeader(container, { text: '구분', isLabel: true });
    for (let i = 0; i < 4; i++) {
        const wrapper = document.createElement('div');
        wrapper.className = 'saju-row-item';
        const span = document.createElement('span');
        span.className = 'saju-column-label';
        span.innerText = labels[i];
        wrapper.appendChild(span);
        container.appendChild(wrapper);
    }
    appendRowHeader(container, { text: '천간', isBox: true });
    for (let i = 0; i < 4; i++) {
        const stemBox = document.createElement('div');
        stemBox.className = 'saju-box';
        const stemColor = getOhaengColor(saju.천간[i]);
        const stemImg = document.createElement('img');
        stemImg.src = `assets/img/manse-card/천간/${saju.천간[i]}.png`;
        stemImg.alt = saju.천간[i];
        stemImg.style.backgroundColor = stemColor;
        stemBox.appendChild(stemImg);
        container.appendChild(stemBox);
    }
    appendRowHeader(container, { text: '십성', isSub: true, class: 'text-saju-black' });
    for (let i = 0; i < 4; i++) {
        const wrapper = document.createElement('div');
        wrapper.className = 'saju-row-item';
        const span = document.createElement('span');
        span.className = 'saju-sub-label text-saju-black';
        span.innerText = saju.천간십성[i] || '-';
        wrapper.appendChild(span);
        container.appendChild(wrapper);
    }
    appendRowHeader(container, { text: '지지', isBox: true });
    for (let i = 0; i < 4; i++) {
        const branchBox = document.createElement('div');
        branchBox.className = 'saju-box';
        const branchColor = getOhaengColor(saju.지지[i]);
        const branchImg = document.createElement('img');
        branchImg.src = `assets/img/manse-card/지지/${saju.지지[i]}.png`;
        branchImg.alt = saju.지지[i];
        branchImg.style.backgroundColor = branchColor;
        branchBox.appendChild(branchImg);
        container.appendChild(branchBox);
    }
    appendRowHeader(container, { text: '십성', isSub: true, class: 'text-saju-black' });
    for (let i = 0; i < 4; i++) {
        const wrapper = document.createElement('div');
        wrapper.className = 'saju-row-item';
        const span = document.createElement('span');
        span.className = 'saju-sub-label text-saju-black';
        span.innerText = saju.지지십성[i] || '-';
        wrapper.appendChild(span);
        container.appendChild(wrapper);
    }
    appendRowHeader(container, { text: '12운성', isSub: true, class: 'text-saju-blue' });
    for (let i = 0; i < 4; i++) {
        const wrapper = document.createElement('div');
        wrapper.className = 'saju-row-item';
        const span = document.createElement('span');
        span.className = 'saju-sub-label text-saju-blue';
        span.innerText = saju["12운성"][i] || '';
        wrapper.appendChild(span);
        container.appendChild(wrapper);
    }
    appendRowHeader(container, { text: '12신살', isSub: true, class: 'text-saju-red' });
    for (let i = 0; i < 4; i++) {
        const wrapper = document.createElement('div');
        wrapper.className = 'saju-row-item';
        const span = document.createElement('span');
        span.className = 'saju-sub-label text-saju-red';
        span.innerText = saju["12신살"][i] || '';
        wrapper.appendChild(span);
        container.appendChild(wrapper);
    }
    appendRowHeader(container, { text: '기타신살', isSub: true, class: 'text-saju-black' });
    const mergedRow = document.createElement('div');
    mergedRow.className = 'saju-merged-row';
    const otherSinsal = saju.기타신살 || [];
    if (otherSinsal.length > 0) {
        otherSinsal.forEach(s => {
            const span = document.createElement('span');
            span.innerText = `#${s}`;
            mergedRow.appendChild(span);
        });
    } else {
        mergedRow.innerText = '-';
    }
    container.appendChild(mergedRow);
}

function appendRowHeader(container, h) {
    if (h.isBox) {
        const box = document.createElement('div');
        box.className = 'saju-box-label';
        box.innerText = h.text;
        container.appendChild(box);
    } else {
        const wrapper = document.createElement('div');
        wrapper.className = 'saju-row-item';
        const span = document.createElement('span');
        if (h.isLabel) {
            span.className = 'saju-column-label';
            span.style.backgroundColor = 'transparent';
            span.style.color = '#ffffff';
            span.innerText = h.text;
        } else if (h.isSub) {
            span.className = `saju-sub-label ${h.class || ''} font-extrabold`;
            span.innerText = h.text;
        }
        wrapper.appendChild(span);
        container.appendChild(wrapper);
    }
}

function getOhaengColor(char) {
    const wood = ['갑', '을', '인', '묘'];
    const fire = ['병', '정', '사', '오'];
    const earth = ['무', '기', '진', '술', '축', '미'];
    const metal = ['경', '신', '유'];
    const water = ['임', '계', '해', '자'];
    if (wood.includes(char)) return '#4CAF50';
    if (fire.includes(char)) return '#F44336';
    if (earth.includes(char)) return '#FFC107';
    if (metal.includes(char)) return '#B0B0B0';
    if (water.includes(char)) return '#42A5F5';
    return '#48484A';
}

const scrollCallbacks = {};
function registerScrollCallback(id, callback) {
    scrollCallbacks[id] = { callback, executed: false };
}

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

function updateChapterScoreChart(idx, score, hintTemplate) {
    const bgPath = document.getElementById(`bell-curve-bg-${idx}`);
    const highlightPath = document.getElementById(`bell-curve-highlight-${idx}`);
    const pointer = document.getElementById(`score-pointer-${idx}`);
    const hintText = document.getElementById(`score-avg-hint-${idx}`);
    const scoreText = document.getElementById(`chapter-score-${idx}`);
    if (!bgPath) return;
    const zScore = (s) => (s - 50) / 50 * 2.5;
    const pdf = (z) => (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z);
    const cdf = (z) => 1 / (1 + Math.exp(-1.702 * z));
    const maxPdf = pdf(0);
    const yScale = 35 / maxPdf;
    const points = [];
    for (let i = 0; i <= 100; i++) {
        const x = i;
        const z = zScore(x);
        const y = 40 - (pdf(z) * yScale);
        points.push(`${x},${y.toFixed(2)}`);
    }
    const d = `M 0,40 L ${points.join(' L ')} L 100,40 Z`;
    bgPath.setAttribute('d', d);
    highlightPath.setAttribute('d', d);
    let startTimestamp = null;
    const duration = 1500;
    const animate = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentScore = -10 + (score + 10) * easedProgress;
        const currentZ = zScore(currentScore);
        const pdfValue = pdf(currentZ);
        const yPercent = ((40 - (pdfValue * yScale)) / 40) * 100;
        pointer.style.left = Math.max(0, Math.min(100, currentScore)) + '%';
        pointer.style.top = yPercent + '%';
        pointer.style.height = (100 - yPercent) + '%';
        highlightPath.style.clipPath = `inset(0 0 0 ${Math.max(0, Math.min(100, currentScore))}%)`;
        scoreText.innerText = Math.max(0, Math.round(currentScore)) + '점';
        const topPercent = (1 - cdf(currentZ)) * 100;
        const topStr = topPercent < 0.1 ? "0.1%" : (topPercent > 99.9 ? "99.9%" : topPercent.toFixed(1) + "%");
        hintText.innerHTML = hintTemplate.replace('${percentage}', `<span class="highlight">${topStr}</span>`);
        if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
}

function initChapterFaq(idx, staticChapter, petName, petProfileImg, staticData) {
    const container = document.getElementById(`faq-chat-container-${idx}`);
    const optionsContainer = document.getElementById(`faq-options-${idx}`);
    const faqs = staticChapter.faqs || [];
    let remainingFaqs = [...faqs];
    
    function renderOptions() {
        optionsContainer.innerHTML = '';
        remainingFaqs.forEach(faq => {
            const btn = document.createElement('button');
            btn.className = 'faq-question-btn';
            btn.innerText = interpolateTemplate(faq.question, { petName });
            btn.onclick = () => handleFaqClick(faq);
            optionsContainer.appendChild(btn);
        });
        const endBtn = document.createElement('button');
        endBtn.className = 'faq-question-btn border-red-200 text-red-500 font-bold bg-red-50/50';
        endBtn.innerText = "더 궁금한 점이 없어요";
        endBtn.onclick = () => {
            optionsContainer.innerHTML = '';
            const footerHolder = document.getElementById(`common-scroll-footer-${idx}`);
            if (footerHolder) {
                footerHolder.innerHTML = `
                    <div class="common-scroll-footer-content mt-12 text-center pb-12">
                        <p class="footer-message text-lg font-bold mb-6">${staticData.chapter_desc.footer_msg}</p>
                        <div class="animate-bounce flex flex-col items-center">
                            <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 13l-7 7-7-7m14-8l-7 7-7-7"></path>
                            </svg>
                            <p class="scroll-hint text-xs font-bold text-red-500 mt-2 uppercase tracking-widest">${staticData.chapter_desc.scroll_hint}</p>
                        </div>
                    </div>
                `;
            }
        };
        optionsContainer.appendChild(endBtn);
    }
    async function handleFaqClick(selectedFaq) {
        optionsContainer.innerHTML = '';
        remainingFaqs = remainingFaqs.filter(f => f !== selectedFaq);
        const qDiv = document.createElement('div');
        qDiv.className = 'chat-item';
        qDiv.innerHTML = `
            <div class="question-wrapper bubble-pop">
                <div class="chat-avatar"><img src="${petProfileImg}"></div>
                <div class="chat-bubble question"></div>
            </div>
        `;
        container.appendChild(qDiv);
        await typeEffect(qDiv.querySelector('.chat-bubble'), interpolateTemplate(selectedFaq.question, { petName }));
        const aDiv = document.createElement('div');
        aDiv.className = 'chat-item';
        aDiv.innerHTML = `
            <div class="answer-wrapper bubble-pop">
                <div class="chat-avatar"><img src="${staticChapter.teller_icon}"></div>
                <div class="chat-bubble answer"></div>
            </div>
        `;
        container.appendChild(aDiv);
        await typeEffect(aDiv.querySelector('.chat-bubble'), interpolateTemplate(selectedFaq.answer, { petName }));
        renderOptions();
    }
    async function typeEffect(el, text) {
        el.innerText = '';
        for (const char of text) {
            el.innerText += char;
            await new Promise(r => setTimeout(r, 20));
        }
    }
    renderOptions();
}
