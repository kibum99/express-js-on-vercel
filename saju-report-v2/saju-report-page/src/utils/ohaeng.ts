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
