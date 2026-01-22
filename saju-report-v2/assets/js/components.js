/**
 * components.js
 * 재사용 가능한 UI 컴포넌트들을 정의합니다.
 */

/**
 * 만세력 그리드를 렌더링합니다.
 * @param {string} containerId - 그리드를 렌더링할 컨테이너 ID
 * @param {Object} saju - 사주 데이터 객체
 */
function renderSajuGrid(containerId, saju) {
    const container = document.getElementById(containerId);
    if (!container || !saju) return;

    container.innerHTML = ''; // 기존 내용 삭제

    const labels = ['년주', '월주', '일주', '시주'];
    
    // 행 단위로 렌더링 (CSS Grid의 기본 row-major flow 활용)
    // 1. 구분 행
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

    // 2. 천간 행
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

    // 3. 천간 십성 행
    appendRowHeader(container, { text: '십성', isSub: true, class: 'text-saju-grid-white' });
    for (let i = 0; i < 4; i++) {
        const wrapper = document.createElement('div');
        wrapper.className = 'saju-row-item';
        const span = document.createElement('span');
        span.className = 'saju-sub-label text-saju-grid-white';
        span.innerHTML = wrapSpecialCharacters(saju.천간십성[i] || '-');
        wrapper.appendChild(span);
        container.appendChild(wrapper);
    }

    // 4. 지지 행
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

    // 5. 지지 십성 행
    appendRowHeader(container, { text: '십성', isSub: true, class: 'text-saju-grid-white' });
    for (let i = 0; i < 4; i++) {
        const wrapper = document.createElement('div');
        wrapper.className = 'saju-row-item';
        const span = document.createElement('span');
        span.className = 'saju-sub-label text-saju-grid-white';
        span.innerHTML = wrapSpecialCharacters(saju.지지십성[i] || '-');
        wrapper.appendChild(span);
        container.appendChild(wrapper);
    }

    // 6. 12운성 행
    appendRowHeader(container, { text: '12운성', isSub: true, class: 'text-saju-blue' });
    for (let i = 0; i < 4; i++) {
        const wrapper = document.createElement('div');
        wrapper.className = 'saju-row-item';
        const span = document.createElement('span');
        span.className = 'saju-sub-label text-saju-blue';
        span.innerHTML = wrapSpecialCharacters(saju["12운성"][i] || '');
        wrapper.appendChild(span);
        container.appendChild(wrapper);
    }

    // 7. 12신살 행
    appendRowHeader(container, { text: '12신살', isSub: true, class: 'text-saju-red' });
    for (let i = 0; i < 4; i++) {
        const wrapper = document.createElement('div');
        wrapper.className = 'saju-row-item';
        const span = document.createElement('span');
        span.className = 'saju-sub-label text-saju-red';
        span.innerHTML = wrapSpecialCharacters(saju["12신살"][i] || '');
        wrapper.appendChild(span);
        container.appendChild(wrapper);
    }

    // 8. 기타신살 행 (병합)
    appendRowHeader(container, { text: '기타신살', isSub: true, class: 'text-saju-grid-white' });
    const mergedRow = document.createElement('div');
    mergedRow.className = 'saju-merged-row';
    const otherSinsal = saju.기타신살 || [];
    if (otherSinsal.length > 0) {
        otherSinsal.forEach(s => {
            const span = document.createElement('span');
            span.innerHTML = wrapSpecialCharacters(`#${s}`);
            mergedRow.appendChild(span);
        });
    } else {
        mergedRow.innerText = '-';
    }
    container.appendChild(mergedRow);
}

/**
 * 그리드 행 헤더를 추가합니다.
 */
function appendRowHeader(container, h) {
    if (h.isBox) {
        const box = document.createElement('div');
        box.className = 'saju-box-label';
        box.innerHTML = wrapSpecialCharacters(h.text);
        container.appendChild(box);
    } else {
        const wrapper = document.createElement('div');
        wrapper.className = 'saju-row-item';
        const span = document.createElement('span');
        if (h.isLabel) {
            span.className = 'saju-column-label';
            span.style.backgroundColor = 'transparent';
            span.style.color = '#ffffff';
            span.innerHTML = wrapSpecialCharacters(h.text);
        } else if (h.isSub) {
            span.className = `saju-sub-label ${h.class || ''} font-extrabold`;
            span.innerHTML = wrapSpecialCharacters(h.text);
        }
        wrapper.appendChild(span);
        container.appendChild(wrapper);
    }
}

/**
 * 천간/지지 글자에 따른 오행 색상을 반환합니다.
 */
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

/**
 * 전역 챕터 탭(헤더)을 렌더링합니다.
 */
function renderGlobalChapterTabs(containerId, chapters) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = chapters.map((chapter, index) => `
        <div class="chapter-tab-item ${index === 0 ? 'active' : ''}" data-index="${index}">
            ${wrapSpecialCharacters(chapter.title)}
        </div>
    `).join('');

    // 클릭 이벤트 추가
    container.querySelectorAll('.chapter-tab-item').forEach(item => {
        item.onclick = () => {
            const index = item.getAttribute('data-index');
            const target = document.getElementById(`chapter-wrapper-${index}`);
            if (target) {
                // 헤더 높이만큼 오프셋을 주기 위해 scrollIntoView 대신 window.scrollTo 사용 가능
                const headerHeight = container.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight + 1;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        };
    });
}

/**
 * 챕터 탭의 활성 상태를 업데이트합니다.
 */
function updateActiveTab(index) {
    const container = document.getElementById('global-chapter-tabs');
    if (!container) return;

    const tabs = container.querySelectorAll('.chapter-tab-item');
    tabs.forEach((item, i) => {
        if (i == index) {
            item.classList.add('active');
            // 활성 탭이 중앙에 오도록 스크롤
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
            item.classList.remove('active');
        }
    });
}

/**
 * 인트로 섹션의 챕터 토글 리스트를 렌더링합니다.
 */
function renderChapterToggles(containerId, chapters, params, btnId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = ''; // 기존 내용 삭제
    
    chapters.forEach((chapter, idx) => {
        const report = data.report_contents && data.report_contents[idx];
        if (!report || !report.reportContent) return;

        // v2 형식: reportContent의 각 항목에 있는 question 필드를 사용
        const queries = report.reportContent.map(item => item.question);

        const item = document.createElement('div');
        item.className = 'chapter-toggle-item active';
        item.innerHTML = `
            <button class="toggle-header">
                <div class="toggle-header-left">
                    <img src="${chapter.icon}" alt="${chapter.title}" class="toggle-icon">
                    <span class="toggle-title">${wrapSpecialCharacters(chapter.title)}</span>
                </div>
                <svg class="toggle-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            <div class="toggle-content">
                <div class="query-list">
                    ${queries.map(qText => `
                        <div class="query-item">
                            <span class="query-bullet">Q.</span>
                            <span>${wrapSpecialCharacters(interpolateTemplate(qText, params))}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        container.appendChild(item);
        const header = item.querySelector('.toggle-header');
        header.onclick = () => {
            item.classList.toggle('active');
            if (btnId) updateToggleAllButtonText(btnId, containerId);
        };
    });
}

/**
 * 모든 토글의 상태를 확인하여 "모두 펼치기/접기" 버튼 텍스트를 업데이트합니다.
 */
function updateToggleAllButtonText(btnId, containerId) {
    const btn = document.getElementById(btnId);
    const container = document.getElementById(containerId);
    if (!btn || !container) return;

    const items = container.querySelectorAll('.chapter-toggle-item');
    const allActive = Array.from(items).every(item => item.classList.contains('active'));
    btn.innerText = allActive ? '모두 접기' : '모두 펼치기';
}

/**
 * "모두 펼치기/접기" 버튼 이벤트를 초기화합니다.
 */
function initToggleAllButton(btnId, containerId) {
    const btn = document.getElementById(btnId);
    const container = document.getElementById(containerId);
    if (!btn || !container) return;
    
    btn.onclick = () => {
        const items = container.querySelectorAll('.chapter-toggle-item');
        const allActive = Array.from(items).every(item => item.classList.contains('active'));
        items.forEach(item => allActive ? item.classList.remove('active') : item.classList.add('active'));
        updateToggleAllButtonText(btnId, containerId);
    };
}

/**
 * 정규분포 점수 차트 애니메이션을 실행합니다.
 */
function animateScoreChart(idx, score, hintTemplate) {
    const bgPath = document.getElementById(`bell-curve-bg-${idx}`);
    const highlightPath = document.getElementById(`bell-curve-highlight-${idx}`);
    const pointer = document.getElementById(`score-pointer-${idx}`);
    const hintText = document.getElementById(`score-avg-hint-${idx}`);
    const scoreText = document.getElementById(`chapter-score-${idx}`);
    
    if (!bgPath || !highlightPath || !pointer || !hintText || !scoreText) return;

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
        
        if (pointer) pointer.style.left = Math.max(0, Math.min(100, currentScore)) + '%';
        if (pointer) pointer.style.top = yPercent + '%';
        if (pointer) pointer.style.height = (100 - yPercent) + '%';
        if (highlightPath) highlightPath.style.clipPath = `inset(0 0 0 ${Math.max(0, Math.min(100, currentScore))}%)`;
        if (scoreText) scoreText.innerText = Math.max(0, Math.round(currentScore)) + '점';
        
        const topPercent = (1 - cdf(currentZ)) * 100;
        const topStr = topPercent < 0.1 ? "0.1%" : (topPercent > 99.9 ? "99.9%" : topPercent.toFixed(1) + "%");
        if (hintText) hintText.innerHTML = wrapSpecialCharacters(hintTemplate.replace('${percentage}', topStr));
        
        if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
}

/**
 * 특정 위치로 부드럽게 스크롤합니다. (속도 조절 가능)
 */
function animateScrollTo(targetPosition, duration = 800) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTimestamp = null;

    function step(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const ease = progress < 0.5 
            ? 4 * progress * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        window.scrollTo(0, startPosition + distance * ease);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    }
    window.requestAnimationFrame(step);
}

/**
 * FAQ 채팅 시스템을 초기화합니다.
 */
function initFaqChat(idx, staticChapter, petName, petProfileImg, staticData) {
    const container = document.getElementById(`faq-chat-container-${idx}`);
    const optionsContainer = document.getElementById(`faq-options-${idx}`);
    if (!container || !optionsContainer) return;

    // 초기 상태 설정
    container.innerHTML = `<div class="faq-placeholder">궁금한 점을 물어보세요</div>`;

    const faqs = staticChapter.faqs || [];
    let remainingFaqs = [...faqs];
    let isEndBtnActive = true;
    let isTyping = false;
    
    function renderOptions() {
        optionsContainer.innerHTML = '';
        
        remainingFaqs.forEach(faq => {
            const btn = document.createElement('button');
            btn.className = 'faq-question-btn';
            btn.innerHTML = wrapSpecialCharacters(interpolateTemplate(faq.question, { petName }));
            btn.onclick = () => handleFaqClick(faq);
            optionsContainer.appendChild(btn);
        });
        
        if (isEndBtnActive) {
            const endBtn = document.createElement('button');
            endBtn.className = 'faq-question-btn border-red-200 text-red-500 font-bold bg-red-50/50';
            endBtn.innerHTML = wrapSpecialCharacters(staticData.chapter_desc.faq_end_btn || "더 궁금한 점이 없어요");
            endBtn.onclick = () => {
                if (isTyping) return;
                isEndBtnActive = false;
                renderOptions();
                
                const contentSec = document.getElementById(`section-chapter-content-${idx}`);
                if (contentSec) {
                    contentSec.classList.remove('hidden');
                    
                    // 섹션이 나타날 때 점수 차트 애니메이션 등이 즉시 실행되도록 트리거
                    if (window.triggerScrollCallback) {
                        window.triggerScrollCallback(contentSec.id);
                    }
                    
                    setTimeout(() => {
                        const header = document.getElementById('global-chapter-tabs');
                        const headerHeight = header ? header.offsetHeight : 44;
                        const targetPosition = contentSec.getBoundingClientRect().top + window.pageYOffset - headerHeight + 1;
                        
                        animateScrollTo(targetPosition, 1000); // 1000ms로 더 천천히 이동
                    }, 100);
                }
            };
            optionsContainer.appendChild(endBtn);
        }
    }

    async function handleFaqClick(selectedFaq) {
        if (isTyping) return;
        isTyping = true;

        optionsContainer.style.pointerEvents = 'none';
        optionsContainer.style.opacity = '0.6';

        remainingFaqs = remainingFaqs.filter(f => f !== selectedFaq);
        renderOptions();

        if (container.querySelector('.faq-placeholder')) {
            container.innerHTML = '';
            container.classList.add('has-content');
        }
        
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
        
        isTyping = false;
        optionsContainer.style.pointerEvents = 'auto';
        optionsContainer.style.opacity = '1';
    }

    renderOptions();
}

/**
 * 타이핑 효과를 적용합니다.
 */
async function typeEffect(el, text, speed = 20) {
    el.innerHTML = '';
    // HTML 태그가 포함될 수 있으므로 wrapSpecialCharacters를 먼저 적용하고 태그 단위로 처리하거나,
    // 간단하게 전체를 먼저 감싸고 한 글자씩 렌더링하는 대신 innerHTML을 사용하여 태그가 깨지지 않게 함
    const wrappedText = wrapSpecialCharacters(text);
    
    // 단순 글자 단위 타이핑을 위해 임시 요소 생성
    const temp = document.createElement('div');
    temp.innerHTML = wrappedText;
    
    // 텍스트 노드와 요소를 구분하여 순차적으로 출력
    const nodes = Array.from(temp.childNodes);
    for (const node of nodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            for (const char of node.textContent) {
                el.innerHTML += char;
                await new Promise(r => setTimeout(r, speed));
            }
        } else {
            // span 등 태그인 경우 통째로 추가 (한자는 즉시 나타남)
            el.appendChild(node.cloneNode(true));
            await new Promise(r => setTimeout(r, speed * 2));
        }
    }
}
