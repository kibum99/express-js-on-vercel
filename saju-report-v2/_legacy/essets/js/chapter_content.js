// assets/js/chapter_content.js
document.addEventListener('DOMContentLoaded', async () => {
    const [data, staticData] = await Promise.all([loadSajuData(), loadStaticData()]);
    if (!data || !staticData) return;

    const chapterIndex = parseInt(getQueryParam('chapter')) || 0;
    const report = data.report_contents[chapterIndex];
    const staticChapter = staticData.chapters[chapterIndex];
    const pageStatic = staticData.chapter_content;
    const petPersona = data.persona.find(p => p.type === 'pet');
    const petName = petPersona ? petPersona.name : '반려동물';

    // 탭 렌더링
    renderChapterTabs(chapterIndex, staticData.chapters);

    // 정적 텍스트 주입
    if (pageStatic.score_label) {
        document.getElementById('score-label').innerText = pageStatic.score_label;
    }
    // score_avg_hint는 아래 updateScoreChart에서 실시간 계산된 percentage와 함께 주입됩니다.
    if (pageStatic.detailed_report_title) {
        document.getElementById('detailed-report-title').innerText = pageStatic.detailed_report_title;
    }
    if (pageStatic.lucky_tip_title) {
        document.getElementById('lucky-tip-title').innerText = pageStatic.lucky_tip_title;
    }
    if (pageStatic.prev_btn) {
        document.getElementById('prev-btn').innerText = pageStatic.prev_btn;
    }

    // 내용 설정
    document.getElementById('chapter-score').innerText = report.score + '점';
    
    // 정규분포 차트 업데이트
    const updateScoreChart = (score) => {
        const bgPath = document.getElementById('bell-curve-bg');
        const highlightPath = document.getElementById('bell-curve-highlight');
        const pointer = document.getElementById('score-pointer');
        const hintText = document.getElementById('score-avg-hint');

        // 수학 함수
        const zScore = (s) => (s - 50) / 50 * 2.5; // 0~100 -> -2.5~2.5
        const pdf = (z) => (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z);
        const cdf = (z) => 1 / (1 + Math.exp(-1.702 * z)); // Bowling's Approximation

        const userZ = zScore(score);
        
        // SVG 경로 생성 (viewBox 0 0 100 40)
        const maxPdf = pdf(0);
        const yScale = 35 / maxPdf;

        const points = [];
        const highlightPoints = [];
        const steps = 100; // 더 매끄러운 곡선을 위해 스텝 증가

        for (let i = 0; i <= steps; i++) {
            const x = i * (100 / steps);
            const z = zScore(x);
            const y = 40 - (pdf(z) * yScale);
            points.push(`${x.toFixed(2)},${y.toFixed(2)}`);

            if (x >= score) {
                highlightPoints.push(`${x.toFixed(2)},${y.toFixed(2)}`);
            }
        }

        // 전체 곡선 경로 생성
        const d = `M 0,40 L ${points.join(' L ')} L 100,40 Z`;
        bgPath.setAttribute('d', d);
        highlightPath.setAttribute('d', d); // 강조 영역도 동일한 곡선 경로 사용

        // JS Animation을 통한 정교한 커플링 및 곡선 추적
        const startScore = -10; // z = -3 지점 ( (score-50)/50*2.5 = -3  => score-50 = -60 => score = -10 )
        const duration = 2000; // 왼쪽 끝에서부터 오므로 시간을 2초로 늘려 더 웅장하게 연출
        let startTime = null;

        const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easedProgress = easeInOutCubic(progress);
            
            const currentScore = startScore + (score - startScore) * easedProgress;
            const currentZ = zScore(currentScore);
            const pdfValue = pdf(currentZ);
            const currentYPercent = ((40 - (pdfValue * yScale)) / 40) * 100;

            // 포인터 위치 업데이트 (현재 X값에 맞는 정확한 Y값 계산)
            pointer.style.left = Math.max(0, Math.min(100, currentScore)) + '%';
            pointer.style.top = currentYPercent + '%';
            pointer.style.height = (100 - currentYPercent) + '%';
            
            // 나의 점수 텍스트 실시간 업데이트 (자연수 범위)
            const displayScore = Math.max(0, Math.round(currentScore));
            document.getElementById('chapter-score').innerText = displayScore + '점';
            
            // 강조 영역 clip-path 업데이트 (포인터와 1:1 동기화, 왼쪽 끝부터 채워짐)
            highlightPath.style.clipPath = `inset(0 0 0 ${Math.max(0, Math.min(100, currentScore))}%)`;

            // 상위 퍼센트 실시간 업데이트
            const currentTopPercentNum = (1 - cdf(currentZ)) * 100;
            const currentTopPercentStr = currentTopPercentNum < 0.1 ? "0.1%" : (currentTopPercentNum > 99.9 ? "99.9%" : currentTopPercentNum.toFixed(1) + "%");
            
            if (pageStatic && pageStatic.score_avg_hint) {
                // 직접 replace 시도 (안전을 위해)
                const hintHTML = pageStatic.score_avg_hint.replace('${percentage}', currentTopPercentStr);
                hintText.innerHTML = hintHTML;
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        // 초기 상태 설정 (z=-3 위치인 score -10에서 시작)
        const initialZ = zScore(startScore);
        const initialYPercent = ((40 - (pdf(initialZ) * yScale)) / 40) * 100;
        pointer.style.left = '0%';
        pointer.style.top = initialYPercent + '%';
        pointer.style.height = (100 - initialYPercent) + '%';
        highlightPath.style.clipPath = `inset(0 0 0 0%)`;

        // 초기 점수 텍스트 설정
        document.getElementById('chapter-score').innerText = '0점';

        // 초기 상위 퍼센트 텍스트 설정
        const initialTopPercentNum = (1 - cdf(initialZ)) * 100;
        const initialTopPercentStr = initialTopPercentNum < 0.1 ? "0.1%" : (initialTopPercentNum > 99.9 ? "99.9%" : initialTopPercentNum.toFixed(1) + "%");
        if (pageStatic && pageStatic.score_avg_hint) {
            const initialHintHTML = pageStatic.score_avg_hint.replace('${percentage}', initialTopPercentStr);
            hintText.innerHTML = initialHintHTML;
        }

        setTimeout(() => {
            requestAnimationFrame(animate);
        }, 200); // 페이지 진입 후 시각적 안정감을 위해 200ms 딜레이 후 시작
    };

    updateScoreChart(report.score);

    // 상세 분석 섹션 렌더링
    const sectionsContainer = document.getElementById('report-sections-container');
    sectionsContainer.innerHTML = '';
    
    if (report.reportContent && Array.isArray(report.reportContent) && report.reportContent.length > 0) {
        // 단일 컨테이너에 스타일 적용 (글래스모피즘 적용, 세로 여백은 유지하되 좌우 패딩 축소)
        sectionsContainer.className = 'glass-card-gray rounded-3xl px-5 py-10 space-y-24';
        
        report.reportContent.forEach((item, idx) => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'sub-query-item';
            
            // query_id를 바탕으로 static_data에서 template 찾기
            const staticQuery = staticChapter.desc_queries.find(q => q.query_id === item.query_id);
            const queryTemplate = staticQuery ? staticQuery.template : '알 수 없는 질문';
            const queryText = interpolateTemplate(queryTemplate, { petName });

            const queryH5 = document.createElement('h5');
            queryH5.className = 'text-lg font-bold text-gray-800 mb-4 flex items-start';
            queryH5.innerHTML = `<span class="text-red-500 mr-2 flex-shrink-0">Q${idx + 1}.</span> <span class="flex-1">${queryText}</span>`;
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'text-gray-600 leading-relaxed font-medium content-paragraph';
            // \n을 기준으로 문단을 나누고 각 문단을 <p> 태그로 감싸기
            const paragraphs = item.content.split('\n').filter(p => p.trim() !== '');
            contentDiv.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
            
            sectionDiv.appendChild(queryH5);
            sectionDiv.appendChild(contentDiv);
            sectionsContainer.appendChild(sectionDiv);
        });
    }

    // 럭키 팁 설정
    if (report.lucky_tip) {
        if (report.lucky_tip.icon) {
            document.getElementById('tip-icon').innerText = report.lucky_tip.icon;
        }
        document.getElementById('tip-text').innerText = report.lucky_tip.text;
    }

    // 버튼 이벤트
    document.getElementById('prev-btn').onclick = () => {
        navigateTo('chapter_desc.html', { chapter: chapterIndex });
    };

    const nextBtn = document.getElementById('next-chapter-btn');
    let nextUrl = '';
    let nextParams = {};
    let nextHint = '';

    if (chapterIndex < data.report_contents.length - 1) {
        nextUrl = 'chapter_start.html';
        nextParams = { chapter: chapterIndex + 1 };
        nextHint = pageStatic.next_chapter_btn;
        
        if (nextBtn) {
            nextBtn.innerText = pageStatic.next_chapter_btn;
            nextBtn.onclick = () => navigateTo(nextUrl, nextParams);
        }
    } else {
        nextUrl = 'main.html';
        nextParams = {};
        nextHint = pageStatic.last_chapter_btn;
        
        if (nextBtn) {
            nextBtn.innerText = pageStatic.last_chapter_btn;
            nextBtn.onclick = () => navigateTo(nextUrl, nextParams);
        }
    }

    // 공통 스크롤 전환 초기화
    initScrollTransition(nextUrl, nextParams, {
        scrollHint: nextHint
    });
});
