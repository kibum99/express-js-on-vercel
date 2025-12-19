/**
 * 사주 분석 카드 렌더링 애플리케이션 (WebView용)
 * 기능: 프로필 정보, 사주 그리드, 리포트 카드 렌더링 및 카러셀 인터랙션
 * 데이터는 React Native에서 주입받아 렌더링합니다.
 */

// ============================================================================
// CONFIG: 모든 상수 정의
// ============================================================================
const CONFIG = {
    // 천간과 오행 매핑
    CHEONGAN_TO_ELEMENT: {
        '갑': '목', '을': '목',
        '병': '화', '정': '화',
        '무': '토', '기': '토',
        '경': '금', '신': '금',
        '임': '수', '계': '수'
    },

    // 지지와 오행 매핑
    JIJI_TO_ELEMENT: {
        '자': '수', '해': '수',
        '인': '목', '묘': '목',
        '사': '화', '오': '화',
        '신': '금', '유': '금',
        '진': '토', '술': '토', '축': '토', '미': '토'
    },

    // 오행 색상 및 라벨 매핑 (CSS Variable 연동)
    ELEMENT_CONFIG: {
        '목': { label: '나무', color: 'var(--color-wood)', char: '🌲' },
        '화': { label: '불', color: 'var(--color-fire)', char: '🔥' },
        '토': { label: '흙', color: 'var(--color-earth)', char: '⛰️' },
        '금': { label: '쇠', color: 'var(--color-metal)', char: '⚔️' },
        '수': { label: '물', color: 'var(--color-water)', char: '💧' }
    },
    
    // 이미지 경로 매핑
    IMAGE_PATHS: {
        CHEONGAN: {
            '갑': 'images/강아지/천간/갑.png', '을': 'images/강아지/천간/을.png',
            '병': 'images/강아지/천간/병.png', '정': 'images/강아지/천간/정.png',
            '무': 'images/강아지/천간/무.png', '기': 'images/강아지/천간/기.png',
            '경': 'images/강아지/천간/경.png', '신': 'images/강아지/천간/신.png',
            '임': 'images/강아지/천간/임.png', '계': 'images/강아지/천간/계.png'
        },
        JIJI: {
            '자': 'images/강아지/지지/자.png', '축': 'images/강아지/지지/축.png',
            '인': 'images/강아지/지지/인.png', '묘': 'images/강아지/지지/묘.png',
            '진': 'images/강아지/지지/진.png', '사': 'images/강아지/지지/사.png',
            '오': 'images/강아지/지지/오.png', '미': 'images/강아지/지지/미.png',
            '신': 'images/강아지/지지/신.png', '유': 'images/강아지/지지/유.png',
            '술': 'images/강아지/지지/술.png', '해': 'images/강아지/지지/해.png'
        }
    },
    
    // 카러셀 설정
    CAROUSEL: {
        SCROLL_PADDING: 24,
        OBSERVER_THRESHOLD: 0.6
    },
    
    // 기둥 라벨
    PILLAR_LABELS: ['생년<br>(Year)', '생월<br>(Month)', '생일<br>(Day)', '생시<br>(Hour)'],
    
    // 오행 순서
    ELEMENTS_ORDER: ['목', '화', '토', '금', '수']
};

// ============================================================================
// 유틸리티 함수
// ============================================================================

/**
 * 이미지 경로 디코딩
 * @param {string} path - 디코딩할 경로
 * @returns {string} 디코딩된 경로
 */
function decodePath(path) {
    if (!path) return '';
    try {
        return decodeURIComponent(path);
    } catch (e) {
        return path;
    }
}

/**
 * 안전한 DOM 요소 생성 헬퍼
 * @param {string} tag - 태그명
 * @param {Object} attributes - 속성 객체
 * @param {...Node|string} children - 자식 요소들
 * @returns {HTMLElement} 생성된 요소
 */
function createElement(tag, attributes = {}, ...children) {
    const element = document.createElement(tag);
    
    // 속성 설정
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'textContent') {
            element.textContent = value;
        } else if (key === 'innerHTML') {
            element.innerHTML = value;
        } else if (key.startsWith('on')) {
            element[key] = value;
        } else {
            element.setAttribute(key, value);
        }
    });
    
    // 자식 요소 추가
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
            element.appendChild(child);
        }
    });
    
    return element;
}

/**
 * 여러 자식 요소를 한 번에 추가
 * @param {HTMLElement} parent - 부모 요소
 * @param {...Node|string} children - 자식 요소들
 */
function appendChildren(parent, ...children) {
    children.forEach(child => {
        if (typeof child === 'string') {
            parent.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
            parent.appendChild(child);
        }
    });
}

/**
 * RN으로 메시지 전송 (ACK/ERROR)
 * @param {string} type - 메시지 타입 ('ACK' | 'ERROR')
 * @param {string} id - 요청 ID (선택)
 * @param {string} message - 에러 메시지 (선택)
 */
function sendToRN(type, id, message) {
    const payload = { type, id, message, timestamp: Date.now() };
    const messageStr = JSON.stringify(payload);
    
    // React Native WebView의 postMessage API 사용
    if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(messageStr);
    } else {
        // 폴백: 일반 window.postMessage (디버깅용)
        console.log('[WebView Message]', payload);
    }
}

/**
 * 데이터 검증
 * @param {Object} data - 검증할 데이터 객체
 * @returns {boolean} 유효성 여부
 */
function validateData(data) {
    if (!data) {
        console.error('데이터가 없습니다.');
        return false;
    }
    
    if (!data.persona) {
        console.error('persona 데이터가 없습니다.');
        return false;
    }
    
    if (!data.report_contents || !Array.isArray(data.report_contents) || data.report_contents.length === 0) {
        console.error('report_contents 데이터가 없거나 비어있습니다.');
        return false;
    }
    
    return true;
}

/**
 * 모드 감지 (compatibility mode)
 * @param {Object} data - 데이터 객체
 * @returns {boolean} compatibility mode 여부
 */
function detectCompatibilityMode(data) {
    if (!data) {
        console.warn('detectCompatibilityMode: data가 없습니다.');
        return false;
    }
    
    const isCompatibilityMode = data.mode === '궁합' || 
                                 (Array.isArray(data.persona) && data.persona.length === 2);
    
    // 디버깅 로그
    if (isCompatibilityMode) {
        console.log('Compatibility 모드 감지:', {
            mode: data.mode,
            personaLength: Array.isArray(data.persona) ? data.persona.length : 0
        });
    }
    
    return isCompatibilityMode;
}

/**
 * 데이터로 렌더링 실행
 * @param {Object} data - 렌더링할 데이터 객체
 * @param {string} requestId - 요청 ID (선택, ACK 전송용)
 */
function renderWithData(data, requestId) {
    try {
        // 데이터 검증
        if (!validateData(data)) {
            throw new Error('데이터 검증 실패');
        }
        
        const isCompatibilityMode = detectCompatibilityMode(data);
        
        // 디버깅 로그
        console.log('렌더링 모드:', {
            isCompatibilityMode,
            mode: data.mode,
            personaType: Array.isArray(data.persona) ? 'array' : typeof data.persona,
            personaLength: Array.isArray(data.persona) ? data.persona.length : 1
        });

        // 헤더 렌더링
        renderHeader(data.persona, isCompatibilityMode);
        
        // 사주 그리드 렌더링
        if (data.saju) {
            renderSajuGrid(data.saju, data.persona, isCompatibilityMode);
        } else {
            console.warn('saju 데이터가 없습니다.');
        }
        
        // 상세 리포트 카드 렌더링
        const track = document.getElementById('carousel-track');
        if (track && data.report_contents) {
            renderReportCards(data.report_contents, isCompatibilityMode);
        }
        
        // 성공 ACK 전송
        if (requestId) {
            sendToRN('ACK', requestId);
        }
    } catch (error) {
        console.error('렌더링 중 오류 발생:', error);
        
        // 에러 메시지 표시
        const headerContainer = document.querySelector('.app-header');
        if (headerContainer) {
            headerContainer.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #ff4444;">
                    <p>페이지를 렌더링하는 중 오류가 발생했습니다.</p>
                    <p style="font-size: 0.9em; color: #888;">${error.message}</p>
                </div>
            `;
        }
        
        // 에러 ACK 전송
        if (requestId) {
            sendToRN('ERROR', requestId, error.message);
        }
    }
}

// ============================================================================
// ReportApp API: React Native에서 호출할 수 있는 공식 API
// ============================================================================

window.ReportApp = (function () {
    let started = false;
    let lastData = null;

    /**
     * 데이터로 렌더링 시작
     * @param {Object} data - 리포트 데이터
     */
    function start(data) {
        if (!validateData(data)) {
            throw new Error('INVALID_DATA');
        }
        
        lastData = data;
        renderWithData(data);
        started = true;
    }

    /**
     * 데이터 업데이트 (완전 재렌더)
     * @param {Object} data - 새로운 리포트 데이터
     */
    function update(data) {
        start(data);
    }

    /**
     * 현재 상태 조회
     * @returns {{started: boolean, lastData: Object|null}}
     */
    function getState() {
        return { started, lastData };
    }

    return { start, update, getState };
})();

// ============================================================================
// RN↔웹 메시지 프로토콜 핸들러
// ============================================================================

/**
 * RN에서 온 메시지 처리
 * @param {string|Object} raw - 원본 메시지 (문자열 또는 객체)
 */
function handleMessage(raw) {
    let msg = raw;
    
    // 문자열인 경우 파싱 시도
    if (typeof raw === 'string') {
        try {
            msg = JSON.parse(raw);
        } catch (e) {
            console.error('메시지 파싱 실패:', e);
            return;
        }
    }
    
    // 메시지 타입별 처리
    if (msg.type === 'INIT_REPORT') {
        try {
            window.ReportApp.start(msg.payload);
            // ACK 전송
            if (msg.id) {
                sendToRN('ACK', msg.id);
            }
        } catch (error) {
            console.error('INIT_REPORT 처리 실패:', error);
            if (msg.id) {
                sendToRN('ERROR', msg.id, error.message);
            }
        }
    } else if (msg.type === 'UPDATE_REPORT') {
        try {
            window.ReportApp.update(msg.payload);
            // ACK 전송
            if (msg.id) {
                sendToRN('ACK', msg.id);
            }
        } catch (error) {
            console.error('UPDATE_REPORT 처리 실패:', error);
            if (msg.id) {
                sendToRN('ERROR', msg.id, error.message);
            }
        }
    } else {
        console.warn('알 수 없는 메시지 타입:', msg.type);
    }
}

// iOS/Android 모두 지원: 두 가지 이벤트 리스너 등록
document.addEventListener('message', (e) => handleMessage(e.data)); // Android 계열
window.addEventListener('message', (e) => {
    // 일반 브라우저의 postMessage와 구분하기 위해 origin 체크 (선택)
    // WebView에서는 보통 origin이 없거나 특정 값이므로, 일단 모두 처리
    if (e.data && (typeof e.data === 'string' || typeof e.data === 'object')) {
        handleMessage(e.data);
    }
});

// ============================================================================
// 헤더 렌더링
// ============================================================================

/**
 * 아바타 요소 생성
 * @param {Object} person - 사람 정보 객체
 * @returns {HTMLElement} 아바타 요소
 */
function createAvatarElement(person) {
    const avatarWrapper = createElement('div', { className: 'couple-avatar' });
    
    if (person.profile_image) {
        const img = createElement('img', {
            src: person.profile_image,
            alt: person.name,
            onerror: function() { this.style.display = 'none'; }
        });
        avatarWrapper.appendChild(img);
    } else {
        const initial = person.name.charAt(0);
        const defaultAvatar = createElement('div', { className: 'default-avatar', textContent: initial });
        avatarWrapper.appendChild(defaultAvatar);
    }
    
    return avatarWrapper;
}

/**
 * 싱글 모드 헤더 생성
 * @param {Object} persona - 프로필 정보
 * @returns {HTMLElement} 헤더 컨테이너
 */
function createSingleHeader(persona) {
    // 데이터 검증
    if (!persona) {
        console.error('Single 헤더 생성 실패: persona 객체가 없습니다.');
        throw new Error('프로필 정보가 없습니다.');
    }
    
    const container = createElement('div', { className: 'profile-container' });
    
    const avatar = createElement('div', { className: 'profile-avatar' });
    const img = createElement('img', {
        src: persona.profile_image || '',
        alt: persona.name || '프로필 이미지',
        id: 'profile-picture',
        onerror: function() { this.style.display = 'none'; }
    });
    avatar.appendChild(img);
    
    const details = createElement('div', { className: 'profile-details' });
    const name = createElement('h1', { id: 'pet-name', textContent: persona.name || '이름 없음' });
    
    const meta = createElement('div', { className: 'profile-meta' });
    const birthDate = createElement('span', { 
        id: 'birth-date', 
        textContent: `${persona.birth || '생년월일 없음'} ${persona.solar_lunar ? `(${persona.solar_lunar})` : ''}`.trim()
    });
    const divider = createElement('span', { className: 'divider', textContent: '|' });
    const gender = createElement('span', { id: 'gender', textContent: persona.gender || '성별 없음' });
    
    appendChildren(meta, birthDate, divider, gender);
    appendChildren(details, name, meta);
    appendChildren(container, avatar, details);
    
    return container;
}

/**
 * 커플 모드 헤더 생성
 * @param {Array<Object>} personas - 프로필 정보 배열
 * @returns {HTMLElement} 헤더 컨테이너
 */
function createCoupleHeader(personas) {
    // 데이터 검증
    if (!Array.isArray(personas) || personas.length < 2) {
        console.error('커플 헤더 생성 실패: personas 배열이 올바르지 않습니다.', personas);
        throw new Error('커플 모드에는 2명의 프로필이 필요합니다.');
    }
    
    const [personA, personB] = personas;
    
    // 각 persona 객체 검증
    if (!personA || !personB) {
        console.error('커플 헤더 생성 실패: persona 객체가 없습니다.', { personA, personB });
        throw new Error('프로필 정보가 올바르지 않습니다.');
    }
    
    const container = createElement('div', { className: 'couple-header-container' });
    
    // Person A (왼쪽): 아바타 + 이름 (이름이 아바타 오른쪽에)
    const wrapperA = createElement('div', { className: 'couple-avatar-wrapper couple-avatar-wrapper-left' });
    wrapperA.appendChild(createAvatarElement(personA));
    const nameA = createElement('span', { className: 'couple-name', textContent: personA.name || '이름 없음' });
    wrapperA.appendChild(nameA);
    
    // Heart connector
    const heart = createElement('div', { className: 'connector-heart', textContent: '💖' });
    
    // Person B (오른쪽): 이름 + 아바타 (이름이 아바타 왼쪽에)
    const wrapperB = createElement('div', { className: 'couple-avatar-wrapper couple-avatar-wrapper-right' });
    const nameB = createElement('span', { className: 'couple-name', textContent: personB.name || '이름 없음' });
    wrapperB.appendChild(nameB);
    wrapperB.appendChild(createAvatarElement(personB));
    
    appendChildren(container, wrapperA, heart, wrapperB);
    
    return container;
}

/**
 * 헤더 렌더링 분기 처리
 * @param {Object|Array} personaData - 프로필 데이터
 * @param {boolean} isCompatibilityMode - compatibility mode 여부
 */
function renderHeader(personaData, isCompatibilityMode) {
    try {
        const headerContainer = document.querySelector('.app-header');
        if (!headerContainer) {
            console.error('헤더 컨테이너를 찾을 수 없습니다.');
            return;
        }
        
        // 데이터 검증
        if (!personaData) {
            console.error('personaData가 없습니다.');
            headerContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #ff4444;">프로필 데이터가 없습니다.</div>';
            return;
        }
        
        // Compatibility 모드일 때 배열 검증
        if (isCompatibilityMode) {
            if (!Array.isArray(personaData)) {
                console.error('Compatibility 모드인데 personaData가 배열이 아닙니다.', personaData);
                headerContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #ff4444;">프로필 데이터 형식이 올바르지 않습니다.</div>';
                return;
            }
            if (personaData.length < 2) {
                console.warn('Compatibility 모드인데 personaData가 2개 미만입니다. Single 모드로 전환합니다.', personaData);
                // Single 모드로 전환
                const headerElement = createSingleHeader(personaData[0] || personaData);
                headerContainer.innerHTML = '';
                headerContainer.appendChild(headerElement);
                return;
            }
        }
        
        headerContainer.innerHTML = '';
        
        const headerElement = isCompatibilityMode 
            ? createCoupleHeader(personaData)
            : createSingleHeader(Array.isArray(personaData) ? personaData[0] : personaData);
        
        headerContainer.appendChild(headerElement);
    } catch (error) {
        console.error('헤더 렌더링 중 오류 발생:', error);
        const headerContainer = document.querySelector('.app-header');
        if (headerContainer) {
            headerContainer.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #ff4444;">
                    <p>헤더 렌더링 중 오류가 발생했습니다.</p>
                    <p style="font-size: 0.9em; color: #888;">${error.message}</p>
                </div>
            `;
        }
    }
}

// ============================================================================
// 사주 그리드 렌더링
// ============================================================================

/**
 * 오행 분포 계산
 * @param {Object} saju - 사주 데이터
 * @returns {{counts: Object, total: number}} 오행 분포 정보
 */
function calculateElementDistribution(saju) {
    const counts = { '목': 0, '화': 0, '토': 0, '금': 0, '수': 0 };
    let total = 0;

    // 천간 분석
    saju.천간.forEach(char => {
        const elem = CONFIG.CHEONGAN_TO_ELEMENT[char];
        if (elem) {
            counts[elem]++;
            total++;
        }
    });

    // 지지 분석
    saju.지지.forEach(char => {
        const elem = CONFIG.JIJI_TO_ELEMENT[char];
        if (elem) {
            counts[elem]++;
            total++;
        }
    });

    return { counts, total };
}

/**
 * 기둥 컬럼 생성
 * @param {Object} saju - 사주 데이터
 * @param {number} index - 기둥 인덱스
 * @returns {HTMLElement} 기둥 컬럼 요소
 */
function createPillarColumn(saju, index) {
    const column = createElement('div', { className: 'pillar-column' });
    
    const header = createElement('div', { className: 'pillar-header', innerHTML: CONFIG.PILLAR_LABELS[index] });
    column.appendChild(header);
    
    const cheongan = saju.천간[index];
    const jiji = saju.지지[index];
    
    // 천간
    const cheonganBox = createElement('div', { className: 'element-box' });
    const cheonganImgSrc = CONFIG.IMAGE_PATHS.CHEONGAN[cheongan] 
        ? decodePath(CONFIG.IMAGE_PATHS.CHEONGAN[cheongan]) 
        : '';
    if (cheonganImgSrc) {
        const cheonganImg = createElement('img', {
            src: cheonganImgSrc,
            alt: cheongan,
            className: 'element-icon',
            onerror: function() { this.style.display = 'none'; }
        });
        cheonganBox.appendChild(cheonganImg);
    }
    const cheonganBadge = createElement('div', { 
        className: 'info-badge main', 
        textContent: saju.천간십성[index] || '-' 
    });
    cheonganBox.appendChild(cheonganBadge);
    column.appendChild(cheonganBox);
    
    // 지지
    const jijiBox = createElement('div', { className: 'element-box', style: 'margin-top:8px;' });
    const jijiImgSrc = CONFIG.IMAGE_PATHS.JIJI[jiji] 
        ? decodePath(CONFIG.IMAGE_PATHS.JIJI[jiji]) 
        : '';
    if (jijiImgSrc) {
        const jijiImg = createElement('img', {
            src: jijiImgSrc,
            alt: jiji,
            className: 'element-icon',
            onerror: function() { this.style.display = 'none'; }
        });
        jijiBox.appendChild(jijiImg);
    }
    const jijiBadge = createElement('div', { 
        className: 'info-badge main', 
        textContent: saju.지지십성[index] || '-' 
    });
    jijiBox.appendChild(jijiBadge);
    column.appendChild(jijiBox);
    
    // 신살/운성
    const badgesContainer = createElement('div', { 
        style: 'margin-top: 8px; width: 100%; display: flex; flex-direction: column; gap: 2px;' 
    });
    const woonsungBadge = createElement('div', { 
        className: 'info-badge', 
        textContent: saju['12운성'][index] || '-' 
    });
    const shinsalBadge = createElement('div', { 
        className: 'info-badge', 
        textContent: saju['12신살'][index] || '-' 
    });
    appendChildren(badgesContainer, woonsungBadge, shinsalBadge);
    column.appendChild(badgesContainer);
    
    return column;
}

/**
 * 오행 차트 생성
 * @param {Object} counts - 오행 카운트 객체
 * @param {number} total - 전체 개수
 * @returns {HTMLElement} 차트 컨테이너
 */
function createElementChart(counts, total) {
    const container = createElement('div', { className: 'elements-chart-container animate-in delay-2' });
    
    CONFIG.ELEMENTS_ORDER.forEach(elem => {
        const count = counts[elem];
        const percentage = total > 0 ? (count / total) * 100 : 0;
        const config = CONFIG.ELEMENT_CONFIG[elem];
        
        const row = createElement('div', { className: 'chart-row' });
        
        const label = createElement('div', { className: 'element-label' });
        const charSpan = createElement('span', { textContent: config.char + ' ' });
        label.appendChild(charSpan);
        label.appendChild(document.createTextNode(config.label));
        
        const barBg = createElement('div', { className: 'element-bar-bg' });
        const barFill = createElement('div', { 
            className: 'element-bar-fill',
            style: `width: ${percentage}%; background-color: ${config.color};`
        });
        barBg.appendChild(barFill);
        
        const value = createElement('div', { className: 'element-value', textContent: count.toString() });
        
        appendChildren(row, label, barBg, value);
        container.appendChild(row);
    });
    
    return container;
}

/**
 * 사주 카드 프로필 정보 생성
 * @param {Object} persona - 프로필 정보
 * @returns {HTMLElement} 프로필 정보 요소
 */
function createSajuCardProfileInfo(persona) {
    const container = createElement('div', { className: 'saju-card-profile-info animate-in delay-1' });
    
    const name = createElement('div', { className: 'saju-profile-name', textContent: persona.name });
    const meta = createElement('div', { className: 'saju-profile-meta' });
    
    const birth = createElement('span', { textContent: `${persona.birth} (${persona.solar_lunar})` });
    const divider = createElement('span', { textContent: '|' });
    const gender = createElement('span', { textContent: persona.gender });
    
    appendChildren(meta, birth, divider, gender);
    appendChildren(container, name, meta);
    
    return container;
}

/**
 * 사주 대시보드 카드 생성
 * @param {Object} saju - 사주 데이터
 * @param {Object} persona - 프로필 정보
 * @param {boolean} isCompatibilityMode - compatibility mode 여부
 * @returns {HTMLElement} 대시보드 카드 요소
 */
function createDashboardCard(saju, persona, isCompatibilityMode) {
    const card = createElement('div', { className: 'content-card' });
    const wrapper = createElement('div', { className: 'card-content-wrapper' });
    
    // 헤더 섹션
    const headerSection = createElement('div', { className: 'card-header-section animate-in' });
    const badgeText = `사주 팔자 분석 ${isCompatibilityMode ? `(${persona.name})` : ''}`;
    const badge = createElement('div', { className: 'chapter-badge', textContent: badgeText });
    headerSection.appendChild(badge);
    wrapper.appendChild(headerSection);
    
    // 커플 모드일 경우 프로필 정보 추가
    if (isCompatibilityMode) {
        wrapper.appendChild(createSajuCardProfileInfo(persona));
    }
    
    // 기둥 섹션
    const pillarsTitle = createElement('div', { className: 'dashboard-title animate-in delay-1', textContent: '타고난 기운 (4 Pillars)' });
    wrapper.appendChild(pillarsTitle);
    
    const pillarsContainer = createElement('div', { className: 'pillars-container animate-in delay-1' });
    for (let i = 0; i < 4; i++) {
        pillarsContainer.appendChild(createPillarColumn(saju, i));
    }
    wrapper.appendChild(pillarsContainer);
    
    // 오행 분포 섹션
    const { counts, total } = calculateElementDistribution(saju);
    const elementsTitle = createElement('div', { className: 'dashboard-title animate-in delay-2', textContent: '오행 분포 (5 Elements)' });
    wrapper.appendChild(elementsTitle);
    wrapper.appendChild(createElementChart(counts, total));
    
    card.appendChild(wrapper);
    return card;
}

/**
 * 사주 그리드 렌더링
 * @param {Object|Array} sajuData - 사주 데이터
 * @param {Object|Array} personaData - 프로필 데이터
 * @param {boolean} isCompatibilityMode - compatibility mode 여부
 */
function renderSajuGrid(sajuData, personaData, isCompatibilityMode) {
    try {
        const track = document.getElementById('carousel-track');
        if (!track) {
            console.error('카러셀 트랙을 찾을 수 없습니다.');
            return;
        }
        
        track.innerHTML = ''; 

        // 배열로 통일하여 처리
        const sajuList = Array.isArray(sajuData) ? sajuData : [sajuData];
        const personaList = Array.isArray(personaData) ? personaData : [personaData];

        sajuList.forEach((saju, index) => {
            const persona = personaList[index] || {};
            const card = createDashboardCard(saju, persona, isCompatibilityMode);
            track.appendChild(card);
        });
    } catch (error) {
        console.error('사주 그리드 렌더링 중 오류 발생:', error);
    }
}

// ============================================================================
// 리포트 카드 렌더링
// ============================================================================

/**
 * 점수 게이지 생성
 * @param {number} score - 점수 (0-100)
 * @returns {HTMLElement} 게이지 컨테이너
 */
function createScoreGauge(score) {
    const container = createElement('div', { className: 'score-gauge-container animate-in delay-1' });
    
    const labelBad = createElement('div', { className: 'gauge-label', textContent: 'Bad' });
    const track = createElement('div', { className: 'gauge-track' });
    const fill = createElement('div', { className: 'gauge-fill', style: `width: ${score}%` });
    track.appendChild(fill);
    const labelGood = createElement('div', { className: 'gauge-label', textContent: 'Good' });
    
    appendChildren(container, labelBad, track, labelGood);
    return container;
}

/**
 * 키워드 태그 생성
 * @param {Array<string>} keywords - 키워드 배열
 * @returns {HTMLElement} 키워드 컨테이너
 */
function createKeywords(keywords) {
    if (!keywords || keywords.length === 0) return null;
    
    const container = createElement('div', { className: 'keywords-container animate-in delay-1' });
    keywords.forEach(tag => {
        const pill = createElement('span', { className: 'keyword-pill', textContent: tag });
        container.appendChild(pill);
    });
    
    return container;
}

/**
 * 럭키 팁 생성
 * @param {Object} luckyTips - 럭키 팁 데이터
 * @returns {HTMLElement|null} 럭키 팁 박스
 */
function createLuckyTip(luckyTips) {
    if (!luckyTips) return null;
    
    const box = createElement('div', { className: 'lucky-tip-box animate-in delay-4' });
    const icon = createElement('div', { className: 'lucky-icon', textContent: '🍀' });
    const content = createElement('div', { className: 'lucky-content' });
    
    const title = createElement('div', { className: 'lucky-title', textContent: 'LUCKY TIP' });
    content.appendChild(title);
    
    const text = createElement('div', { className: 'lucky-text' });
    
    // input_v2.json 구조: { icon, text }
    if (luckyTips.icon) {
        icon.textContent = luckyTips.icon;
    }
    if (luckyTips.text) {
        text.textContent = luckyTips.text;
    }
    
    content.appendChild(text);
    appendChildren(box, icon, content);
    
    return box;
}

/**
 * 리포트 카드 생성
 * @param {Object} content - 리포트 내용 객체
 * @returns {HTMLElement} 리포트 카드 요소
 */
function createReportCard(content) {
    const card = createElement('div', { className: 'content-card' });
    const wrapper = createElement('div', { className: 'card-content-wrapper' });
    
    // 헤더 섹션
    const headerSection = createElement('div', { className: 'card-header-section animate-in' });
    const badge = createElement('div', { className: 'chapter-badge', textContent: content.chapterTitle });
    headerSection.appendChild(badge);
    
    if (content.score) {
        headerSection.appendChild(createScoreGauge(content.score));
    }
    
    const keywords = createKeywords(content.keywords);
    if (keywords) {
        headerSection.appendChild(keywords);
    }
    
    wrapper.appendChild(headerSection);
    
    // 개요 박스
    const overviewBox = createElement('div', { className: 'card-overview-box animate-in delay-2' });
    const overviewText = createElement('div', { className: 'overview-text', textContent: content.reportOverview });
    overviewBox.appendChild(overviewText);
    wrapper.appendChild(overviewBox);
    
    // 본문
    const bodyText = createElement('div', { className: 'card-body-text animate-in delay-3' });
    bodyText.innerHTML = content.reportContent.replace(/\n/g, '<br>');
    wrapper.appendChild(bodyText);
    
    // 럭키 팁
    const luckyTip = createLuckyTip(content.lucky_tips || content.lucky_tip);
    if (luckyTip) {
        wrapper.appendChild(luckyTip);
    }
    
    card.appendChild(wrapper);
    return card;
}

/**
 * 리포트 카드 렌더링
 * @param {Array<Object>} reportContents - 리포트 내용 배열
 * @param {boolean} isCompatibilityMode - compatibility mode 여부
 */
function renderReportCards(reportContents, isCompatibilityMode) {
    try {
        const track = document.getElementById('carousel-track');
        const indicatorContainer = document.getElementById('carousel-indicators');
        
        if (!track || !indicatorContainer || !reportContents) {
            console.error('필수 요소를 찾을 수 없습니다.');
            return;
        }

        // 인디케이터 초기화
        indicatorContainer.innerHTML = '';
        
        // 대시보드 카드 수만큼 인디케이터 추가
        const dashboardCount = isCompatibilityMode ? 2 : 1;
        for (let i = 0; i < dashboardCount; i++) {
            const dot = createElement('div', { className: i === 0 ? 'dot active' : 'dot' });
            indicatorContainer.appendChild(dot);
        }

        // 리포트 카드 생성 및 인디케이터 추가
        reportContents.forEach((content) => {
            const card = createReportCard(content);
            track.appendChild(card);

            const dot = createElement('div', { className: 'dot' });
            indicatorContainer.appendChild(dot);
        });

        setupCarouselInteractions(indicatorContainer);
    } catch (error) {
        console.error('리포트 카드 렌더링 중 오류 발생:', error);
    }
}

// ============================================================================
// 카러셀 인터랙션
// ============================================================================

/**
 * 특정 카드로 스크롤
 * @param {HTMLElement} carouselContainer - 카러셀 컨테이너
 * @param {NodeList} cards - 카드 요소들
 * @param {number} index - 목표 인덱스
 */
function scrollToCard(carouselContainer, cards, index) {
    if (index < 0 || index >= cards.length) return;
    
    const scrollAmount = cards[index].offsetLeft - CONFIG.CAROUSEL.SCROLL_PADDING;
    carouselContainer.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

/**
 * 활성 카드 업데이트
 * @param {HTMLElement} activeCard - 활성 카드 요소
 * @param {NodeList} cards - 모든 카드 요소들
 * @param {NodeList} dots - 모든 인디케이터 요소들
 * @returns {number} 활성 카드 인덱스
 */
function updateActiveCard(activeCard, cards, dots) {
    // 모든 카드에서 active 제거
    cards.forEach(card => card.classList.remove('card-active'));
    activeCard.classList.add('card-active');

    // 인덱스 찾기
    const index = Array.from(cards).indexOf(activeCard);
    
    // Dots 업데이트
    dots.forEach((dot, idx) => {
        if (idx === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    return index;
}

/**
 * 버튼 상태 업데이트
 * @param {HTMLElement} prevBtn - 이전 버튼
 * @param {HTMLElement} nextBtn - 다음 버튼
 * @param {number} activeIndex - 활성 인덱스
 * @param {number} totalCards - 전체 카드 수
 */
function updateButtons(prevBtn, nextBtn, activeIndex, totalCards) {
    if (activeIndex === 0) {
        prevBtn.style.opacity = '0.5';
        prevBtn.style.pointerEvents = 'none';
    } else {
        prevBtn.style.opacity = '1';
        prevBtn.style.pointerEvents = 'auto';
    }

    if (activeIndex === totalCards - 1) {
        nextBtn.style.opacity = '0.5';
        nextBtn.style.pointerEvents = 'none';
    } else {
        nextBtn.style.opacity = '1';
        nextBtn.style.pointerEvents = 'auto';
    }
}

/**
 * Intersection Observer 설정
 * @param {HTMLElement} carouselContainer - 카러셀 컨테이너
 * @param {NodeList} cards - 카드 요소들
 * @param {NodeList} dots - 인디케이터 요소들
 * @param {HTMLElement} prevBtn - 이전 버튼
 * @param {HTMLElement} nextBtn - 다음 버튼
 * @returns {IntersectionObserver} Observer 인스턴스
 */
function setupIntersectionObserver(carouselContainer, cards, dots, prevBtn, nextBtn) {
    const observerOptions = {
        root: carouselContainer,
        threshold: CONFIG.CAROUSEL.OBSERVER_THRESHOLD
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeIndex = updateActiveCard(entry.target, cards, dots);
                updateButtons(prevBtn, nextBtn, activeIndex, cards.length);
            }
        });
    }, observerOptions);

    // 모든 카드 관찰 시작
    cards.forEach(card => observer.observe(card));
    
    return observer;
}

/**
 * 현재 활성 카드 인덱스 찾기
 * @param {NodeList} cards - 카드 요소들
 * @returns {number} 활성 카드 인덱스
 */
function getCurrentActiveIndex(cards) {
    const activeCard = document.querySelector('.content-card.card-active');
    return activeCard ? Array.from(cards).indexOf(activeCard) : 0;
}

/**
 * 카러셀 인터랙션 설정
 * @param {HTMLElement} indicatorContainer - 인디케이터 컨테이너
 */
function setupCarouselInteractions(indicatorContainer) {
    try {
        const carouselContainer = document.getElementById('carousel-container');
        const dots = indicatorContainer.querySelectorAll('.dot');
        const cards = document.querySelectorAll('.content-card');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        if (!carouselContainer || !prevBtn || !nextBtn || cards.length === 0) {
            console.error('카러셀 요소를 찾을 수 없습니다.');
            return;
        }

        // Intersection Observer 설정
        const observer = setupIntersectionObserver(carouselContainer, cards, dots, prevBtn, nextBtn);

        // 초기 상태 설정
        if (cards.length > 0) {
            cards[0].classList.add('card-active');
            updateButtons(prevBtn, nextBtn, 0, cards.length);
        }

        // 이벤트 위임: 인디케이터 클릭
        indicatorContainer.addEventListener('click', (e) => {
            const dot = e.target.closest('.dot');
            if (!dot) return;
            
            const index = Array.from(dots).indexOf(dot);
            scrollToCard(carouselContainer, cards, index);
        });

        // 이전 버튼 클릭
        prevBtn.addEventListener('click', () => {
            const currentIndex = getCurrentActiveIndex(cards);
            if (currentIndex > 0) {
                scrollToCard(carouselContainer, cards, currentIndex - 1);
            }
        });

        // 다음 버튼 클릭
        nextBtn.addEventListener('click', () => {
            const currentIndex = getCurrentActiveIndex(cards);
            if (currentIndex < cards.length - 1) {
                scrollToCard(carouselContainer, cards, currentIndex + 1);
            }
        });

        // 키보드 이벤트 (카러셀 포커스 시에만 활성화)
        let keyboardHandler = null;
        
        const enableKeyboard = () => {
            if (keyboardHandler) return;
            
            keyboardHandler = (e) => {
                const currentIndex = getCurrentActiveIndex(cards);
                
                if (e.key === 'ArrowLeft' && currentIndex > 0) {
                    e.preventDefault();
                    scrollToCard(carouselContainer, cards, currentIndex - 1);
                } else if (e.key === 'ArrowRight' && currentIndex < cards.length - 1) {
                    e.preventDefault();
                    scrollToCard(carouselContainer, cards, currentIndex + 1);
                }
            };
            
            document.addEventListener('keydown', keyboardHandler);
        };
        
        const disableKeyboard = () => {
            if (keyboardHandler) {
                document.removeEventListener('keydown', keyboardHandler);
                keyboardHandler = null;
            }
        };
        
        // 카러셀 포커스 시 키보드 활성화
        carouselContainer.addEventListener('focusin', enableKeyboard);
        carouselContainer.addEventListener('focusout', disableKeyboard);
        
        // 초기 활성화 (페이지 로드 시)
        enableKeyboard();
    } catch (error) {
        console.error('카러셀 인터랙션 설정 중 오류 발생:', error);
    }
}

// ============================================================================
// 초기화: 로딩 상태 표시
// ============================================================================

// 페이지 로드 시 로딩 상태 표시 (데이터 대기 중)
document.addEventListener('DOMContentLoaded', () => {
    const headerContainer = document.querySelector('.app-header');
    const carouselContainer = document.getElementById('carousel-container');
    
    // 헤더 초기화
    if (headerContainer) {
        headerContainer.innerHTML = '';
    }
    
    // 카러셀 영역에 로딩 메시지 표시 (정중앙)
    if (carouselContainer) {
        carouselContainer.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; width: 100%; padding: 20px; text-align: center; color: #888;">
                <div>
                    <p style="font-size: 16px; line-height: 1.6; white-space: pre-line;">결과 데이터를 기다리고 있어요.
잠시만 기다려 주세요.</p>
                </div>
            </div>
        `;
    }
});
