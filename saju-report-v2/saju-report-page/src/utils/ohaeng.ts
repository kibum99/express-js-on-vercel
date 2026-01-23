import type { Saju } from '../types';

// 오행 매핑 상수
const CHEONGAN_TO_ELEMENT: Record<string, string> = {
  '갑': '목', '을': '목',
  '병': '화', '정': '화',
  '무': '토', '기': '토',
  '경': '금', '신': '금',
  '임': '수', '계': '수'
};

const JIJI_TO_ELEMENT: Record<string, string> = {
  '자': '수', '해': '수',
  '인': '목', '묘': '목',
  '사': '화', '오': '화',
  '신': '금', '유': '금',
  '진': '토', '술': '토', '축': '토', '미': '토'
};

/**
 * 천간/지지 글자에 따른 오행 색상을 반환합니다.
 * @param char - 천간 또는 지지 글자
 * @returns 오행 색상 (hex)
 */
export function getOhaengColor(char: string): string {
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
 * 천간/지지 글자를 오행으로 변환합니다.
 * @param char - 천간 또는 지지 글자
 * @param isCheongan - 천간인지 지지인지 여부
 * @returns 오행 ('목', '화', '토', '금', '수' 또는 null)
 */
export function getOhaengFromChar(char: string, isCheongan: boolean = true): string | null {
  if (isCheongan) {
    return CHEONGAN_TO_ELEMENT[char] || null;
  } else {
    return JIJI_TO_ELEMENT[char] || null;
  }
}

/**
 * 오행 분포 계산
 * @param saju - 사주 데이터
 * @returns 오행 분포 정보 (counts: 각 오행별 개수, total: 전체 개수)
 */
export function calculateOhaengDistribution(saju: Saju): { counts: Record<string, number>; total: number } {
  const counts: Record<string, number> = { '목': 0, '화': 0, '토': 0, '금': 0, '수': 0 };
  let total = 0;

  // 천간 분석
  saju.천간.forEach(char => {
    const elem = getOhaengFromChar(char, true);
    if (elem) {
      counts[elem]++;
      total++;
    }
  });

  // 지지 분석
  saju.지지.forEach(char => {
    const elem = getOhaengFromChar(char, false);
    if (elem) {
      counts[elem]++;
      total++;
    }
  });

  return { counts, total };
}
