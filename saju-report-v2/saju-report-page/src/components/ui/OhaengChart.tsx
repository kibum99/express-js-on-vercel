import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { calculateOhaengDistribution } from '../../utils/ohaeng';
import { Card } from './Card';
import type { Saju } from '../../types';

interface OhaengChartProps {
  saju: Saju | null;
  className?: string;
}

const OHAENG_CONFIG: Record<string, { color: string; label: string; bg: string; image: string }> = {
  '목': { color: '#10B981', label: '나무 (Wood)', bg: 'bg-emerald-50', image: '/assets/img/char/tree-ohaeng.png' },
  '화': { color: '#EF4444', label: '불 (Fire)', bg: 'bg-red-50', image: '/assets/img/char/fire-ohaeng.png' },
  '토': { color: '#F59E0B', label: '흙 (Earth)', bg: 'bg-amber-50', image: '/assets/img/char/earth-ohaeng.png' },
  '금': { color: '#64748B', label: '쇠 (Metal)', bg: 'bg-slate-50', image: '/assets/img/char/metal-ohaeng.png' },
  '수': { color: '#3B82F6', label: '물 (Water)', bg: 'bg-blue-50', image: '/assets/img/char/water-ohaeng.png' }
};

const OHAENG_ORDER = ['목', '화', '토', '금', '수'];

export function OhaengChart({ saju, className = '' }: OhaengChartProps) {
  if (!saju) return null;

  const { counts } = useMemo(() => calculateOhaengDistribution(saju), [saju]);
  
  // Radar Chart Configuration
  const size = 300;
  const viewBoxPaddingX = 60; // 좌우 패딩
  const viewBoxPaddingTop = 40; // 위쪽 패딩 (더 작게)
  const viewBoxPaddingBottom = 80; // 아래쪽 패딩 (더 크게)
  const centerX = size / 2; // X 중심 (150)
  const centerY = size / 2 + 60; // Y 중심을 약간 아래로 이동 (160)
  const center = { x: centerX, y: centerY };
  const radius = (size / 2) + 20; // 차트 반지름
  const maxDomain = Math.max(...Object.values(counts), 4); // Min scale of 4 for visual balance

  // Helper to calculate points on the pentagon
  const getPoint = (value: number, index: number, max: number) => {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2; // Start from top (-90deg)
    const normalizedValue = value / max;
    const r = Math.max(0.15 / max * radius, normalizedValue * radius);
    const x = center.x + r * Math.cos(angle);
    const y = center.y + r * Math.sin(angle);
    return { x, y };
  };

  // Generate polygon points
  const polygonPoints = OHAENG_ORDER.map((ohaeng, i) => {
    const point = getPoint(counts[ohaeng], i, maxDomain);
    return `${point.x},${point.y}`;
  }).join(' ');

  // Initial polygon points (all at center for animation)
  // 카드 애니메이션 완료 후 중앙에서부터 퍼져나가는 효과를 위해
  const initialPolygonPoints = Array(5)
    .fill(`${center.x},${center.y}`)
    .join(' ');

  // Generate grid levels (concentric pentagons) - 0부터 maxDomain까지 1/n 간격
  const gridLevels = Array.from({ length: maxDomain + 1 }, (_, i) => i).map(level => {
    return OHAENG_ORDER.map((_, i) => {
      const point = getPoint(level, i, maxDomain);
      return `${point.x},${point.y}`;
    }).join(' ');
  });

  // Calculate label positions - 이미지 크기를 고려하여 위치 조정
  const imageSize = 60;
  const labelRadius = radius + 40; // 이미지 크기를 고려하여 레이블 반지름 조정 (더 바깥쪽으로 배치)
  const labelPositions = OHAENG_ORDER.map((ohaeng, i) => {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const x = center.x + labelRadius * Math.cos(angle);
    const y = center.y + labelRadius * Math.sin(angle);
    return { x, y, label: ohaeng, color: OHAENG_CONFIG[ohaeng].color, image: OHAENG_CONFIG[ohaeng].image };
  });

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex flex-col items-center w-full gap-8">
        {/* Radar Chart Area */}
        <div className="relative w-full max-w-[320px] aspect-square mb-2">
          <svg width="100%" height="100%" viewBox={`-${viewBoxPaddingX} -${viewBoxPaddingTop} ${size + viewBoxPaddingX * 2} ${size + viewBoxPaddingTop + viewBoxPaddingBottom}`} preserveAspectRatio="xMidYMid meet" className="overflow-visible">
            {/* Grid Lines */}
            {gridLevels.map((points, i) => (
              <polygon
                key={i}
                points={points}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="1"
              />
            ))}
            
            {/* Axis Lines */}
            {OHAENG_ORDER.map((_, i) => {
              const endPoint = getPoint(maxDomain, i, maxDomain);
              return (
                <line
                  key={i}
                  x1={center.x}
                  y1={center.y}
                  x2={endPoint.x}
                  y2={endPoint.y}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
              );
            })}

            {/* Data Polygon */}
            <motion.polygon
              initial={{ 
                points: initialPolygonPoints
              }}
              whileInView={{ 
                points: polygonPoints
              }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ 
                delay: 0.1, // 카드 애니메이션(duration: 0.5s) 완료 후 시작
                duration: 0.5, 
                ease: "easeOut"
              }}
              fill="rgba(99, 102, 241, 0.2)" // Indigo-500 with opacity
              stroke="#6366F1" // Indigo-500
              strokeWidth="2"
            />

            {/* Data Points */}
            {OHAENG_ORDER.map((ohaeng, i) => {
              const point = getPoint(counts[ohaeng], i, maxDomain);
              return (
                <motion.circle
                  key={i}
                  initial={{ 
                    cx: center.x,
                    cy: center.y
                  }}
                  whileInView={{ 
                    cx: point.x,
                    cy: point.y
                  }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ 
                    delay: 0.1, // 카드 애니메이션 완료 후 시작
                    duration: 0.5, 
                    ease: "easeOut"
                  }}
                  r="4"
                  fill={OHAENG_CONFIG[ohaeng].color}
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}

            {/* Labels */}
            {labelPositions.map((pos, i) => {
              const textOffset = 10; // 텍스트를 이미지 위에 배치하기 위한 오프셋
              
              return (
                <g key={i}>
                  <image
                    x={pos.x - imageSize / 2}
                    y={pos.y - imageSize / 2}
                    width={imageSize}
                    height={imageSize}
                    href={pos.image}
                    className="select-none"
                  />
                  <text
                    x={pos.x}
                    y={pos.y - imageSize / 2 - textOffset}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={pos.color}
                    fontSize="24"
                    fontWeight="bold"
                    className="select-none"
                  >
                    {pos.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-5 gap-2 w-full">
          {OHAENG_ORDER.map((ohaeng) => {
            const count = counts[ohaeng];
            const config = OHAENG_CONFIG[ohaeng];

            return (
              <motion.div
                key={ohaeng}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`flex flex-col items-center p-1 gap-1 w-full h-fit rounded-lg ${config.bg} border border-transparent hover:border-gray-200 transition-colors`}
              >
                <span 
                  className="text-sm font-bold mb-0"
                  style={{ color: config.color }}
                >
                  {ohaeng}
                </span>
                <span className="text-lg font-bold text-gray-800 leading-none">
                  {count}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
