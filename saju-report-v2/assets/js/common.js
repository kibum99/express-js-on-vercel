// assets/js/common.js

/**
 * 사주 데이터를 로드합니다.
 */
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

/**
 * 정적 데이터를 로드합니다.
 */
async function loadStaticData() {
    try {
        const response = await fetch(`static_data.json?t=${Date.now()}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading static data:', error);
        return null;
    }
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
