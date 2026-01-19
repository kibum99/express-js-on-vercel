// assets/js/common.js
async function loadSajuData() {
    try {
        const response = await fetch(`data.json?t=${Date.now()}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading saju data:', error);
        return null;
    }
}

async function loadStaticData() {
    try {
        const response = await fetch('static_data.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading static data:', error);
        return null;
    }
}

function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function navigateTo(url, params = {}) {
    const query = new URLSearchParams(params).toString();
    window.location.href = url + (query ? '?' + query : '');
}

// 공통 네비게이션 탭 렌더링 함수 (챕터 페이지용)
function renderChapterTabs(currentChapterIndex, staticChapters) {
    const tabContainer = document.querySelector('.chapter-tabs');
    if (!tabContainer) return;

    tabContainer.innerHTML = '';
    staticChapters.forEach((chapter, index) => {
        const tab = document.createElement('div');
        tab.className = `flex-1 py-2 text-center text-sm font-bold cursor-pointer border-b-2 ${
            index == currentChapterIndex ? 'border-red-500 text-red-500' : 'border-transparent text-gray-400'
        }`;
        tab.innerText = chapter.title;
        tab.onclick = () => {
            navigateTo('chapter_start.html', { chapter: index });
        };
        tabContainer.appendChild(tab);
    });
}

/**
 * 템플릿 문자열을 실제 데이터로 치환합니다.
 * @param {string} template - 치환할 템플릿 문자열 (예: "${petName}의 사주")
 * @param {Object} data - 치환할 데이터 객체 (예: { petName: "뽀삐" })
 * @returns {string} - 치환된 문자열
 */
function interpolateTemplate(template, data) {
    if (!template) return "";
    return template.replace(/\${(\w+)}/g, (match, key) => {
        return data[key] !== undefined ? data[key] : match;
    });
}

/**
 * 최적화된 스크롤 기반 페이지 전환 로직 초기화
 * @param {string} targetUrl - 이동할 페이지 URL
 * @param {Object} params - 이동 시 전달할 파라미터
 * @param {Object} options - UI 및 제어 옵션 (footerMsg, scrollHint, initiallyEnabled)
 * @returns {Object} - 제어 인터페이스 (enable, disable)
 */
function initScrollTransition(targetUrl, params = {}, options = {}) {
    const { footerMsg, scrollHint, initiallyEnabled = true } = options;
    const footerHolder = document.getElementById('common-scroll-footer');
    
    // UI 주입 (필요한 경우)
    if (footerHolder) {
        footerHolder.innerHTML = `
            <div class="common-scroll-footer-content mt-12 text-center pb-12" style="display: ${initiallyEnabled ? 'block' : 'none'}">
                ${footerMsg ? `<p class="footer-message text-lg font-bold mb-6">${footerMsg}</p>` : ''}
                <div class="scroll-action-trigger animate-bounce cursor-pointer flex flex-col items-center">
                    <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 13l-7 7-7-7m14-8l-7 7-7-7"></path>
                    </svg>
                    ${scrollHint ? `<p class="scroll-hint text-xs font-bold text-red-500 mt-2 uppercase tracking-widest">${scrollHint}</p>` : ''}
                </div>
            </div>
        `;

        const trigger = footerHolder.querySelector('.scroll-action-trigger');
        if (trigger) {
            trigger.onclick = () => {
                if (isEnabled && !isTransitioning) {
                    isTransitioning = true;
                    navigateTo(targetUrl, params);
                }
            };
        }
    }

    let isTransitioning = false;
    let isEnabled = initiallyEnabled;
    let startedAtBottom = false;
    let wheelTimer = null;
    const SCROLL_THRESHOLD = 80; // 80~100 사이의 적절한 값

    function isAtBottom() {
        const safeArea = document.querySelector('.safe-area');
        const safeAreaStyle = safeArea ? window.getComputedStyle(safeArea) : null;
        
        // 실제로 내부 스크롤이 발생하는지 확인 (overflow-y가 auto/scroll이고 scrollHeight가 clientHeight보다 큰 경우)
        const isSafeScroll = safeArea && 
                             (safeAreaStyle.overflowY === 'auto' || safeAreaStyle.overflowY === 'scroll') &&
                             safeArea.scrollHeight > safeArea.clientHeight + 5;
        
        const container = isSafeScroll ? safeArea : document.documentElement;
        
        const scrollTop = isSafeScroll ? container.scrollTop : (window.pageYOffset || document.documentElement.scrollTop);
        const clientHeight = isSafeScroll ? container.clientHeight : window.innerHeight;
        const scrollHeight = isSafeScroll ? container.scrollHeight : document.documentElement.scrollHeight;
        
        // 페이지가 충분히 길지 않으면 스크롤 전환을 허용하지 않거나 항상 하단으로 보지 않음
        // (단, 사용자가 명시적으로 스크롤을 통해 다음으로 넘어가길 원하므로 30px 여유를 둠)
        if (scrollHeight <= clientHeight + 30) return true;
        
        return (scrollTop + clientHeight) >= (scrollHeight - 25);
    }

    const handleScrollTransition = (delta) => {
        if (!isEnabled || isTransitioning || window.preventScrollTransition) return;

        // 아래로 스크롤(delta > 0)이고, 스크롤 시작 시점이 하단이었으며, 현재도 하단인 경우에만 전환
        if (delta > SCROLL_THRESHOLD && startedAtBottom && isAtBottom()) {
            isTransitioning = true;
            navigateTo(targetUrl, params);
        }
    };

    // Wheel 이벤트 (데스크탑)
    window.addEventListener('wheel', (e) => {
        // 새로운 휠 동작 시작 시점 감지
        if (wheelTimer === null) {
            startedAtBottom = isAtBottom();
        }

        handleScrollTransition(e.deltaY);

        // 휠 동작이 끝날 때까지 타이머 갱신 (관성 스크롤 대응)
        clearTimeout(wheelTimer);
        wheelTimer = setTimeout(() => {
            wheelTimer = null;
        }, 150);
    }, { passive: true });

    // Touch 이벤트 (모바일)
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        startedAtBottom = isAtBottom();
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchStartY - touchEndY; // 양수면 위로 스크롤 (손가락을 위로 올림)
        handleScrollTransition(deltaY);
    }, { passive: true });

    return {
        enable: () => {
            isEnabled = true;
            if (footerHolder) {
                const content = footerHolder.querySelector('.common-scroll-footer-content');
                if (content) content.style.display = 'block';
            }
        },
        disable: () => {
            isEnabled = false;
            if (footerHolder) {
                const content = footerHolder.querySelector('.common-scroll-footer-content');
                if (content) content.style.display = 'none';
            }
        }
    };
}
