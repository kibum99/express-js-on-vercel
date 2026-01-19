// assets/js/intro.js
document.addEventListener('DOMContentLoaded', async () => {
    const [data, staticData] = await Promise.all([loadSajuData(), loadStaticData()]);
    if (!data || !staticData) return;

    const petPersona = data.persona.find(p => p.type === 'pet');
    const ownerPersona = data.persona.find(p => p.type === 'owner');

    if (!petPersona || !ownerPersona) return;

    const petName = petPersona.name;
    const ownerName = ownerPersona.name;

    // 정적 데이터 및 템플릿 주입
    document.getElementById('welcome-title').innerHTML = staticData.intro.welcome_title;
    document.getElementById('welcome-msg').innerHTML = interpolateTemplate(staticData.intro.welcome_msg_template, { petName, ownerName }).replace(/\n/g, '<br>');
    
    document.getElementById('pet-saju-title').innerHTML = interpolateTemplate(staticData.intro.pet_saju_title_template, { petName });
    document.getElementById('owner-saju-title').innerHTML = interpolateTemplate(staticData.intro.owner_saju_title_template, { ownerName });

    // 챕터 토글 렌더링
    renderChapterToggles(staticData.chapters, { petName, ownerName });

    // 이름 및 페르소나 정보 업데이트
    document.querySelectorAll('.pet-name').forEach(el => el.innerText = petName);
    document.querySelectorAll('.owner-name').forEach(el => el.innerText = ownerName);
    
    const formatPersonaInfo = (persona) => {
        return `${persona.birth} (${persona.solar_lunar}) / ${persona.gender}`;
    };

    document.getElementById('pet-persona-info').innerText = formatPersonaInfo(petPersona);
    document.getElementById('owner-persona-info').innerText = formatPersonaInfo(ownerPersona);

    if (petPersona.profile_image) {
        document.getElementById('pet-profile').src = petPersona.profile_image;
    }

    // 만세력 그리드 렌더링
    const petSaju = data.saju.find(s => s.type === 'pet');
    const ownerSaju = data.saju.find(s => s.type === 'owner');
    
    renderSajuGrid('pet-saju-grid', petSaju);
    renderSajuGrid('owner-saju-grid', ownerSaju);

    // 공통 스크롤 전환 초기화
    initScrollTransition('chapter_start.html', { chapter: 0 }, {
        scrollHint: staticData.intro.next_btn
    });
});

/**
 * 챕터 토글 리스트를 렌더링하고 관련 이벤트를 설정합니다.
 */
function renderChapterToggles(chapters, params) {
    const container = document.getElementById('chapter-toggles');
    const toggleAllBtn = document.getElementById('toggle-all-btn');
    if (!container || !chapters) return;

    container.innerHTML = '';

    chapters.forEach(chapter => {
        const item = document.createElement('div');
        item.className = 'chapter-toggle-item active'; // 초기 상태를 active로 설정
        
        // 헤더 생성
        const header = document.createElement('button');
        header.className = 'toggle-header';
        header.innerHTML = `
            <div class="toggle-header-left">
                <img src="${chapter.icon}" alt="${chapter.title}" class="toggle-icon">
                <span class="toggle-title">${chapter.title}</span>
            </div>
            <svg class="toggle-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="19 9l-7 7-7-7"></path>
            </svg>
        `;

        // 컨텐츠 생성
        const content = document.createElement('div');
        content.className = 'toggle-content';
        
        const queryList = document.createElement('div');
        queryList.className = 'query-list';
        
        chapter.desc_queries.forEach(q => {
            const queryItem = document.createElement('div');
            queryItem.className = 'query-item';
            const interpolatedText = interpolateTemplate(q.template, params);
            queryItem.innerHTML = `
                <span class="query-bullet">Q.</span>
                <span>${interpolatedText}</span>
            `;
            queryList.appendChild(queryItem);
        });

        content.appendChild(queryList);
        item.appendChild(header);
        item.appendChild(content);
        container.appendChild(item);

        // 개별 토글 이벤트
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            item.classList.toggle('active');
            updateToggleAllBtnState();
        });
    });

    // 초기 버튼 상태 설정
    updateToggleAllBtnState();

    // 모두 펼치기/접기 버튼 이벤트
    if (toggleAllBtn) {
        toggleAllBtn.addEventListener('click', () => {
            const items = container.querySelectorAll('.chapter-toggle-item');
            const allActive = Array.from(items).every(item => item.classList.contains('active'));
            
            items.forEach(item => {
                if (allActive) {
                    item.classList.remove('active');
                } else {
                    item.classList.add('active');
                }
            });
            
            updateToggleAllBtnState();
        });
    }

    // 버튼 상태 업데이트 함수
    function updateToggleAllBtnState() {
        if (!toggleAllBtn) return;
        const items = container.querySelectorAll('.chapter-toggle-item');
        const allActive = Array.from(items).every(item => item.classList.contains('active'));
        
        toggleAllBtn.innerText = allActive ? '모두 접기' : '모두 펼치기';
    }
}

function renderSajuGrid(containerId, saju) {
    const container = document.getElementById(containerId);
    if (!container || !saju) return;

    container.innerHTML = ''; // Clear previous content

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

    // 6. 12운성 행
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

    // 7. 12신살 행
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

    // 8. 기타신살 행 (병합)
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

    if (wood.includes(char)) return '#4CAF50'; // Green
    if (fire.includes(char)) return '#F44336'; // Red
    if (earth.includes(char)) return '#FFC107'; // Yellow
    if (metal.includes(char)) return '#B0B0B0'; // Light Gray for dark mode
    if (water.includes(char)) return '#42A5F5'; // Lighter Blue for dark mode
    return '#48484A'; // Default Dark Gray
}
