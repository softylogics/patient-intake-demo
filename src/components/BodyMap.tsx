import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

type Shape =
  | { type: 'ellipse'; cx: number; cy: number; rx: number; ry: number }
  | { type: 'rect'; x: number; y: number; width: number; height: number; rx: number }
  | { type: 'path'; d: string };

interface Region {
  id: string;
  name: string;
  shape: Shape;
}

const SHAPES = {
  head: { type: 'ellipse', cx: 50, cy: 15, rx: 9, ry: 11 },
  neck: { type: 'rect', x: 45, y: 24, width: 10, height: 9, rx: 2 },
  shoulderL: { type: 'ellipse', cx: 31, cy: 41, rx: 8, ry: 7 },
  shoulderR: { type: 'ellipse', cx: 69, cy: 41, rx: 8, ry: 7 },
  chest: { type: 'path', d: 'M29,44 Q31,37 39,36 L61,36 Q69,37 71,44 L67,58 Q50,62 33,58 Z' },
  abdomen: { type: 'path', d: 'M34,58 Q50,62 66,58 L62,77 Q50,81 38,77 Z' },
  armL: { type: 'path', d: 'M30,46 Q18,52 17,66 Q16,80 21,90 Q24,94 28,91 Q25,80 26,68 Q28,56 33,48 Z' },
  armR: { type: 'path', d: 'M70,46 Q82,52 83,66 Q84,80 79,90 Q76,94 72,91 Q75,80 74,68 Q72,56 67,48 Z' },
  handL: { type: 'ellipse', cx: 22, cy: 93, rx: 5, ry: 6 },
  handR: { type: 'ellipse', cx: 78, cy: 93, rx: 5, ry: 6 },
  hipL: { type: 'ellipse', cx: 40, cy: 79, rx: 9, ry: 7 },
  hipR: { type: 'ellipse', cx: 60, cy: 79, rx: 9, ry: 7 },
  legL: { type: 'path', d: 'M34,80 Q33,98 37,114 Q38,122 42,122 Q46,122 46,114 Q45,98 46,80 Z' },
  legR: { type: 'path', d: 'M66,80 Q67,98 63,114 Q62,122 58,122 Q54,122 54,114 Q55,98 54,80 Z' },
  kneeL: { type: 'ellipse', cx: 40, cy: 100, rx: 6, ry: 5 },
  kneeR: { type: 'ellipse', cx: 60, cy: 100, rx: 6, ry: 5 },
  footL: { type: 'ellipse', cx: 40, cy: 124, rx: 7, ry: 3.5 },
  footR: { type: 'ellipse', cx: 60, cy: 124, rx: 7, ry: 3.5 },
} as const;

const frontRegions: Region[] = [
  { id: 'head', name: 'head', shape: SHAPES.head },
  { id: 'neck', name: 'neck', shape: SHAPES.neck },
  { id: 'chest', name: 'chest', shape: SHAPES.chest },
  { id: 'abdomen', name: 'abdomen', shape: SHAPES.abdomen },
  { id: 'left_shoulder', name: 'shoulder', shape: SHAPES.shoulderL },
  { id: 'right_shoulder', name: 'shoulder', shape: SHAPES.shoulderR },
  { id: 'left_arm', name: 'arm', shape: SHAPES.armL },
  { id: 'right_arm', name: 'arm', shape: SHAPES.armR },
  { id: 'left_hand', name: 'hand', shape: SHAPES.handL },
  { id: 'right_hand', name: 'hand', shape: SHAPES.handR },
  { id: 'left_hip', name: 'hip', shape: SHAPES.hipL },
  { id: 'right_hip', name: 'hip', shape: SHAPES.hipR },
  { id: 'left_leg', name: 'leg', shape: SHAPES.legL },
  { id: 'right_leg', name: 'leg', shape: SHAPES.legR },
  { id: 'left_knee', name: 'knee', shape: SHAPES.kneeL },
  { id: 'right_knee', name: 'knee', shape: SHAPES.kneeR },
  { id: 'left_foot', name: 'foot', shape: SHAPES.footL },
  { id: 'right_foot', name: 'foot', shape: SHAPES.footR },
];

const backRegions: Region[] = [
  { id: 'head_back', name: 'head', shape: SHAPES.head },
  { id: 'neck_back', name: 'neck', shape: SHAPES.neck },
  { id: 'upper_back', name: 'upper_back', shape: SHAPES.chest },
  { id: 'lower_back', name: 'lower_back', shape: SHAPES.abdomen },
  { id: 'left_shoulder_back', name: 'shoulder', shape: SHAPES.shoulderL },
  { id: 'right_shoulder_back', name: 'shoulder', shape: SHAPES.shoulderR },
  { id: 'left_arm_back', name: 'arm', shape: SHAPES.armL },
  { id: 'right_arm_back', name: 'arm', shape: SHAPES.armR },
  { id: 'left_hand_back', name: 'hand', shape: SHAPES.handL },
  { id: 'right_hand_back', name: 'hand', shape: SHAPES.handR },
  { id: 'left_hip_back', name: 'hip', shape: SHAPES.hipL },
  { id: 'right_hip_back', name: 'hip', shape: SHAPES.hipR },
  { id: 'left_leg_back', name: 'leg', shape: SHAPES.legL },
  { id: 'right_leg_back', name: 'leg', shape: SHAPES.legR },
  { id: 'left_knee_back', name: 'knee', shape: SHAPES.kneeL },
  { id: 'right_knee_back', name: 'knee', shape: SHAPES.kneeR },
  { id: 'left_foot_back', name: 'foot', shape: SHAPES.footL },
  { id: 'right_foot_back', name: 'foot', shape: SHAPES.footR },
];

interface BodyMapProps {
  selectedArea: string | null;
  onSelectArea: (areaId: string) => void;
  highlightOnly?: boolean;
}

export const BodyMap: React.FC<BodyMapProps> = ({ selectedArea, onSelectArea, highlightOnly = false }) => {
  const { t } = useLanguage();
  const isBackArea = (area: string | null) =>
    !!area && (area === 'upper_back' || area === 'lower_back' || area.endsWith('_back'));
  const [currentView, setCurrentView] = useState<'front' | 'back'>(
    highlightOnly && isBackArea(selectedArea) ? 'back' : 'front'
  );
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const regions = currentView === 'front' ? frontRegions : backRegions;
  const interactive = !highlightOnly;
  const updateTooltip = (e: React.MouseEvent, name: string) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      label: t(name),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-4">
        <button
          type="button"
          onClick={() => setCurrentView('front')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentView === 'front'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {t('front_view')}
        </button>
        <button
          type="button"
          onClick={() => setCurrentView('back')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentView === 'back'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {t('back_view')}
        </button>
      </div>

      <div ref={containerRef} className="relative" role="img" aria-label="Human body diagram">
        <svg
          viewBox="0 0 100 132"
          className="w-full max-w-md mx-auto"
          preserveAspectRatio="xMidYMid meet"
        >
          {currentView === 'back' && (
            <path
              d="M50 36 L50 77"
              stroke="#9ca3af"
              strokeWidth="1"
              strokeDasharray="3,3"
              fill="none"
            />
          )}

          {regions.map((region) => {
            const isSelected = selectedArea === region.id || selectedArea === region.name;
            const isHovered = hovered === region.id;
            const fill = isSelected ? '#3b82f6' : isHovered ? '#93c5fd' : '#e5e7eb';
            const stroke = isSelected ? '#2563eb' : isHovered ? '#60a5fa' : '#cbd5e1';

            const handlers = interactive
              ? {
                  onMouseEnter: (e: React.MouseEvent) => {
                    setHovered(region.id);
                    updateTooltip(e, region.name);
                  },
                  onMouseMove: (e: React.MouseEvent) => updateTooltip(e, region.name),
                  onMouseLeave: () => {
                    setHovered(null);
                    setTooltip(null);
                  },
                  onClick: () => onSelectArea(region.id),
                  onKeyDown: (e: React.KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') onSelectArea(region.id);
                  },
                }
              : {};

            const baseProps = {
              fill,
              stroke,
              strokeWidth: 1.5,
              className: interactive ? 'cursor-pointer transition-colors' : '',
              role: interactive ? ('button' as const) : undefined,
              tabIndex: interactive ? 0 : undefined,
              'aria-label': t(region.name),
              'aria-pressed': isSelected,
              ...handlers,
            };

            if (region.shape.type === 'ellipse') {
              return (
                <ellipse
                  key={region.id}
                  cx={region.shape.cx}
                  cy={region.shape.cy}
                  rx={region.shape.rx}
                  ry={region.shape.ry}
                  {...baseProps}
                />
              );
            }
            if (region.shape.type === 'rect') {
              return (
                <rect
                  key={region.id}
                  x={region.shape.x}
                  y={region.shape.y}
                  width={region.shape.width}
                  height={region.shape.height}
                  rx={region.shape.rx}
                  {...baseProps}
                />
              );
            }
            return <path key={region.id} d={region.shape.d} {...baseProps} />;
          })}
        </svg>

        {tooltip && interactive && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded bg-gray-900 px-2 py-1 text-xs font-medium text-white shadow-lg whitespace-nowrap"
            style={{ left: tooltip.x, top: tooltip.y - 10 }}
          >
            {tooltip.label}
          </div>
        )}

        {interactive && selectedArea && (
          <div className="mt-4 text-center">
            <p className="text-lg font-medium text-gray-900">
              {t('selected_area')}{' '}
              <span className="text-blue-600">
                {t(selectedArea.replace(/_/g, ' ')) || selectedArea}
              </span>
            </p>
            <p className="mt-1 text-sm text-gray-500">{t('cant_find')}</p>
          </div>
        )}
      </div>
    </div>
  );
};