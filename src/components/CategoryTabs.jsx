import React from 'react';
import { Target, Plus } from 'lucide-react';

export default function CategoryTabs({ categories, selectedCatId, onSelect, onOpenAddGoal }) {
  return (
    <div className="overflow-x-auto py-3 px-5 flex gap-2 no-scrollbar items-center">
      {/* Button to add a new custom goal */}
      <button
        onClick={onOpenAddGoal}
        className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold whitespace-nowrap bg-indigo-50 border border-indigo-200 text-indigo-700 shadow-sm active:scale-95"
      >
        <Plus className="w-3.5 h-3.5" /> New Goal
      </button>

      {/* Dynamic Goals */}
      {categories.map((cat) => {
        const isSelected = cat.id === selectedCatId;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
              isSelected 
                ? 'bg-slate-900 text-white shadow-slate-300' 
                : 'bg-white text-slate-600 border border-slate-200/80'
            }`}
          >
            <Target className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
            {cat.badge || cat.name}
          </button>
        );
      })}
    </div>
  );
}