import React from 'react';
import { Square, Circle, Type, Wand2 } from 'lucide-react';
import { ShapeType } from '../types';

interface ToolbarProps {
  onAddShape: (type: ShapeType) => void;
  onOpenAI: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddShape, onOpenAI }) => {
  return (
    <div className="w-16 bg-slate-800 border-r border-slate-700 flex flex-col items-center py-4 gap-4 z-10">
      <div className="mb-4">
        <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-sky-900/50">
          C
        </div>
      </div>
      
      <button 
        onClick={() => onAddShape(ShapeType.RECTANGLE)}
        className="p-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-200 transition-all hover:scale-105 tooltip-container group relative"
      >
        <Square size={20} />
        <span className="absolute left-14 bg-slate-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700 pointer-events-none">
          Rectangle
        </span>
      </button>

      <button 
        onClick={() => onAddShape(ShapeType.CIRCLE)}
        className="p-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-200 transition-all hover:scale-105 group relative"
      >
        <Circle size={20} />
         <span className="absolute left-14 bg-slate-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700 pointer-events-none">
          Circle
        </span>
      </button>

      <button 
        onClick={() => onAddShape(ShapeType.TEXT)}
        className="p-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-200 transition-all hover:scale-105 group relative"
      >
        <Type size={20} />
         <span className="absolute left-14 bg-slate-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700 pointer-events-none">
          Text
        </span>
      </button>

      <div className="flex-1"></div>

      <button 
        onClick={onOpenAI}
        className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 rounded-xl text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 animate-pulse-slow group relative"
      >
        <Wand2 size={20} />
        <span className="absolute left-14 bg-slate-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700 pointer-events-none">
          AI Assistant
        </span>
      </button>
    </div>
  );
};

export default Toolbar;
