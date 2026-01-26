import React, { useState, useEffect } from 'react';
import { Wifi, Sun } from 'lucide-react';

const Header: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-slate-900/95 border-b border-slate-700 flex items-center justify-between px-6 backdrop-blur-md z-50 select-none shadow-lg">
      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
          <Wifi className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-blue-400 tracking-wide font-sans">
            场站服务能力评估平台
          </h1>
          <div className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-mono leading-none mt-0.5">
            Station Service Capability Assessment
          </div>
        </div>
        
        <div className="ml-4 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          实时在线
        </div>
      </div>

      <div className="flex items-center gap-6 text-slate-400 text-sm font-mono">
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-400" />
          <span className="font-sans">深圳市 28°C 晴</span>
        </div>
        <div className="h-4 w-px bg-slate-700"></div>
        <div>{time.toLocaleDateString('zh-CN')}</div>
        <div className="text-slate-200 font-bold text-lg">{time.toLocaleTimeString('en-US', {hour12: false})}</div>
        <div className="h-4 w-px bg-slate-700"></div>
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span className="font-sans">数据延迟: 30ms</span>
        </div>
      </div>
    </header>
  );
};

export default Header;