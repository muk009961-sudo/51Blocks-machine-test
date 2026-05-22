import React, { useMemo, useState, useRef, useEffect } from 'react';
// @ts-ignore
import svgRawText from './world-map.min.svg?raw';

interface CountryPath {
  d: string;
  className?: string;
}

interface ParsedCountry {
  id: string;
  paths: CountryPath[];
}

interface CountryMetric {
  name: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface WorldMapProps {
  countryData: Record<string, CountryMetric>;
  selectedCountry: string | null;
  onSelectCountry: (id: string | null) => void;
}

export default function WorldMap({ countryData, selectedCountry, onSelectCountry }: WorldMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const mapRef = useRef<SVGSVGElement | null>(null);

  // Parse SVG paths from raw text using DOMParser
  const parsedCountries = useMemo<ParsedCountry[]>(() => {
    if (!svgRawText) return [];
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgRawText, 'image/svg+xml');
      const svgElement = doc.querySelector('svg');
      if (!svgElement) return [];

      const countries: ParsedCountry[] = [];
      const children = Array.from(svgElement.children);

      children.forEach((child) => {
        const tagName = child.tagName.toLowerCase();
        if (tagName === 'path') {
          const id = child.getAttribute('id');
          const d = child.getAttribute('d');
          if (id && d) {
            countries.push({
              id: id.toLowerCase(),
              paths: [{ d, className: child.getAttribute('class') || undefined }],
            });
          }
        } else if (tagName === 'g') {
          const id = child.getAttribute('id');
          if (id) {
            const paths: CountryPath[] = [];
            Array.from(child.children).forEach((grandchild) => {
              if (grandchild.tagName.toLowerCase() === 'path') {
                const d = grandchild.getAttribute('d');
                if (d) {
                  paths.push({
                    d,
                    className: grandchild.getAttribute('class') || undefined,
                  });
                }
              }
            });
            if (paths.length > 0) {
              countries.push({
                id: id.toLowerCase(),
                paths,
              });
            }
          }
        }
      });
      return countries;
    } catch (e) {
      console.error('Error parsing world map SVG:', e);
      return [];
    }
  }, []);

  // Determine country colors based on their click volume
  const getCountryColor = (id: string, isHovered: boolean) => {
    const data = countryData[id];
    const isSelected = selectedCountry === id;

    if (isHovered) {
      return 'var(--chart-1, #3b82f6)';
    }

    if (isSelected) {
      return 'var(--chart-1, #2563eb)';
    }

    if (!data || data.clicks === 0) {
      // Default gray color for unpopulated countries, adapts to dark mode
      return 'rgba(156, 163, 175, 0.15)'; 
    }

    // Color gradient based on traffic (clicks)
    const clicks = data.clicks;
    if (clicks > 1000) return 'rgba(29, 78, 216, 0.85)'; // Deep indigo
    if (clicks > 400) return 'rgba(37, 99, 235, 0.75)';  // Indigo
    if (clicks > 200) return 'rgba(59, 130, 246, 0.65)';  // Blue
    if (clicks > 100) return 'rgba(96, 165, 250, 0.55)';  // Light blue
    return 'rgba(147, 197, 253, 0.45)';                  // Sky blue
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - rect.left + 15,
        y: e.clientY - rect.top - 15,
      });
    }
  };

  const hoveredData = hoveredId ? countryData[hoveredId] : null;

  return (
    <div className="relative w-full h-full flex flex-col justify-between">
      <div className="relative flex-1 min-h-[280px] w-full" onMouseMove={handleMouseMove}>
        <svg
          ref={mapRef}
          viewBox="30.767 241.591 784.077 458.627"
          className="w-full h-full max-h-[380px] select-none"
        >
          <g>
            {parsedCountries.map((country) => {
              const isHovered = hoveredId === country.id;
              const isSelected = selectedCountry === country.id;
              return (
                <g
                  key={country.id}
                  onClick={() => onSelectCountry(isSelected ? null : country.id)}
                  onMouseEnter={() => setHoveredId(country.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="cursor-pointer group"
                >
                  {country.paths.map((p, idx) => (
                    <path
                      key={idx}
                      d={p.d}
                      className="transition-all duration-200 ease-out"
                      fill={getCountryColor(country.id, isHovered)}
                      stroke={isSelected ? '#3b82f6' : 'rgba(255, 255, 255, 0.3)'}
                      strokeWidth={isSelected ? 1.5 : 0.5}
                      style={{
                        filter: isHovered ? 'drop-shadow(0px 2px 4px rgba(0,0,0,0.15))' : 'none',
                      }}
                    />
                  ))}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Hover Tooltip */}
        {hoveredId && (
          <div
            className="absolute z-10 pointer-events-none bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl p-3 text-xs min-w-[150px] transition-all duration-75 text-slate-800 dark:text-slate-100"
            style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
          >
            <div className="flex items-center justify-between mb-1.5 border-b border-slate-100 dark:border-slate-800 pb-1">
              <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {hoveredId}
              </span>
              <span className="text-slate-500 font-medium text-[10px]">
                {hoveredData ? hoveredData.name : 'No Data'}
              </span>
            </div>
            {hoveredData ? (
              <div className="space-y-1">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Clicks:</span>
                  <span className="font-semibold">{hoveredData.clicks.toLocaleString()}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Impressions:</span>
                  <span className="font-semibold">{hoveredData.impressions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">CTR:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {hoveredData.ctr}%
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Position:</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {hoveredData.position}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-slate-400 italic">No search console data recorded</div>
            )}
          </div>
        )}
      </div>

      {/* Legend & Filter Clear Info */}
      <div className="flex items-center justify-between px-2 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span>Clicks:</span>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[rgba(156,163,175,0.15)]"></span>
            <span>0</span>
            <span className="w-2.5 h-2.5 rounded-sm bg-[rgba(147,197,253,0.45)]"></span>
            <span className="w-2.5 h-2.5 rounded-sm bg-[rgba(96,165,250,0.55)]"></span>
            <span className="w-2.5 h-2.5 rounded-sm bg-[rgba(59,130,246,0.65)]"></span>
            <span className="w-2.5 h-2.5 rounded-sm bg-[rgba(37,99,235,0.75)]"></span>
            <span className="w-2.5 h-2.5 rounded-sm bg-[rgba(29,78,216,0.85)]"></span>
            <span>1K+</span>
          </div>
        </div>
        {selectedCountry && (
          <button
            onClick={() => onSelectCountry(null)}
            className="text-blue-500 hover:text-blue-600 font-semibold transition-colors focus:outline-none"
          >
            Clear Map Filter
          </button>
        )}
      </div>
    </div>
  );
}
