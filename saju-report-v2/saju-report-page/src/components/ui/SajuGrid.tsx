import type { Saju } from '../../types';
import { getOhaengColor } from '../../utils/ohaeng';
import { wrapSpecialCharacters } from '../../utils/template';

// 한글 천간/지지를 영문 파일명으로 매핑
const cheonganMap: Record<string, string> = {
  '갑': 'gap', '을': 'eul', '병': 'byeong', '정': 'jeong', '무': 'mu',
  '기': 'gi', '경': 'gyeong', '신': 'sin', '임': 'im', '계': 'gye'
};

const jijiMap: Record<string, string> = {
  '자': 'ja', '축': 'chuk', '인': 'in', '묘': 'myo', '진': 'jin', '사': 'sa',
  '오': 'o', '미': 'mi', '신': 'sin', '유': 'yu', '술': 'sul', '해': 'hae'
};

interface SajuGridProps {
  saju: Saju | null;
}

export function SajuGrid({ saju }: SajuGridProps) {
  if (!saju) return null;

  const labels = ['시주', '일주', '월주', '년주'];
  
  // 데이터를 역순으로 변환 (년주, 월주, 일주, 시주 -> 시주, 일주, 월주, 년주)
  const reversedIndex = (i: number) => saju.천간.length - 1 - i;

  return (
    <div className="saju-grid grid grid-cols-5 gap-y-1 gap-x-1">
      {/* 구분 행 */}
      <div className="saju-box-label flex items-center justify-center text-foreground font-medium">
        <span className="highlight">구분</span>
      </div>
      {labels.map((label, i) => (
        <div key={i} className="saju-row-item flex items-center justify-center">
          <span className="saju-column-label text-foreground font-medium">{label}</span>
        </div>
      ))}

      {/* 천간 행 */}
      <div className="saju-box-label flex items-center justify-center text-foreground font-medium">
        <span className="highlight">천간</span>
      </div>
      {labels.map((_, i) => {
        const dataIndex = reversedIndex(i);
        const stem = saju.천간[dataIndex];
        const filename = cheonganMap[stem] || stem;
        const imagePath = `/assets/img/manse-card/cheongan/${filename}.png`;
        return (
          <div key={i} className="saju-box flex items-center justify-center">
            <img
              src={imagePath}
              alt={stem}
              className="w-12 h-12 object-contain rounded"
              style={{ backgroundColor: getOhaengColor(stem) }}
            />
          </div>
        );
      })}

      {/* 천간 십성 행 */}
      <div className="saju-box-label flex items-center justify-center text-foreground font-medium text-sm">
        <span className="highlight">십성</span>
      </div>
      {labels.map((_, i) => {
        const dataIndex = reversedIndex(i);
        const silsung = saju.천간십성[dataIndex];
        return (
          <div key={i} className="saju-row-item flex items-center justify-center">
            <span className="saju-sub-label text-foreground text-sm">
              {wrapSpecialCharacters(silsung || '-')}
            </span>
          </div>
        );
      })}

      {/* 지지 행 */}
      <div className="saju-box-label flex items-center justify-center text-foreground font-medium">
        <span className="highlight">지지</span>
      </div>
      {labels.map((_, i) => {
        const dataIndex = reversedIndex(i);
        const branch = saju.지지[dataIndex];
        const filename = jijiMap[branch] || branch;
        const imagePath = `/assets/img/manse-card/jiji/${filename}.png`;
        return (
          <div key={i} className="saju-box flex items-center justify-center">
            <img
              src={imagePath}
              alt={branch}
              className="w-12 h-12 object-contain rounded"
              style={{ backgroundColor: getOhaengColor(branch) }}
            />
          </div>
        );
      })}

      {/* 지지 십성 행 */}
      <div className="saju-box-label flex items-center justify-center text-foreground font-medium text-sm">
        <span className="highlight">십성</span>
      </div>
      {labels.map((_, i) => {
        const dataIndex = reversedIndex(i);
        const silsung = saju.지지십성[dataIndex];
        return (
          <div key={i} className="saju-row-item flex items-center justify-center">
            <span className="saju-sub-label text-foreground text-sm">
              {wrapSpecialCharacters(silsung || '-')}
            </span>
          </div>
        );
      })}

      {/* 12운성 행 */}
      <div className="saju-box-label flex items-center justify-center text-foreground font-medium text-sm">
        <span className="highlight">12운성</span>
      </div>
      {labels.map((_, i) => {
        const dataIndex = reversedIndex(i);
        const wonsung = saju['12운성'][dataIndex];
        return (
          <div key={i} className="saju-row-item flex items-center justify-center">
            <span className="saju-sub-label text-foreground text-sm">
              {wrapSpecialCharacters(wonsung || '')}
            </span>
          </div>
        );
      })}

      {/* 12신살 행 */}
      <div className="saju-box-label flex items-center justify-center text-foreground font-medium text-sm">
        <span className="highlight">12신살</span>
      </div>
      {labels.map((_, i) => {
        const dataIndex = reversedIndex(i);
        const sinsal = saju['12신살'][dataIndex];
        return (
          <div key={i} className="saju-row-item flex items-center justify-center">
            <span className="saju-sub-label text-foreground text-sm">
              {wrapSpecialCharacters(sinsal || '')}
            </span>
          </div>
        );
      })}

      {/* 기타신살 행 (병합) */}
      <div className="saju-box-label flex items-center justify-center text-foreground font-medium text-sm">
        <span className="highlight">기타신살</span>
      </div>
      <div className="saju-merged-row col-span-4 flex flex-wrap gap-2 items-center justify-start">
        {saju.기타신살 && saju.기타신살.length > 0 ? (
          saju.기타신살.map((sinsal, i) => (
            <span key={i} className="text-foreground text-sm">
              {wrapSpecialCharacters(`#${sinsal}`)}
            </span>
          ))
        ) : (
          <span className="text-foreground text-sm">-</span>
        )}
      </div>
    </div>
  );
}
