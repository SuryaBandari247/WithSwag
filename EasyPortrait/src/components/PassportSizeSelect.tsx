import React from 'react';
import { PassportSize } from '../types';
import { PASSPORT_SIZES } from '../constants';
import { Check } from 'lucide-react';

interface PassportSizeSelectProps {
  selected: PassportSize | null;
  onSelect: (size: PassportSize) => void;
}

export const PassportSizeSelect: React.FC<PassportSizeSelectProps> = ({ selected, onSelect }) => {
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
      </div>
    </div>
  );
};
