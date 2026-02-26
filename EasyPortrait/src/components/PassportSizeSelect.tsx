import React, { useState } from 'react';
import { PassportSize } from '../types';
import { PASSPORT_SIZES } from '../constants';
import { Check, Ruler } from 'lucide-react';

interface PassportSizeSelectProps {
  selected: PassportSize | null;
  onSelect: (size: PassportSize) => void;
}

export const PassportSizeSelect: React.FC<PassportSizeSelectProps> = ({ selected, onSelect }) => {
  const [customW, setCustomW] = useState(35);
  const [customH, setCustomH] = useState(45);
  const isCustomSelected = selected?.id === 'custom';

  const handleCustomApply = () => {
    const w = Math.max(10, Math.min(200, customW));
    const h = Math.max(10, Math.min(200, customH));
    onSelect({ id: 'custom', name: 'Custom', country: 'Custom', widthMm: w, heightMm: h });
  };

  return (
    <div className="space-y-3">
      <p className="font-semibold text-gray-900 dark:text-slate-100">Select Passport Size</p>
      <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
        {PASSPORT_SIZES.map((size) => (
          <button
            key={size.id}
            onClick={() => onSelect(size)}
            className={`p-3 rounded-lg text-left transition-all flex items-start justify-between ${
              selected?.id === size.id
                ? 'bg-primary text-white ring-2 ring-blue-200'
                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700'
            }`}
          >
            <div>
              <p className="font-medium dark:text-slate-100">{size.name}</p>
              <p className={`text-sm ${selected?.id === size.id ? 'text-blue-100' : 'text-gray-600 dark:text-slate-400'}`}>
                {size.widthMm}×{size.heightMm}mm
                {size.widthInch && ` / ${size.widthInch}"×${size.heightInch}"`}
              </p>
            </div>
            {selected?.id === size.id && <Check className="h-5 w-5 mt-0.5 flex-shrink-0" />}
          </button>
        ))}

        {/* Custom Size */}
        <div
          className={`p-3 rounded-lg transition-all border ${
            isCustomSelected
              ? 'bg-primary/5 border-primary ring-2 ring-primary/30'
              : 'bg-gray-50 border-gray-200 dark:bg-slate-800 dark:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Ruler className={`h-4 w-4 ${isCustomSelected ? 'text-primary' : 'text-gray-500 dark:text-slate-400'}`} />
            <p className={`font-medium text-sm ${isCustomSelected ? 'text-primary' : 'text-gray-900 dark:text-slate-100'}`}>
              Custom Size
            </p>
            {isCustomSelected && <Check className="h-4 w-4 text-primary ml-auto" />}
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-[10px] text-gray-500 dark:text-slate-400 mb-0.5">Width (mm)</label>
              <input
                type="number"
                min="10"
                max="200"
                value={customW}
                onChange={(e) => setCustomW(parseFloat(e.target.value) || 10)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-md"
              />
            </div>
            <span className="text-gray-400 dark:text-slate-500 pb-1.5">×</span>
            <div className="flex-1">
              <label className="block text-[10px] text-gray-500 dark:text-slate-400 mb-0.5">Height (mm)</label>
              <input
                type="number"
                min="10"
                max="200"
                value={customH}
                onChange={(e) => setCustomH(parseFloat(e.target.value) || 10)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-md"
              />
            </div>
            <button
              onClick={handleCustomApply}
              className="px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition flex-shrink-0"
            >
              Apply
            </button>
          </div>
          {isCustomSelected && (
            <p className="text-xs text-primary mt-1.5">
              Using {selected.widthMm}×{selected.heightMm}mm
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
