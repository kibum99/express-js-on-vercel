// assets/js/main.js
document.addEventListener('DOMContentLoaded', async () => {
    const [data, staticData] = await Promise.all([loadSajuData(), loadStaticData()]);
    
    if (data && staticData) {
        const petPersona = data.persona.find(p => p.type === 'pet');
        const petName = petPersona ? petPersona.name : '반려동물';

        // 정적 데이터 주입
        const titleEl = document.getElementById('main-title');
        
        if (titleEl) {
            titleEl.innerHTML = interpolateTemplate(staticData.main.title_template, { petName });
        }

        // 이미지 설정
        const petImageElement = document.getElementById('pet-image');
        if (petPersona && petPersona.profile_image) {
            petImageElement.src = petPersona.profile_image;
        }

        // 공통 스크롤 전환 초기화
        initScrollTransition('intro.html', {}, {
            scrollHint: staticData.main.scroll_hint
        });
    }
});
