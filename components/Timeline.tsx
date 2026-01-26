import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface TimelineProps {
  timelineValue: number;
  setTimelineValue: (val: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({ timelineValue, setTimelineValue }) => {
  
  const formatTime = (val: number) => {
    const hours = Math.floor(val / 4);
    const minutes = (val % 4) * 15;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  return (
    <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 border border-slate-700 backdrop-blur-md rounded-xl p-3 flex flex-col gap-1 z-30 shadow-2xl">
      
      {/* Controls & Time Display */}
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-3 text-slate-300">
           <div className="flex gap-1">
             <button className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"><SkipBack size={16}/></button>
             <button className="p-1.5 bg-cyan-600 hover:bg-cyan-500 rounded-full text-white shadow-lg shadow-cyan-900/50 transition-all hover:scale-105 active:scale-95">
                <Play size={16} fill="currentColor" className="ml-0.5"/>
             </button>
             <button className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"><SkipForward size={16}/></button>
           </div>
           <span className="text-xs text-slate-400">时间轴控制</span>
        </div>

        <div className="flex items-baseline gap-2">
           <span className="text-xs text-slate-500">当前选定时间</span>
           <span className="font-mono text-2xl font-bold text-cyan-400 drop-shadow-lg">{formatTime(timelineValue)}</span>
        </div>
      </div>

      {/* Slider */}
      <div className="relative h-8 flex items-center group px-2">
         {/* Ticks */}
         <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 flex justify-between pointer-events-none">
            {[0, 24, 48, 72, 96].map((tick) => (
               <div key={tick} className="flex flex-col items-center gap-1">
                  <div className="h-2 w-px bg-slate-600"></div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {Math.floor(tick/4).toString().padStart(2,'0')}:00
                  </span>
               </div>
            ))}
         </div>
         {/* Track Background */}
         <div className="absolute left-2 right-2 h-1.5 bg-slate-700 rounded-full"></div>
         {/* Active Track */}
         <div className="absolute left-2 h-1.5 bg-cyan-600 rounded-full pointer-events-none" style={{ width: `calc(${(timelineValue / 96) * 100}% - 4px)` }}></div>
         
         <input
           type="range"
           min="0"
           max="96"
           value={timelineValue}
           onChange={(e) => setTimelineValue(parseInt(e.target.value))}
           className="w-full h-8 opacity-0 cursor-pointer z-10"
         />
         
         {/* Custom Thumb (Pseudo-element approximation for React) */}
         <div 
            className="absolute h-4 w-4 bg-white rounded-full shadow-lg shadow-black/50 pointer-events-none transition-transform duration-75 ease-out"
            style={{ left: `calc(${(timelineValue / 96) * 100}% - 8px)` }}
         >
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500"></div>
         </div>
      </div>
      
    </div>
  );
};

export default Timeline;