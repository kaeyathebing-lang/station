import React from 'react';
import { ViewState, TimeMode, AssessmentTag } from '../types';
import { generateTimeSeries, SPOT_PRICE_DATA, CARBON_FACTOR_DATA, generateOrderSeries, generateServiceCapSeries } from '../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, LineChart, Line, Legend, BarChart, Bar, ComposedChart } from 'recharts';
import { AlertCircle, TrendingUp, DollarSign, FileText, CheckCircle, AlertTriangle, XCircle, Users, Leaf, Zap, BarChart3, Activity } from 'lucide-react';

interface RightPanelProps {
  viewState: ViewState;
  timeMode: TimeMode;
}

const RightPanel: React.FC<RightPanelProps> = ({ viewState, timeMode }) => {
  const dataPoints = 24; 
  const isStation = viewState === ViewState.S2_STATION;
  
  // Data Generation based on TimeMode
  const baseValue = timeMode === TimeMode.PREDICTION ? 120 : 80;
  const variance = timeMode === TimeMode.CURRENT ? 20 : 5;
  
  const mainSeriesData = generateTimeSeries(dataPoints, baseValue, variance);
  const orderCountData = generateOrderSeries(dataPoints, 45, 10);
  const serviceCapData = generateServiceCapSeries(dataPoints);

  // Ensure "User Activity" (People count) is integer
  const userActivityData = generateTimeSeries(dataPoints, 40, 15).map(d => ({
    ...d,
    value: Math.round(d.value)
  }));

  const renderAssessmentTags = () => {
    const tags: AssessmentTag[] = [
      { label: '营收增长乏力', type: 'warning', evidence: '环比下降 12%' },
      { label: '尖峰时段拥堵', type: 'danger', evidence: '18:00 排队 > 15车' },
      { label: '用户粘性高', type: 'info', evidence: '复购率 68%' },
    ];

    return (
      <div className="bg-slate-800 p-2 rounded-lg border border-slate-600 mb-2 shadow-lg shrink-0">
        <h3 className="text-[10px] font-bold text-white mb-1 flex items-center gap-2">
          <FileText size={10} className="text-cyan-400"/> 智能经营诊断
        </h3>
        <div className="grid grid-cols-1 gap-1.5">
          {tags.map((tag, i) => (
            <div key={i} className="flex justify-between items-center bg-slate-900/50 p-1.5 rounded border-l-2 border-slate-600">
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${
                tag.type === 'danger' ? 'text-rose-400 bg-rose-900/20' :
                tag.type === 'warning' ? 'text-amber-400 bg-amber-900/20' :
                'text-blue-400 bg-blue-900/20'
              }`}>
                {tag.type === 'danger' ? <XCircle size={8}/> : tag.type === 'warning' ? <AlertTriangle size={8}/> : <CheckCircle size={8}/>}
                {tag.label}
              </span>
              <span className="text-[9px] text-slate-500 truncate max-w-[120px]">{tag.evidence}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- S2 STATION VIEW LAYOUT ---
  if (isStation) {
    return (
      <div className="flex flex-col gap-2 h-full overflow-hidden">
        <div className="mb-1 flex justify-between items-end shrink-0">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
            单站动态经营
          </h2>
          <div className={`text-[10px] px-2 py-0.5 rounded border ${
             timeMode === TimeMode.PREDICTION ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 
             timeMode === TimeMode.HISTORY ? 'bg-slate-500/20 text-slate-300 border-slate-500/30' :
             'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
          }`}>
            {timeMode === TimeMode.PREDICTION ? '趋势预测模式' : timeMode === TimeMode.HISTORY ? '历史数据回放' : '实时数据流'}
          </div>
        </div>

        {renderAssessmentTags()}

        {/* Chart 1: Real-time Revenue (Flow) */}
        <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-700/50 flex-none h-[180px] flex flex-col">
           <h3 className="text-[10px] font-bold text-slate-200 mb-1 flex items-center gap-2 shrink-0">
            <DollarSign size={10} className="text-emerald-400"/> 实时充电流水曲线
          </h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mainSeriesData} margin={{top: 5, right: 0, left: -10, bottom: 0}}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" tick={{fontSize: 8, fill: '#64748b'}} stroke="#475569" interval={5} />
                <YAxis label={{ value: '营收(元)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 8 }} tick={{fontSize: 8, fill: '#64748b'}} stroke="#475569" />
                <ReTooltip 
                  formatter={(value: number) => value.toFixed(2)}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '9px', padding: '2px' }} 
                  itemStyle={{padding: 0}} 
                />
                <Area type="monotone" dataKey="value" name="营收" stroke="#10b981" strokeWidth={1.5} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Station Service Capability (Composite) - Renamed & Smoothed */}
        <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-700/50 flex-1 flex flex-col min-h-0">
           <h3 className="text-[10px] font-bold text-slate-200 mb-1 flex items-center gap-2 shrink-0">
            <Activity size={10} className="text-blue-400"/> 本站服务能力
          </h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={serviceCapData} margin={{top: 5, right: 0, left: -15, bottom: 0}}>
                 <defs>
                   <linearGradient id="availGradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                 <XAxis dataKey="time" tick={{fontSize: 8, fill: '#64748b'}} stroke="#475569" interval={5} />
                 <YAxis yAxisId="left" label={{ value: '利用率%', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 8 }} tick={{fontSize: 8, fill: '#64748b'}} stroke="#475569" />
                 <YAxis yAxisId="right" orientation="right" label={{ value: '数量', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 8 }} tick={{fontSize: 8, fill: '#64748b'}} stroke="#475569"/>
                 <ReTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '9px', padding: '2px' }} />
                 <Legend verticalAlign="top" height={20} iconSize={10} wrapperStyle={{fontSize: '9px'}}/>
                 
                 {/* Available Piles: Area Background (Blue) - Changed type to monotone for smoothness */}
                 <Area yAxisId="right" type="monotone" dataKey="value2" name="可用桩数" fill="url(#availGradient)" stroke="#3b82f6" strokeWidth={1} fillOpacity={1}/>
                 
                 {/* Queue: Bar (Orange/Red) - Thicker bars */}
                 <Bar yAxisId="right" dataKey="value3" name="排队人数" fill="#f97316" barSize={12} radius={[2,2,0,0]} fillOpacity={0.9} />
                 
                 {/* Utilization: Line (Green) - Thicker, smooth line on top */}
                 <Line yAxisId="left" type="monotone" dataKey="value" name="利用率%" stroke="#4ade80" strokeWidth={3} dot={{r: 2, fill: '#4ade80'}} activeDot={{r: 4}} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  // --- S0/S1 CITY/DISTRICT VIEW LAYOUT ---
  return (
    <div className="flex flex-col gap-2 h-full overflow-hidden">
      <div className="mb-1 flex justify-between items-end shrink-0">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
          区域动态分析
        </h2>
        <div className={`text-[10px] px-2 py-0.5 rounded border ${
           timeMode === TimeMode.PREDICTION ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 
           timeMode === TimeMode.HISTORY ? 'bg-slate-500/20 text-slate-300 border-slate-500/30' :
           'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
        }`}>
          {timeMode === TimeMode.PREDICTION ? '趋势预测模式' : timeMode === TimeMode.HISTORY ? '历史数据回放' : '实时数据流'}
        </div>
      </div>

      {/* Chart 1: Created Orders (Bar) - Replaces Revenue */}
      <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-700/50 flex-1 flex flex-col min-h-0">
        <h3 className="text-[10px] font-bold text-slate-200 mb-1 flex items-center gap-2 shrink-0">
          <BarChart3 size={10} className="text-emerald-400"/> 创建订单数
        </h3>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={orderCountData} margin={{top: 2, right: 0, left: -10, bottom: 0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="time" tick={{fontSize: 8, fill: '#64748b'}} stroke="#475569" interval={5} />
              <YAxis label={{ value: '订单(单)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 8 }} tick={{fontSize: 8, fill: '#64748b'}} stroke="#475569" />
              <ReTooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '9px', padding: '2px' }} itemStyle={{padding: 0}} />
              <Bar dataKey="value" name="订单数" fill="#10b981" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: User Activity (Bar) */}
      <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-700/50 flex-1 flex flex-col min-h-0">
        <h3 className="text-[10px] font-bold text-slate-200 mb-1 flex items-center gap-2 shrink-0">
          <Users size={10} className="text-blue-400"/> 区域用户活跃度
        </h3>
        <div className="flex-1 w-full min-h-0">
           <ResponsiveContainer width="100%" height="100%">
            <BarChart data={userActivityData} margin={{top: 2, right: 0, left: -10, bottom: 0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="time" tick={{fontSize: 8, fill: '#64748b'}} stroke="#475569" interval={5} />
              <YAxis label={{ value: '人数', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 8 }} tick={{fontSize: 8, fill: '#64748b'}} stroke="#475569" />
              <ReTooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '9px', padding: '2px' }} />
              <Bar dataKey="value" name="活跃人数" fill="#3b82f6" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Spot Market Price (Line) */}
      <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-700/50 flex-1 flex flex-col min-h-0">
        <h3 className="text-[10px] font-bold text-slate-200 mb-1 flex items-center gap-2 shrink-0">
          <Zap size={10} className="text-amber-400"/> 现货市场电价
        </h3>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={SPOT_PRICE_DATA} margin={{top: 2, right: 0, left: -10, bottom: 0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="time" tick={{fontSize: 8, fill: '#64748b'}} stroke="#475569" interval={5} />
              <YAxis label={{ value: '元/kWh', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 8 }} tick={{fontSize: 8, fill: '#64748b'}} stroke="#475569" domain={[0, 2]} />
              <ReTooltip 
                formatter={(value: number) => value.toFixed(2)}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '9px', padding: '2px' }} 
                itemStyle={{padding: 0}} 
              />
              <Line type="stepAfter" dataKey="value" name="电价" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: Regional Carbon Emission Factor (Area) */}
      <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-700/50 flex-none h-[110px] flex flex-col shrink-0">
        <h3 className="text-[10px] font-bold text-slate-200 mb-1 flex items-center gap-2">
          <Leaf size={10} className="text-emerald-400"/> 区域碳排放因子
        </h3>
         <div className="flex-1 w-full">
           <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CARBON_FACTOR_DATA} margin={{top: 2, right: 0, left: -10, bottom: 0}}>
              <defs>
                <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{fontSize: 8, fill: '#64748b'}} stroke="#475569" interval={5} />
              <YAxis label={{ value: 'kg/kWh', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 8 }} tick={{fontSize: 8, fill: '#64748b'}} stroke="#475569" domain={[0.3, 0.8]} />
              <ReTooltip 
                formatter={(value: number) => value.toFixed(3)}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '9px', padding: '2px' }} 
                itemStyle={{padding: 0}} 
              />
              <Area type="monotone" dataKey="value" name="碳排放因子" stroke="#22c55e" strokeWidth={1.5} fill="url(#colorCarbon)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default RightPanel;