import React, { useState, useMemo } from 'react';
import { TrendingDown, TrendingUp, Minus, Calendar } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { formatBrazilianDate, formatWeightVariation } from '../../utils/formatters';

type TimeFilter = '7D' | '30D' | '90D' | '6M' | '1A' | 'TUDO';

export const WeightChartView: React.FC = () => {
  const { weightRecords } = useWorkout();
  const [filter, setFilter] = useState<TimeFilter>('30D');
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    date: string;
    weight: number;
  } | null>(null);

  // Filter records based on time range
  const filteredRecords = useMemo(() => {
    if (!weightRecords.length) return [];
    const sorted = [...weightRecords].sort((a, b) => a.date.localeCompare(b.date));
    const latestDate = new Date(sorted[sorted.length - 1].date);

    let daysToSubtract = 30;
    if (filter === '7D') daysToSubtract = 7;
    else if (filter === '30D') daysToSubtract = 30;
    else if (filter === '90D') daysToSubtract = 90;
    else if (filter === '6M') daysToSubtract = 180;
    else if (filter === '1A') daysToSubtract = 365;
    else if (filter === 'TUDO') return sorted;

    const cutoffDate = new Date(latestDate);
    cutoffDate.setDate(cutoffDate.getDate() - daysToSubtract);

    const result = sorted.filter((r) => new Date(r.date) >= cutoffDate);
    return result.length > 0 ? result : sorted.slice(-5);
  }, [weightRecords, filter]);

  // Statistics calculation
  const stats = useMemo(() => {
    if (!filteredRecords.length) {
      return { current: 0, initial: 0, diff: 0, days: 0 };
    }
    const initial = filteredRecords[0].weight;
    const current = filteredRecords[filteredRecords.length - 1].weight;
    const diff = Number((current - initial).toFixed(1));

    const d1 = new Date(filteredRecords[0].date);
    const d2 = new Date(filteredRecords[filteredRecords.length - 1].date);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const days = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));

    return { current, initial, diff, days };
  }, [filteredRecords]);

  // SVG Chart Dimensions & Calculations
  const chartData = useMemo(() => {
    if (filteredRecords.length < 2) return null;

    const width = 600;
    const height = 220;
    const paddingX = 40;
    const paddingY = 30;

    const weights = filteredRecords.map((r) => r.weight);
    const minWeight = Math.floor(Math.min(...weights) - 0.5);
    const maxWeight = Math.ceil(Math.max(...weights) + 0.5);
    const weightRange = maxWeight - minWeight || 1;

    const usableWidth = width - paddingX * 2;
    const usableHeight = height - paddingY * 2;

    const points = filteredRecords.map((record, index) => {
      const x = paddingX + (index / (filteredRecords.length - 1)) * usableWidth;
      const normalizedY = (record.weight - minWeight) / weightRange;
      const y = height - paddingY - normalizedY * usableHeight;
      return { x, y, date: record.date, weight: record.weight };
    });

    // Build SVG path
    let linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      // Smooth cubic bezier
      const prev = points[i - 1];
      const curr = points[i];
      const cp1x = prev.x + (curr.x - prev.x) / 2;
      const cp1y = prev.y;
      const cp2x = prev.x + (curr.x - prev.x) / 2;
      const cp2y = curr.y;
      linePath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }

    // Area path for gradient fill
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

    return {
      width,
      height,
      paddingX,
      paddingY,
      minWeight,
      maxWeight,
      points,
      linePath,
      areaPath,
    };
  }, [filteredRecords]);

  return (
    <div className="bg-[#111B2A] border border-[#1E2B3D] rounded-3xl p-5 lg:p-6 shadow-xl">
      {/* Header & Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#1E2B3D]">
        <div>
          <span className="text-[11px] font-extrabold text-[#4DA3FF] tracking-wider uppercase">
            ACOMPANHAMENTO DIÁRIO
          </span>
          <h3 className="text-lg lg:text-xl font-black text-white uppercase tracking-wide">
            EVOLUÇÃO DO PESO
          </h3>
        </div>

        {/* Range Filters: 7D, 30D, 90D, 6M, 1A, TUDO */}
        <div className="flex items-center gap-1 bg-[#070B12] p-1 rounded-xl border border-[#1E2B3D] overflow-x-auto">
          {(['7D', '30D', '90D', '6M', '1A', 'TUDO'] as TimeFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 text-xs font-black rounded-lg transition-all ${
                filter === f
                  ? 'bg-[#1677FF] text-white shadow-md shadow-[#1677FF]/30'
                  : 'text-[#8B98AA] hover:text-white hover:bg-[#15243A]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Evolution Summary Cards (PRD Section 28) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
        {/* Peso Atual */}
        <div className="p-3.5 rounded-2xl bg-[#0D1420] border border-[#1E2B3D]">
          <span className="text-[10px] font-extrabold text-[#8B98AA] tracking-wider uppercase block mb-1">
            PESO ATUAL
          </span>
          <p className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {stats.current.toFixed(1).replace('.', ',')}{' '}
            <span className="text-xs font-semibold text-[#8B98AA]">kg</span>
          </p>
        </div>

        {/* Peso Inicial */}
        <div className="p-3.5 rounded-2xl bg-[#0D1420] border border-[#1E2B3D]">
          <span className="text-[10px] font-extrabold text-[#8B98AA] tracking-wider uppercase block mb-1">
            PESO INICIAL
          </span>
          <p className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {stats.initial.toFixed(1).replace('.', ',')}{' '}
            <span className="text-xs font-semibold text-[#8B98AA]">kg</span>
          </p>
        </div>

        {/* Variação */}
        <div className="p-3.5 rounded-2xl bg-[#0D1420] border border-[#1E2B3D]">
          <span className="text-[10px] font-extrabold text-[#8B98AA] tracking-wider uppercase block mb-1">
            VARIAÇÃO
          </span>
          <div className="flex items-center gap-1.5">
            {stats.diff < 0 ? (
              <TrendingDown className="w-4 h-4 text-[#22C55E]" />
            ) : stats.diff > 0 ? (
              <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
            ) : (
              <Minus className="w-4 h-4 text-[#8B98AA]" />
            )}
            <p
              className={`text-xl sm:text-2xl font-black tracking-tight ${
                stats.diff < 0
                  ? 'text-[#22C55E]'
                  : stats.diff > 0
                  ? 'text-[#F59E0B]'
                  : 'text-[#8B98AA]'
              }`}
            >
              {formatWeightVariation(stats.diff)}
            </p>
          </div>
        </div>

        {/* Período */}
        <div className="p-3.5 rounded-2xl bg-[#0D1420] border border-[#1E2B3D]">
          <span className="text-[10px] font-extrabold text-[#8B98AA] tracking-wider uppercase block mb-1">
            PERÍODO
          </span>
          <p className="text-xl sm:text-2xl font-black text-[#4DA3FF] tracking-tight">
            {stats.days}{' '}
            <span className="text-xs font-semibold text-[#8B98AA]">
              {stats.days === 1 ? 'dia' : 'dias'}
            </span>
          </p>
        </div>
      </div>

      {/* Line Chart Graphic */}
      <div className="relative w-full overflow-hidden bg-[#070B12]/80 border border-[#1E2B3D] rounded-2xl p-2 pt-4">
        {chartData ? (
          <div className="relative w-full">
            <svg
              viewBox={`0 0 ${chartData.width} ${chartData.height}`}
              className="w-full h-48 sm:h-56 overflow-visible"
            >
              <defs>
                <linearGradient id="weightAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1677FF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1677FF" stopOpacity="0.0" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#1677FF" floodOpacity="0.4" />
                </filter>
              </defs>

              {/* Horizontal grid lines */}
              {[0, 0.5, 1].map((fraction, i) => {
                const y =
                  chartData.height -
                  chartData.paddingY -
                  fraction * (chartData.height - chartData.paddingY * 2);
                const weightVal = (
                  chartData.minWeight +
                  fraction * (chartData.maxWeight - chartData.minWeight)
                ).toFixed(1);

                return (
                  <g key={i}>
                    <line
                      x1={chartData.paddingX}
                      y1={y}
                      x2={chartData.width - chartData.paddingX}
                      y2={y}
                      stroke="#1E2B3D"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text
                      x={chartData.paddingX - 8}
                      y={y + 4}
                      fill="#8B98AA"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="end"
                    >
                      {weightVal}
                    </text>
                  </g>
                );
              })}

              {/* Area gradient */}
              <path d={chartData.areaPath} fill="url(#weightAreaGrad)" />

              {/* Line path */}
              <path
                d={chartData.linePath}
                fill="none"
                stroke="#1677FF"
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#glow)"
              />

              {/* Points on line */}
              {chartData.points.map((pt, idx) => (
                <g key={idx} className="cursor-pointer">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPoint?.date === pt.date ? '7' : '4.5'}
                    fill="#1677FF"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-all"
                  />
                  {/* Invisible larger hit target */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="16"
                    fill="transparent"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    onClick={() => setHoveredPoint(pt)}
                  />
                </g>
              ))}
            </svg>

            {/* Hover Tooltip */}
            {hoveredPoint && (
              <div
                className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full bg-[#15243A] border border-[#1677FF] rounded-xl px-3 py-1.5 shadow-2xl transition-all"
                style={{
                  left: `${(hoveredPoint.x / chartData.width) * 100}%`,
                  top: `${(hoveredPoint.y / chartData.height) * 100}%`,
                  marginTop: '-12px',
                }}
              >
                <p className="text-[10px] font-bold text-[#8B98AA] text-center">
                  {formatBrazilianDate(hoveredPoint.date)}
                </p>
                <p className="text-sm font-black text-white text-center">
                  {hoveredPoint.weight.toFixed(1).replace('.', ',')}{' '}
                  <span className="text-[10px] text-[#4DA3FF]">kg</span>
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-sm text-[#8B98AA]">
            Registros insuficientes para o período selecionado.
          </div>
        )}

        {/* Date labels on bottom */}
        {chartData && (
          <div className="flex justify-between px-10 pt-2 text-[10px] font-bold text-[#8B98AA]">
            <span>{formatBrazilianDate(chartData.points[0].date)}</span>
            <span>
              {formatBrazilianDate(chartData.points[chartData.points.length - 1].date)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
