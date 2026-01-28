import React, { useState } from 'react';
import { ViewState, Station } from '../types';
import { 
  PIE_DATA_POWER, PIE_DATA_FUNCTION, PIE_DATA_COST, COLORS, 
  PIE_DATA_UTILIZATION, PIE_DATA_COST_DIST, PIE_DATA_L2_GRID, 
  PIE_DATA_SERVICE_CAP, PIE_DATA_OPS_STATUS, generateTimeSeries, PILE_STATUS_BASE 
} from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, LineChart, Line, BarChart, Bar, LabelList } from 'recharts';
import StatCard from './StatCard';
import { Zap, Users, Wallet, Lock, Server, BatteryCharging, Percent, AlertTriangle, Leaf, ShieldCheck, Car, MapPin, TrendingUp, Tag, CircleDollarSign } from 'lucide-react';

interface LeftPanelProps {
  viewState: ViewState;
  selectedStation: Station | null;
  selectedDistrictId: string | null;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ viewState, selectedStation, selectedDistrictId }) => {
  const [chartType, setChartType] = useState('power');
  const loadData = generateTimeSeries(24, 60, 20); // 24h load data

  const getChartData = () => {
    switch(chartType) {
      case 'power': return PIE_DATA_POWER;
      case 'function': return PIE_DATA_FUNCTION;
      case 'utilization': return PIE_DATA_UTILIZATION;
      case 'cost': return PIE_DATA_COST_DIST;
      case 'l2': return PIE_DATA_L2_GRID;
      case 'service': return PIE_DATA_SERVICE_CAP;
      case 'ops': return PIE_DATA_OPS_STATUS;
      default: return PIE_DATA_POWER;
    }
  };

  // S0 & S1: Aggregate Statistics with New 24h Charts
  if (viewState !== ViewState.S2_STATION) {
    const isDistrict = viewState === ViewState.S1_DISTRICT;
    const regionName = isDistrict ? `区域: ${selectedDistrictId?.toUpperCase()}` : "深圳市全域";
    const m = isDistrict ? 0.2 : 1; 

    // Calculate pile status data based on view level
    const pileStatusData = PILE_STATUS_BASE.map(item => ({
      ...item,
      value: Math.floor(item.value * m)
    }));

    const totalPiles = pileStatusData.reduce((acc, cur) => acc + cur.value, 0);

    // S1 Distinct Styling: Amber/Warm Theme to signify Drill-down level
    const containerStyle = isDistrict 
      ? "grid grid-cols-2 gap-1.5 shrink-0 p-2 rounded-lg border border-amber-500/30 bg-amber-900/10"
      : "grid grid-cols-2 gap-1.5 shrink-0";
    
    const titleStyle = isDistrict
      ? "text-amber-400"
      : "text-white";

    return (
      <div className="flex flex-col gap-3 h-full overflow-hidden pb-1">
        <h2 className={`text-lg font-bold flex items-center gap-2 mb-0.5 shrink-0 ${titleStyle}`}>
           <span className={`w-1.5 h-5 rounded-sm ${isDistrict ? 'bg-amber-500' : 'bg-cyan-500'}`}></span>
           {regionName}
        </h2>

        {/* Section 1: Stat Cards (Styled differently for S1) */}
        <div className={containerStyle}>
          <StatCard title="场站总数" value={Math.floor(450 * m)} unit="座" icon={<Server size={12}/>} variant={isDistrict ? 'warning' : 'default'} />
          <StatCard title="总桩数" value={Math.floor(12450 * m)} unit="个" icon={<Zap size={12}/>} variant={isDistrict ? 'warning' : 'default'} />
          <StatCard title="平均利用率" value="28.4" unit="%" icon={<Percent size={12}/>} trend={1.2} />
          <StatCard title="设备故障率" value="0.8" unit="%" icon={<AlertTriangle size={12}/>} variant="alert" />
          <StatCard title="今日营收" value={Math.floor(45 * m)} unit="万元" icon={<Wallet size={12}/>} variant="success"/>
          <StatCard title="累计服务" value={Math.floor(8500 * m)} unit="次/日" icon={<Car size={12}/>} />
        </div>

        {/* Section 2: Multidimensional Classification (Expanded to flex-1) */}
        <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700 flex-1 flex flex-col min-h-0">
           <div className="flex items-center justify-between mb-1 border-b border-slate-700/50 pb-1 shrink-0">
             <h3 className="text-xs font-bold text-slate-200 tracking-wide">场站多维分类统计</h3>
             <select 
                value={chartType} 
                onChange={(e) => setChartType(e.target.value)}
                className="bg-slate-900 border border-slate-600 text-[9px] text-white rounded px-1 py-0 outline-none focus:border-cyan-500"
              >
                <option value="power">按功率类型</option>
                <option value="function">按功能场所</option>
                <option value="utilization">按利用率</option>
                <option value="cost">按成本分类</option>
                <option value="l2">按L2网格</option>
                <option value="service">按服务能力</option>
                <option value="ops">按运营情况</option>
              </select>
           </div>
           
           <div className="flex-1 flex items-center min-h-0">
              <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  <Pie 
                    data={getChartData()} 
                    cx="50%" cy="50%" 
                    innerRadius="40%" outerRadius="70%" 
                    dataKey="value" 
                    nameKey="name"
                    stroke="none"
                  >
                    {getChartData().map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <ReTooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '9px', padding: '2px'}} itemStyle={{padding: 0}} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-1.5 pl-1 overflow-y-auto max-h-full custom-scrollbar">
                 {getChartData().map((e, i) => (
                   <div key={i} className="flex justify-between items-center text-[10px]">
                     <span className="flex items-center gap-1.5 text-slate-300 truncate max-w-[80px]" title={e.name}>
                       <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{backgroundColor: COLORS[i % COLORS.length]}}></span>
                       {e.name}
                     </span>
                     <span className="font-mono font-bold text-white">{e.value}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Section 3: Charging Pile Status Monitoring (Horizontal Bars) */}
        <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700 flex-1 flex flex-col min-h-0">
           {/* Update 4: Font size consistency (changed from text-[10px] to text-xs) */}
           <h3 className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-2 shrink-0">
              <BatteryCharging size={12} className="text-cyan-400"/> 充电桩状态监控
           </h3>
           <div className="flex-1 w-full min-h-0">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart 
                  layout="vertical" 
                  data={pileStatusData} 
                  margin={{top: 0, right: 40, left: 10, bottom: 0}} 
                  barSize={20}
               >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{fontSize: 10, fill: '#94a3b8'}} 
                    stroke="#475569" 
                    axisLine={false} 
                    tickLine={false}
                    width={60}
                  />
                  <ReTooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '10px'}} 
                  />
                  <Bar dataKey="value" name="数量" radius={[0, 4, 4, 0]}>
                    {pileStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <LabelList 
                      dataKey="value" 
                      position="right" 
                      /* Update 4: Added unit "个" */
                      formatter={(val: number) => `${val}个 (${totalPiles > 0 ? (val/totalPiles*100).toFixed(1) : 0}%)`}
                      style={{ fill: '#e2e8f0', fontSize: '10px', fontWeight: 500 }}
                    />
                  </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

      </div>
    );
  }

  // S2: Dense Station Detail
  if (selectedStation) {
    const totalCost = selectedStation.fixedCost + selectedStation.operationalCost;
    // Calculate daily avg op cost (assuming yearly op cost)
    const dailyOpCost = (selectedStation.operationalCost * 10000 / 365).toFixed(0);

    return (
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header Block - Fixed Height */}
        <div className="mb-2 bg-gradient-to-r from-slate-800 to-slate-900 p-3 rounded-lg border border-slate-700 shrink-0">
          <div className="flex justify-between items-start">
             <div>
               <h2 className="text-base font-bold text-white flex items-center gap-2">
                 {selectedStation.name}
                 <span className={`text-[10px] px-1.5 rounded border ${
                   selectedStation.revenueLevel === 'S' ? 'bg-rose-500/20 text-rose-300 border-rose-500' : 
                   'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                 }`}>
                   {selectedStation.revenueLevel}级站
                 </span>
               </h2>
               <div className="flex gap-2 mt-1 text-[10px] text-slate-400 font-mono">
                 <span className="flex items-center gap-1"><MapPin size={10}/> {selectedStation.districtId.toUpperCase()}</span>
                 <span className="bg-slate-700/50 px-1 rounded text-cyan-300 border border-slate-600/50">{selectedStation.locationLabel}</span>
               </div>
               {/* Features Tags */}
               <div className="flex flex-wrap gap-1 mt-2">
                 {selectedStation.features.map((f, i) => (
                   <span key={i} className="text-[9px] bg-blue-900/30 text-blue-200 border border-blue-500/30 px-1.5 py-0.5 rounded flex items-center gap-1">
                     <Tag size={8}/> {f}
                   </span>
                 ))}
               </div>
             </div>
             <div className="text-right">
                <div className="text-xs text-slate-500 flex items-center justify-end gap-1"><ShieldCheck size={10}/> 安全运行</div>
                <div className="text-xl font-bold text-emerald-400 font-mono">1,245<span className="text-xs ml-1 text-slate-500">天</span></div>
             </div>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-2 min-h-0">
          
          {/* Row 1: Total Cost & Daily Op Cost (Update 2) */}
          <div className="bg-gradient-to-br from-indigo-900/40 to-slate-800 p-3 rounded border border-indigo-500/30 shrink-0 flex items-center justify-between gap-4">
             {/* Total Cost Part */}
             <div className="flex flex-col flex-1">
                 <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-indigo-500/20 rounded-full"><CircleDollarSign className="text-indigo-400" size={14}/></div>
                    <div className="text-[10px] text-indigo-300 font-bold uppercase">全生命周期总成本</div>
                 </div>
                 <div className="text-right">
                    <span className="text-xl font-black text-white tracking-tight">{totalCost}</span>
                    <span className="text-[10px] text-indigo-300 ml-1">万元</span>
                 </div>
                 <div className="text-[9px] text-slate-500 text-right">Fixed + Operational</div>
             </div>
             
             {/* Divider */}
             <div className="w-px h-10 bg-indigo-500/30"></div>

             {/* Daily Op Cost Part (New) */}
             <div className="flex flex-col flex-1">
                 <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-cyan-500/20 rounded-full"><Wallet className="text-cyan-400" size={14}/></div>
                    <div className="text-[10px] text-cyan-300 font-bold uppercase">日均运营成本</div>
                 </div>
                 <div className="text-right">
                    <span className="text-xl font-black text-white tracking-tight">{dailyOpCost}</span>
                    <span className="text-[10px] text-cyan-300 ml-1">元/天</span>
                 </div>
                 <div className="text-[9px] text-slate-500 text-right">Operational / 365</div>
             </div>
          </div>

          {/* Row 2: Staff Table (Detailed) */}
          <div className="bg-slate-800/50 rounded border border-slate-700 shrink-0">
             <div className="text-[10px] font-bold text-slate-300 p-2 border-b border-slate-700 flex items-center gap-1"><Users size={10}/> 人员配置详情</div>
             <table className="w-full text-[10px] text-left">
                <thead className="bg-slate-900/50 text-slate-500">
                  <tr>
                    <th className="p-1.5 font-normal">岗位</th>
                    <th className="p-1.5 font-normal text-center">人数</th>
                    <th className="p-1.5 font-normal text-right">薪资(元/月)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                   {selectedStation.staffDetails.map((s, i) => (
                     <tr key={i}>
                       <td className="p-1.5 text-slate-300">{s.role}</td>
                       <td className="p-1.5 text-center font-mono">{s.count}</td>
                       <td className="p-1.5 text-right font-mono text-slate-400">{s.salary}</td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>

          {/* Row 3: Detailed Cost Structure Pie */}
          <div className="bg-slate-800/50 p-2 rounded border border-slate-700 shrink-0">
             <h3 className="text-[10px] font-bold text-slate-300 mb-1">详细成本结构分布</h3>
             <div className="flex items-center h-28">
                <ResponsiveContainer width="45%" height="100%">
                  <PieChart>
                    <Pie data={PIE_DATA_COST} cx="50%" cy="50%" innerRadius={15} outerRadius={35} dataKey="value" nameKey="name" stroke="none">
                      {PIE_DATA_COST.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <ReTooltip 
                      contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '4px', fontSize: '10px'}} 
                      itemStyle={{padding: 0}}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Scrollable Legend */}
                <div className="flex-1 pl-1 overflow-y-auto max-h-[100px] custom-scrollbar grid grid-cols-1 gap-1">
                   {PIE_DATA_COST.map((e, i) => (
                     <div key={i} className="flex justify-between items-center text-[9px]">
                       <span className="flex items-center gap-1 text-slate-400 truncate max-w-[80px]" title={e.name}>
                         <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{backgroundColor: COLORS[i % COLORS.length]}}></span>
                         {e.name}
                       </span>
                       <span className="font-mono text-white">{e.value}%</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Row 4: Facilities Info */}
          <div className="bg-slate-800/50 p-2 rounded border border-slate-700 shrink-0">
             <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300 mb-2">
                <div className="flex justify-between p-1 bg-slate-900 rounded"><span>停车费</span> <span className="text-white font-mono">¥{selectedStation.parkingFee.toFixed(1)}/h</span></div>
                <div className="flex justify-between p-1 bg-slate-900 rounded"><span>服务费</span> <span className="text-white font-mono">¥{selectedStation.serviceFee.toFixed(2)}/kWh</span></div>
             </div>
             <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-700 pt-2">
                <div className="flex items-center gap-1"><Lock size={10}/> 智能地锁</div>
                <div className="flex items-center gap-2">
                   <span className={selectedStation.hasGroundLock ? 'text-emerald-400' : 'text-slate-500'}>{selectedStation.hasGroundLock ? '已安装' : '无'}</span>
                   {selectedStation.hasGroundLock && <span className="text-xs text-white font-mono bg-slate-700 px-1 rounded">{selectedStation.groundLockCoverage}% 覆盖</span>}
                </div>
             </div>
          </div>

          {/* Row 5: Detailed Pile List Table */}
          <div className="bg-slate-800/50 rounded border border-slate-700 shrink-0">
             <h3 className="text-[10px] font-bold text-slate-300 p-2 bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
               终端设备详情列表 ({selectedStation.piles.length})
             </h3>
             <div className="overflow-x-auto max-h-[150px] custom-scrollbar">
               <table className="w-full text-[10px] text-left">
                 <thead className="text-slate-500 bg-slate-900/50 sticky top-0 z-10">
                   <tr>
                     <th className="p-2 font-normal whitespace-nowrap">编号</th>
                     <th className="p-2 font-normal whitespace-nowrap">类型</th>
                     <th className="p-2 font-normal whitespace-nowrap">状态</th>
                     <th className="p-2 font-normal whitespace-nowrap">当前用户</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-700/50">
                   {selectedStation.piles.map(pile => (
                     <tr key={pile.id} className="hover:bg-slate-700/30">
                       <td className="p-2 font-mono text-slate-300">{pile.id}</td>
                       <td className="p-2 text-slate-400">{pile.type}</td>
                       <td className="p-2">
                         <span className={`px-1.5 py-0.5 rounded-sm whitespace-nowrap ${
                           pile.status === 'Charging' ? 'bg-emerald-500/20 text-emerald-400' :
                           pile.status === 'Fault' ? 'bg-rose-500/20 text-rose-400' :
                           'bg-slate-700 text-slate-400'
                         }`}>
                           {pile.status === 'Charging' ? '充电中' : pile.status === 'Fault' ? '故障' : '空闲'}
                         </span>
                       </td>
                       <td className="p-2 font-mono text-slate-500">{pile.currentUser || '-'}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>

        </div>
      </div>
    );
  }

  return null;
};

export default LeftPanel;