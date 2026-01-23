import { useEffect, useState, useRef } from 'react';
import { wrapSpecialCharacters } from '../../utils/template';

interface ScoreChartProps {
  score: number;
  hintTemplate: string;
  className?: string;
}

export function ScoreChart({ score, hintTemplate, className = '' }: ScoreChartProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [percentage, setPercentage] = useState('...');
  const svgRef = useRef<SVGSVGElement>(null);

  // 정규분포 계산 함수들
  const zScore = (s: number) => (s - 50) / 50 * 2.5;
  const pdf = (z: number) => (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z);
  const cdf = (z: number) => 1 / (1 + Math.exp(-1.702 * z));

  useEffect(() => {
    const maxPdf = pdf(0);
    const yScale = 35 / maxPdf;
    const points: string[] = [];

    // 배경 곡선 생성
    for (let i = 0; i <= 100; i++) {
      const x = i;
      const z = zScore(x);
      const y = 40 - (pdf(z) * yScale);
      points.push(`${x},${y.toFixed(2)}`);
    }

    const pathD = `M 0,40 L ${points.join(' L ')} L 100,40 Z`;

    if (svgRef.current) {
      const bgPath = svgRef.current.querySelector('#bell-curve-bg') as SVGPathElement;
      const highlightPath = svgRef.current.querySelector('#bell-curve-highlight') as SVGPathElement;
      
      if (bgPath) bgPath.setAttribute('d', pathD);
      if (highlightPath) highlightPath.setAttribute('d', pathD);
    }

    // 애니메이션
    let startTimestamp: number | null = null;
    const duration = 1500;

    const animate = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentScore = -10 + (score + 10) * easedProgress;
      const currentZ = zScore(currentScore);

      setDisplayScore(Math.max(0, Math.round(currentScore)));

      const topPercent = (1 - cdf(currentZ)) * 100;
      const topStr =
        topPercent < 0.1
          ? '0.1%'
          : topPercent > 99.9
          ? '99.9%'
          : topPercent.toFixed(1) + '%';
      setPercentage(topStr);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  const scorePercent = Math.max(0, Math.min(100, displayScore));
  const currentZ = zScore(displayScore);
  const pdfValue = pdf(currentZ);
  const maxPdf = pdf(0);
  const yScale = 35 / maxPdf;
  const yPercent = ((40 - (pdfValue * yScale)) / 40) * 100;

  return (
    <div className={`p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold">나의 점수</h4>
        <span className="text-2xl font-bold text-accent">{displayScore}점</span>
      </div>
      <div className="relative">
        <svg
          ref={svgRef}
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
          className="w-full"
          style={{ height: '100px' }}
        >
          <path
            id="bell-curve-bg"
            d=""
            fill="rgba(0,0,0,0.03)"
          />
          <path
            id="bell-curve-highlight"
            d=""
            fill="#A67C4E"
            fillOpacity="0.3"
            style={{
              clipPath: `inset(0 0 0 ${scorePercent}%)`,
            }}
          />
          <line
            x1="0"
            y1="40"
            x2="100"
            y2="40"
            stroke="#D9D4CC"
            strokeWidth="1"
          />
          {/* 포인터 */}
          <g
            style={{
              transform: `translateX(${scorePercent}%)`,
            }}
          >
            <line
              x1="0"
              y1={yPercent * 0.4}
              x2="0"
              y2="40"
              stroke="#A67C4E"
              strokeWidth="1.5"
            />
            <circle
              cx="0"
              cy={yPercent * 0.4}
              r="2"
              fill="#A67C4E"
            />
          </g>
        </svg>
      </div>
      <p 
        className="text-sm text-muted mt-2 text-center"
        dangerouslySetInnerHTML={{
          __html: wrapSpecialCharacters(hintTemplate.replace('${percentage}', percentage))
        }}
      />
    </div>
  );
}
