// assets/js/chapter_start.js
document.addEventListener('DOMContentLoaded', async () => {
    const [data, staticData] = await Promise.all([loadSajuData(), loadStaticData()]);
    if (!data || !staticData) return;

    const chapterIndex = parseInt(getQueryParam('chapter')) || 0;
    const report = data.report_contents[chapterIndex];
    const staticChapter = staticData.chapters[chapterIndex];
    const petPersona = data.persona.find(p => p.type === 'pet');
    const petName = petPersona ? petPersona.name : '반려동물';

    // 탭 렌더링
    renderChapterTabs(chapterIndex, staticData.chapters);

    // 내용 설정
    const chapterNumEl = document.getElementById('chapter-number');
    const chapterDisplayNum = chapterIndex + 1;

    if (chapterNumEl) {
        chapterNumEl.innerText = `Chapter. ${chapterDisplayNum}`;
    }
    
    document.getElementById('chapter-title').innerText = staticChapter.title;

    // 화자 아이콘 설정 (teller_icon)
    const tellerIconImg = document.getElementById('teller-icon');
    if (tellerIconImg && staticChapter.teller_icon) {
        tellerIconImg.src = staticChapter.teller_icon;
    }
    
    // 질문 템플릿 적용
    const questionEl = document.getElementById('chapter-question');
    if (questionEl && staticChapter.questionTemplate) {
        questionEl.innerHTML = interpolateTemplate(staticChapter.questionTemplate, { petName });
    }

    // 다음 버튼 텍스트
    document.getElementById('next-btn').innerText = staticData.chapter_content.next_btn || '알아보기';

    // 아이콘 설정
    const iconImg = document.getElementById('chapter-icon');
    if (staticChapter.icon) {
        iconImg.src = staticChapter.icon;
    } else {
        iconImg.alt = staticChapter.title;
    }

    // 버튼 이벤트
    document.getElementById('next-btn').onclick = () => {
        navigateTo('chapter_desc.html', { chapter: chapterIndex });
    };
});
