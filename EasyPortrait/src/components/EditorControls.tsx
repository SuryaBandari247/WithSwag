import React, { useState } from 'react';
import { Area } from 'react-easy-crop';
import { PassportSize } from '../types';
import { DPI_OPTIONS, DEFAULT_DPI } from '../constants';
import { ChevronDown } from 'lucide-react';

interface EditorControlsProps {
  passportSize: PassportSize | null;
  dpi: number;
  onPassportSizeChange: (size: PassportSize) => void;
  onDpiChange: (dpi: number) => void;
  onBack: () => void;
}

export const EditorControls: React.FC<EditorControlsProps> = ({
  passportSize,
  dpi,
  onPassportSizeChange,
  onDpiChange,
  onBack,
}) => {
  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {/* DPI Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Quality (DPI)</label>
        <div className="space-y-1">
          {DPI_OPTIONS.map((option) => (
            <label key={option} className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 rounded">
              <input
                type="radio"
                name="dpi"
                value={option}
                checked={dpi === option}
                onChange={(e) => onDpiChange(parseInt(e.target.value))}
                className="h-4 w-4 text-primary"
              />
              <span className="text-sm dark:text-slate-300">
                {option} DPI
                {option === 300 && <span className="text-gray-500 dark:text-slate-500 ml-1">(Recommended)</span>}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3 text-sm text-blue-800 dark:text-blue-200">
        <p className="font-medium mb-1">DPI Explained</p>
        <ul className="text-xs space-y-1">
          <li>• <span className="font-medium">300 DPI:</span> Professional printing quality (recommended)</li>
          <li>• <span className="font-medium">600 DPI:</span> High quality, larger file size</li>
          <li>• <span className="font-medium">150 DPI:</span> Web quality</li>
        </ul>
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg font-medium transition"
      >
        Back
      </button>
    </div>
  );
};
