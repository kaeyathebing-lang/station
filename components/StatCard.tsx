import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number; // percentage
  icon?: React.ReactNode;
  variant?: 'default' | 'alert' | 'success';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, unit, trend, icon, variant = 'default' }) => {
  const borderColor = 
    variant === 'alert' ? 'border-rose-500/50' : 
    variant === 'success' ? 'border-emerald-500/50' : 
    'border-slate-700';
    
  const bgGradient = 
    variant === 'alert' ? 'bg-gradient-to-br from-rose-900/20 to-slate-800' :
    variant === 'success' ? 'bg-gradient-to-br from-emerald-900/20 to-slate-800' :
    'bg-slate-800/50';

  return (
    <div className={`p-3 rounded-lg border ${borderColor} ${bgGradient} backdrop-blur-sm shadow-sm relative overflow-hidden group`}>
      <div className="flex justify-between items-start mb-1">
        <span className="text-slate-400 text-[10px] font-medium uppercase tracking-wider">{title}</span>
        {icon && <span className="text-slate-500 group-hover:text-cyan-400 transition-colors">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-bold text-white font-mono leading-none">{value}</span>
        {unit && <span className="text-[10px] text-slate-500">{unit}</span>}
      </div>
      {trend !== undefined && (
        <div className={`text-[9px] mt-0.5 ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
      {/* Decorative accent */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default StatCard;