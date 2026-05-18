import React, { useMemo } from 'react';
import { ViewState, TimeMode, AssessmentTag } from '../types';
import { generateTimeSeries, SPOT_PRICE_DATA, CARBON_FACTOR_DATA, generateOrderSeries, generateServiceCapSeries, generatePowerCapacitySeries } from '../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, LineChart, Line, Legend, BarChart, Bar, ComposedChart } from 'recharts';
import { AlertCircle, TrendingUp, DollarSign, FileText, CheckCircle, AlertTriangle, XCircle, Users, Leaf, Zap, BarChart3, Activity, Trophy } from 'lucide-react';

interface RightPanelProps {
  viewState: ViewState;
  timeMode: TimeMode;
  selectedDistrictId: string | null;
  timelineValue: number;
}

const RightPanel: React.FC<RightPanelProps> = ({ viewState, timeMode, selectedDistrictId, timelineValue }) => {
  const dataPoints = 24; 
  const isStation = viewState === ViewState.S2_STATION;

  // New: Dynamic Ranking Data Logic
  const rankingData = useMemo(() => {
    // Realistic station names based on context
    const cityStations = [
      "深港科技创新合作区站", "深圳湾超级总部充电中心", "前海枢纽超充站", 
      "市民中心地下快充站", "宝安机场枢纽充能站", "龙岗智慧交通港站", 
      "盐田港口物流重卡站", "蛇口邮轮中心充电站", "大运中心能源站", 
      "光明科学城极速站"
    ];

    const districtStations = [
      "中航中心超充旗舰站", "福田高铁站交通枢纽", "平安金融中心VIP站", 
      "华强北步行街地下站", "会展中心极速充电岛", "购物公园绿色能源站", 
      "皇岗口岸24小时站", "莲花山公园东门站", "笔架山公交场站", 
      "香蜜湖水上中心站"
    ];

    const names = selectedDistrictId ? districtStations : cityStations;
    
    // Time-based phase (to create wavy patterns in ranking)
    const hour = Math.floor(timelineValue / 4);
    const dayProgress = timelineValue / 96;

    const ranked = names.map((name, index) => {
      // Use a unique seed based on name to make behavior distinct but deterministic
      const seed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      // Base capacity between 600 and 1200 kW
      const baseCapacity = 600 + (seed % 600);
      
      // Different peak behaviors: some stations peak twice a day, some once
      const frequency = (seed % 2 === 0) ? 2 : 1;
      const phaseShift = (seed % 100) / 100;
      
      // Core dynamic factor (0.1 to 1.0)
      const dynamicFactor = 0.1 + Math.abs(Math.sin((dayProgress * Math.PI * 2 * frequency) + (phaseShift * Math.PI * 2))) * 0.9;
      
      // Chaotic volatility to ensure rankings cross each other
      const chaos = Math.sin(timelineValue * 0.5 + seed) * (100 + (seed % 100));
      
      // Mode-based adjustment
      const modeAdjust = timeMode === TimeMode.PREDICTION ? 1.2 : (timeMode === TimeMode.HISTORY ? 0.8 : 1.0);
      
      const power = Math.max(50, Math.floor(baseCapacity * dynamicFactor * modeAdjust + chaos));
      return { id: index, name, power };
    });

    // Sort by power descending - this will now flip much more often
    ranked.sort((a, b) => b.power - a.power);

    const totalPower = ranked.reduce((acc, curr) => acc + curr.power, 0);
    return ranked.map(r => ({
      ...r,
      percent: parseFloat(((r.power / totalPower) * 100).toFixed(1))
    }));
  }, [selectedDistrictId, timeMode, timelineValue]);
  
  // Data Generation based on TimeMode
  const baseValue = timeMode === TimeMode.PREDICTION ? 120 : 80;
  const variance = timeMode === TimeMode.CURRENT ? 20 : 5;
  
  const mainSeriesData = generateTimeSeries(dataPoints, baseValue, variance);
  const orderCountData = generateOrderSeries(dataPoints, 45, 10);
  const serviceCapData = generateServiceCapSeries(dataPoints);

  // New Data for Power vs Capacity (Request 1 & 3)
  const regionalPowerData = generatePowerCapacitySeries(dataPoints, 12000); // 12000kW Regional Cap
  const stationPowerData = generatePowerCapacitySeries(dataPoints, 800);   // 800kW Station Cap

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
        <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-700/50 flex-none h-[150px] flex flex-col">
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

        {/* Chart 2: Station Service Capability (Maximized Width) */}
        <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-700/50 flex-1 flex flex-col min-h-0">
           <h3 className="text-[10px] font-bold text-slate-200 mb-1 flex items-center gap-2 shrink-0">
            <Activity size={10} className="text-blue-400"/> 本站服务能力
          </h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={serviceCapData} margin={{top: 10, right: -10, left: -28, bottom: 0}}>
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
                 <Legend verticalAlign="top" height={20} iconSize={8} wrapperStyle={{fontSize: '9px', top: -5}}/>
                 <Area yAxisId="right" type="monotone" dataKey="value2" name="可用桩数" fill="url(#availGradient)" stroke="#3b82f6" strokeWidth={1} fillOpacity={1}/>
                 <Bar yAxisId="right" dataKey="value3" name="排队人数" fill="#f97316" barSize={12} radius={[2,2,0,0]} fillOpacity={0.9} />
                 <Line yAxisId="left" type="monotone" dataKey="value" name="利用率%" stroke="#4ade80" strokeWidth={2} dot={{r: 1, fill: '#4ade80'}} activeDot={{r: 3}} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Station Power & Capacity Limit (Legend moved to Header) */}
        <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-700/50 flex-1 flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-1 shrink-0">
            <h3 className="text-[10px] font-bold text-slate-200 flex items-center gap-2">
              <Zap size={10} className="text-amber-400"/> 场站功率和容量上限
            </h3>
            {/* Custom Legend */}
            <div className="flex items-center gap-3 text-[9px] text-slate-400">
               <div className="flex items-center gap-1">
                 <div className="w-3 h-[2px] bg-red-500 border-t border-red-500 border-dashed"></div>
                 <span>容量上限</span>
               </div>
               <div className="flex items-center gap-1">
                 <div className="w-2.5 h-2.5 bg-sky-500/50 border border-sky-500 rounded-[1px]"></div>
                 <span>实时负荷</span>
               </div>
            </div>
          </div>
          
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={stationPowerData} margin={{top: 5, right: 0, left: -10, bottom: 0}}>
                <defs>
                  <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" tick={{fontSize: 8, fill: '#64748b'}} stroke="#475569" interval={5} />
                <YAxis label={{ value: '功率(kW)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 8 }} tick={{fontSize: 8, fill: '#64748b'}} stroke="#475569" />
                <ReTooltip 
                  formatter={(value: number) => value.toFixed(0) + ' kW'}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '9px', padding: '2px' }} 
                  itemStyle={{padding: 0}} 
                />
                
                {/* Limit: Bright Red Dashed Line */}
                <Line type="step" dataKey="value" name="容量上限" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" dot={false} legendType="none" />
                {/* Load: Area with gradient */}
                <Area type="monotone" dataKey="value2" name="实时功率" stroke="#0ea5e9" strokeWidth={2} fill="url(#powerGradient)" legendType="none" />
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

      {/* Chart 1: Created Orders (Bar) */}
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

      {/* Chart 2: Regional Power & Capacity Limit (Legend moved to Header) */}
      <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-700/50 flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-1 shrink-0">
           <h3 className="text-[10px] font-bold text-slate-200 flex items-center gap-2">
            <Zap size={10} className="text-blue-400"/> 区域功率和容量上限
           </h3>
           {/* Custom Legend */}
           <div className="flex items-center gap-3 text-[9px] text-slate-400">
             <div className="flex items-center gap-1">
               <div className="w-3 h-[2px] bg-red-500 border-t border-red-500 border-dashed"></div>
               <span>容量上限</span>
             </div>
             <div className="flex items-center gap-1">
               <div className="w-2.5 h-2.5 bg-blue-500/50 border border-blue-500 rounded-[1px]"></div>
               <span>实时负荷</span>
             </div>
           </div>
        </div>

        <div className="flex-1 w-full min-h-0">
           <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={regionalPowerData} margin={{top: 5, right: 0, left: -10, bottom: 0}}>
              <defs>
                  <linearGradient id="regPowerGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="time" tick={{fontSize: 8, fill: '#64748b'}} stroke="#475569" interval={5} />
              <YAxis label={{ value: '功率(kW)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 8 }} tick={{fontSize: 8, fill: '#64748b'}} stroke="#475569" />
              <ReTooltip 
                formatter={(value: number) => value.toFixed(0) + ' kW'}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '9px', padding: '2px' }} 
                itemStyle={{padding: 0}} 
              />
              
              {/* Limit: Bright Red Dashed Line */}
              <Line type="step" dataKey="value" name="容量上限" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" dot={false} legendType="none" />
              {/* Load: Blue Area */}
              <Area type="monotone" dataKey="value2" name="实时负荷" stroke="#3b82f6" strokeWidth={2} fill="url(#regPowerGradient)" legendType="none" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* NEW: Station Power Ranking Table */}
      <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-700/50 flex-[1.5] flex flex-col min-h-0">
        <h3 className="text-[10px] font-bold text-slate-200 mb-2 flex items-center gap-2 shrink-0">
          <Trophy size={10} className="text-yellow-400"/> {selectedDistrictId ? '区域' : '全市'}场站功率表现排名
        </h3>
        <div className="flex-1 overflow-y-auto pr-1">
          <table className="w-full text-[9px] border-collapse">
            <thead className="sticky top-0 bg-slate-800 z-10">
              <tr className="text-slate-500 border-b border-slate-700">
                <th className="text-left font-medium pb-1 w-8">排名</th>
                <th className="text-left font-medium pb-1 truncate">{selectedDistrictId ? '辖区场站' : '全市重点场站'}</th>
                <th className="text-right font-medium pb-1">功率(kW)</th>
                <th className="text-right font-medium pb-1 w-12">占比</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {rankingData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-700/30 transition-colors">
                  <td className="py-1.5 pt-2">
                    <span className={`flex items-center justify-center w-4 h-4 rounded text-[8px] font-bold ${
                      idx === 0 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                      idx === 1 ? 'bg-slate-300/20 text-slate-300 border border-slate-300/30' :
                      idx === 2 ? 'bg-amber-600/20 text-amber-600 border border-amber-600/30' :
                      'text-slate-500'
                    }`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="py-1.5 pt-2 text-slate-300 font-medium">{row.name}</td>
                  <td className="py-1.5 pt-2 text-right text-cyan-400 font-mono tracking-tighter">{row.power.toLocaleString()}</td>
                  <td className="py-1.5 pt-2 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-slate-400 font-mono">{row.percent}%</span>
                      <div className="w-10 h-0.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500" style={{ width: `${row.percent * 3}%` }}></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default RightPanel;