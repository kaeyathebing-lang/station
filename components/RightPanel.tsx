import React from 'react';
import { ViewState, TimeMode, AssessmentTag } from '../types';
import { generateTimeSeries } from '../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, LineChart, Line, Legend, BarChart, Bar } from 'recharts';
import { AlertCircle, TrendingUp, DollarSign, FileText, CheckCircle, AlertTriangle, XCircle, Users, Leaf } from 'lucide-react';

interface RightPanelProps {
  viewState: ViewState;
  timeMode: TimeMode;
}

const RightPanel: React.FC<RightPanelProps> = ({ viewState, timeMode }) => {
  const dataPoints = 24;
  const isStation = viewState === ViewState.S2_STATION;
  
  // Data Generation based on TimeMode to ensure visual consistency
  const baseValue = timeMode === TimeMode.PREDICTION ? 120 : 80;
  const variance = timeMode === TimeMode.CURRENT ? 20 : 5;
  
  const mainSeriesData = generateTimeSeries(dataPoints, baseValue, variance);
  const orderSeriesData = generateTimeSeries(dataPoints, 40, 15);

  const renderAssessmentTags = () => {
    const tags: AssessmentTag[] = [
      { label: '营收增长乏力', type: 'warning', evidence: '环比下降 12%' },
      { label: '尖峰时段拥堵', type: 'danger', evidence: '18:00 排队 > 15车' },
      { label: '用户粘性高', type: 'info', evidence: '复购率 68%' },
    ];

    return (
      <div className="bg-slate-800 p-3 rounded-lg border border-slate-600 mb-3 shadow-lg shrink-0">
        <h3 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
          <FileText size={12} className="text-cyan-400"/> 智能经营诊断
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {tags.map((tag, i) => (
            <div key={i} className="flex justify-between items-center bg-slate-900/50 p-2 rounded border-l-2 border-slate-600">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${
                tag.type === 'danger' ? 'text-rose-400 bg-rose-900/20' :
                tag.type === 'warning' ? 'text-amber-400 bg-amber-900/20' :
                'text-blue-400 bg-blue-900/20'
              }`}>
                {tag.type === 'danger' ? <XCircle size={8}/> : tag.type === 'warning' ? <AlertTriangle size={8}/> : <CheckCircle size={8}/>}
                {tag.label}
              </span>
              <span className="text-[10px] text-slate-500 truncate max-w-[120px]">{tag.evidence}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3 h-full overflow-hidden">
      <div className="mb-1 flex justify-between items-end shrink-0">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
          {isStation ? '单站动态经营' : '区域动态分析'}
        </h2>
        <div className={`text-[10px] px-2 py-0.5 rounded border ${
           timeMode === TimeMode.PREDICTION ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 
           timeMode === TimeMode.HISTORY ? 'bg-slate-500/20 text-slate-300 border-slate-500/30' :
           'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
        }`}>
          {timeMode === TimeMode.PREDICTION ? '趋势预测模式' : timeMode === TimeMode.HISTORY ? '历史数据回放' : '实时数据流'}
        </div>
      </div>

      {isStation && renderAssessmentTags()}

      {/* Chart 1: Revenue or Load (Flex 1) */}
      <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/50 flex-1 flex flex-col min-h-0">
        <h3 className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-2 shrink-0">
          {isStation ? <DollarSign size={12} className="text-emerald-400"/> : <TrendingUp size={12} className="text-emerald-400"/>}
          {isStation ? '实时充电流水曲线' : '区域营收趋势'}
        </h3>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mainSeriesData} margin={{top: 5, right: 0, left: -20, bottom: 0}}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="time" tick={{fontSize: 9, fill: '#64748b'}} stroke="#475569" interval={5} />
              <YAxis tick={{fontSize: 9, fill: '#64748b'}} stroke="#475569" />
              <ReTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '10px', padding: '5px' }} itemStyle={{padding: 0}} />
              <Area 
                type="monotone" 
                dataKey="value" 
                name="营收额" 
                stroke="#10b981" 
                strokeWidth={2} 
                fill="url(#colorRev)" 
                animationDuration={1000}
              />
              {timeMode === TimeMode.PREDICTION && (
                 <Area type="monotone" dataKey="value3" name="预测营收" stroke="#a855f7" strokeDasharray="3 3" fill="none" />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: User Activity / Queue (Flex 1) */}
      <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/50 flex-1 flex flex-col min-h-0">
        <h3 className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-2 shrink-0">
          <Users size={12} className="text-blue-400"/> 
          {isStation ? '用户排队与在桩热度' : '区域用户活跃度'}
        </h3>
        <div className="flex-1 w-full min-h-0">
           <ResponsiveContainer width="100%" height="100%">
            <BarChart data={orderSeriesData} margin={{top: 5, right: 0, left: -20, bottom: 0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="time" tick={{fontSize: 9, fill: '#64748b'}} stroke="#475569" interval={5} />
              <YAxis tick={{fontSize: 9, fill: '#64748b'}} stroke="#475569" />
              <ReTooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '10px' }} />
              <Bar dataKey="value" name="在桩人数" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="value2" name="排队人数" fill="#f59e0b" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Carbon Reduction (Fixed Height) */}
      <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/50 flex-none h-[120px] flex flex-col shrink-0">
        <h3 className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-2">
          <Leaf size={12} className="text-emerald-400"/> 碳减排趋势 (kg)
        </h3>
         <div className="flex-1 w-full">
           <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mainSeriesData} margin={{top: 5, right: 0, left: -20, bottom: 0}}>
              <defs>
                <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{fontSize: 9, fill: '#64748b'}} stroke="#475569" interval={5} />
              <YAxis tick={{fontSize: 9, fill: '#64748b'}} stroke="#475569" />
              <Area type="monotone" dataKey="value2" stroke="#22c55e" strokeWidth={2} fill="url(#colorCarbon)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default RightPanel;