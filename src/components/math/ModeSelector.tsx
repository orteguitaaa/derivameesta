'use client';

import { Category } from '@/lib/data/meta';

interface ModeSelectorProps {
  category: Category;
  modeKey: string;
  onChange: (key: string) => void;
}

export function ModeSelector({ category, modeKey, onChange }: ModeSelectorProps) {
  const colorMap: Record<string, string> = {
    sky: 'bg-sky-100 text-sky-700 border-sky-200',
    emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    rose: 'bg-rose-100 text-rose-700 border-rose-200',
  };

  const activeColorMap: Record<string, string> = {
    sky: 'bg-sky-500 text-white border-sky-500 shadow-lg shadow-sky-200',
    emerald: 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-200',
    rose: 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-200',
  };

  return (
    <div className="flex flex-wrap gap-2">
      {category.modes.map((mode) => {
        const isActive = modeKey === mode.key;
        const colorClass = isActive
          ? activeColorMap[category.color] || activeColorMap.sky
          : colorMap[category.color] || colorMap.sky;

        return (
          <button
            key={mode.key}
            type="button"
            onClick={() => onChange(mode.key)}
            className={`px-4 py-2 text-xs font-medium rounded-3xl border transition-all duration-200 ${colorClass}`}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}
