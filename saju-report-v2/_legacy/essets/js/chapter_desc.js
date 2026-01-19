// assets/js/chapter_desc.js
document.addEventListener('DOMContentLoaded', async () => {
    const [data, staticData] = await Promise.all([loadSajuData(), loadStaticData()]);
    if (!data || !staticData) return;

    const chapterIndex = parseInt(getQueryParam('chapter')) || 0;
    const report = data.report_contents[chapterIndex];
    const staticChapter = staticData.chapters[chapterIndex];
    const petPersona = data.persona.find(p => p.type === 'pet');
    const petName = petPersona ? petPersona.name : '반려동물';
    const petProfileImg = petPersona ? petPersona.profile_image : 'https://via.placeholder.com/60x60';

    // 탭 렌더링
    renderChapterTabs(chapterIndex, staticData.chapters);

    // 내용 설정
    const titleEl = document.getElementById('chapter-desc-title');
    if (titleEl) {
        titleEl.innerHTML = interpolateTemplate(staticData.chapter_desc.title_template, { chapterTitle: staticChapter.title });
    }
    
    document.getElementById('keywords-suffix').innerText = staticData.chapter_desc.keywords_suffix;
    // Analysis Title
    const analysisTitleEl = document.getElementById('analysis-title');
    if (analysisTitleEl) {
        analysisTitleEl.innerHTML = `<span class="w-1.5 h-6 bg-red-500 rounded-full mr-3 flex-shrink-0"></span><span>${staticData.chapter_desc.analysis_title}</span>`;
    }
    
    // FAQ Title (HTML 태그 및 변수 치환 반영)
    const faqTitleEl = document.getElementById('faq-title');
    if (faqTitleEl) {
        const interpolatedFaqTitle = interpolateTemplate(staticData.chapter_desc.faq_title, { petName });
        faqTitleEl.innerHTML = `<span class="w-1.5 h-6 bg-red-500 rounded-full mr-3 flex-shrink-0"></span><span>${interpolatedFaqTitle}</span>`;
        faqTitleEl.classList.remove('items-center');
        faqTitleEl.classList.add('items-start');
    }

    // Chapter Overview
    if (staticChapter.chapter_overview) {
        document.getElementById('chapter-overview').innerHTML = interpolateTemplate(staticChapter.chapter_overview, { petName });
    }

    // Teller Icon
    const tellerIcon = document.getElementById('teller-icon');
    if (tellerIcon && staticChapter.teller_icon) {
        tellerIcon.src = staticChapter.teller_icon;
    }

    // 챕터 질문 리스트
    const list = document.getElementById('keywords-list');
    list.innerHTML = '';
    const queries = staticChapter.desc_queries || [];
    queries.forEach((queryItem, idx) => {
        const li = document.createElement('li');
        li.className = 'text-lg font-bold flex items-start fade-in-up';
        li.style.animationDelay = `${idx * 0.1}s`;
        const queryText = interpolateTemplate(queryItem.template, { petName });
        li.innerHTML = `<span class="query-number">${idx + 1}.</span> <span>${queryText}</span>`;
        list.appendChild(li);
    });

    // 분석 요소 리스트
    const analysisList = document.getElementById('analysis-list');
    analysisList.innerHTML = '';
    const elements = staticChapter.analysis_elements || [];
    elements.forEach((el, idx) => {
        const li = document.createElement('li');
        li.className = 'fade-in-up';
        li.style.animationDelay = `${(queries.length + idx) * 0.1}s`;
        li.innerText = interpolateTemplate(el, { petName });
        analysisList.appendChild(li);
    });

    // 타이핑 효과 함수
    async function typeWriter(element, text, speed = 30) {
        element.innerText = '';
        element.classList.add('typing');
        for (let i = 0; i < text.length; i++) {
            element.innerText += text.charAt(i);
            await new Promise(resolve => setTimeout(resolve, speed));
        }
        element.classList.remove('typing');
    }

    // FAQ 채팅 및 질문 시스템
    const faqContainer = document.getElementById('faq-chat-container');
    const questionOptionsContainer = document.getElementById('faq-question-options');
    faqContainer.innerHTML = '';
    questionOptionsContainer.innerHTML = '';
    
    const faqs = staticChapter.faqs || [];
    let remainingFaqs = [...faqs];
    
    // 스크롤 전환 초기화 (초기 비활성 상태)
    const scrollTransition = initScrollTransition('chapter_content.html', { chapter: chapterIndex }, {
        footerMsg: staticData.chapter_desc.footer_msg,
        scrollHint: staticData.chapter_desc.scroll_hint,
        initiallyEnabled: false
    });

    function renderQuestionOptions() {
        questionOptionsContainer.innerHTML = '';
        
        // 아직 묻지 않은 질문들 버튼 생성
        remainingFaqs.forEach((faq, idx) => {
            const btn = document.createElement('button');
            btn.className = 'faq-question-btn fade-in';
            btn.innerText = interpolateTemplate(faq.question, { petName });
            btn.onclick = () => handleQuestionClick(faq);
            questionOptionsContainer.appendChild(btn);
        });

        // "더 궁금한 점이 없어요" 버튼 추가
        const endBtn = document.createElement('button');
        endBtn.className = 'faq-question-btn fade-in border-red-200 text-red-500 font-bold bg-red-50/50';
        endBtn.innerText = "더 궁금한 점이 없어요";
        endBtn.onclick = () => finishFaq();
        questionOptionsContainer.appendChild(endBtn);
    }

    async function handleQuestionClick(selectedFaq) {
        // 버튼 비활성화 및 현재 질문 제거
        questionOptionsContainer.innerHTML = '';
        remainingFaqs = remainingFaqs.filter(f => f !== selectedFaq);
        
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item mb-8';
        
        // Question (Left/User)
        const qWrapper = document.createElement('div');
        qWrapper.className = 'question-wrapper mb-6 bubble-pop';
        const qAvatar = document.createElement('div');
        qAvatar.className = 'chat-avatar';
        const qImg = document.createElement('img');
        qImg.src = petProfileImg;
        qImg.alt = 'Pet';
        qAvatar.appendChild(qImg);
        const qBubble = document.createElement('div');
        qBubble.className = 'chat-bubble question';
        qWrapper.appendChild(qAvatar);
        qWrapper.appendChild(qBubble);
        chatItem.appendChild(qWrapper);
        faqContainer.appendChild(chatItem);

        // 질문 타이핑
        window.preventScrollTransition = true;
        const qText = interpolateTemplate(selectedFaq.question, { petName });
        await typeWriter(qBubble, qText, 20);
        await new Promise(resolve => setTimeout(resolve, 500));

        // Answer (Right/Teller)
        const aWrapper = document.createElement('div');
        aWrapper.className = 'answer-wrapper bubble-pop';
        const aAvatar = document.createElement('div');
        aAvatar.className = 'chat-avatar';
        const aImg = document.createElement('img');
        aImg.src = staticChapter.teller_icon;
        aImg.alt = 'Teller';
        aAvatar.appendChild(aImg);
        const aBubble = document.createElement('div');
        aBubble.className = 'chat-bubble answer';
        aWrapper.appendChild(aAvatar);
        aWrapper.appendChild(aBubble);
        chatItem.appendChild(aWrapper);

        // 답변 타이핑
        const aText = interpolateTemplate(selectedFaq.answer, { petName });
        await typeWriter(aBubble, aText, 20);
        window.preventScrollTransition = false;
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 다음 질문 옵션 노출
        renderQuestionOptions();
        
        // 부드럽게 스크롤 아래로
        const safeArea = document.querySelector('.safe-area');
        if (safeArea) {
            safeArea.scrollTo({
                top: safeArea.scrollHeight,
                behavior: 'smooth'
            });
        }
    }

    function finishFaq() {
        questionOptionsContainer.innerHTML = '';
        scrollTransition.enable();
        
        // 푸터로 스크롤 이동
        setTimeout(() => {
            const safeArea = document.querySelector('.safe-area');
            if (safeArea) {
                safeArea.scrollTo({
                    top: safeArea.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }

    // 초기 질문 리스트 노출
    renderQuestionOptions();
});
