/**
 * 템플릿 문자열에서 ${key} 형태의 변수를 실제 값으로 치환합니다.
 * @param template - 치환할 템플릿 문자열
 * @param params - 치환할 파라미터 객체
 * @returns 치환된 문자열
 */
export function interpolateTemplate(
  template: string,
  params: Record<string, string>
): string {
  return template.replace(/\$\{(\w+)\}/g, (match, key) => {
    return params[key] !== undefined ? params[key] : match;
  });
}

/**
 * 한자 및 특수 문자를 시스템 폰트 태그로 감쌉니다.
 * @param text - 변환할 텍스트
 * @returns HTML 태그가 포함된 문자열
 */
export function wrapSpecialCharacters(text: string): string {
  if (!text) return '';
  // 한자 범위: \u4E00-\u9FFF
  // ()괄호 안에 한자가 들어있는 경우도 처리하기 위해 정규식 사용
  const wrappedHanja = text.replace(/([\u4E00-\u9FFF]+)/g, '<span class="font-sans">$1</span>');
  
  // <highlight> 태그를 <span class="highlight">로 변환
  return wrappedHanja.replace(/<highlight>(.*?)<\/highlight>/g, '<span class="highlight">$1</span>');
}
