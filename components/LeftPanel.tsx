import React, { useState } from 'react';
import { ViewState, Station } from '../types';
import { 
  PIE_DATA_POWER, PIE_DATA_FUNCTION, PIE_DATA_COST, COLORS, 
  PIE_DATA_UTILIZATION, PIE_DATA_COST_DIST, PIE_DATA_L2_GRID, 
  PIE_DATA_SERVICE_CAP, PIE_DATA_OPS_STATUS 
} from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import StatCard from './StatCard';
import { Zap, Activity, Filter, Users, Wallet, Lock, Server, BatteryCharging, Percent, AlertTriangle, Leaf, ShieldCheck, Car } from 'lucide-react';

interface LeftPanelProps {
  viewState: ViewState;
  selectedStation: Station | null;
  selectedDistrictId: string | null;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ viewState, selectedStation, selectedDistrictId }) => {
  // Classification Categories
  const [chartType, setChartType] = useState('power'); 

  // Mapping selection to data
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

  // S0 & S1: Aggregate Statistics
  if (viewState !== ViewState.S2_STATION) {
    const isDistrict = viewState === ViewState.S1_DISTRICT;
    const regionName = isDistrict ? `区域: ${selectedDistrictId?.toUpperCase()}` : "深圳市全域";
    const m = isDistrict ? 0.2 : 1; 

    return (
      <div className="flex flex-col gap-3 h-full overflow-hidden">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1 shrink-0">
           <span className="w-1.5 h-5 bg-cyan-500 rounded-sm"></span>
           {regionName}
        </h2>

        {/* Section 1: Key Assets Dashboard */}
        <div className="grid grid-cols-2 gap-2 shrink-0">
          <StatCard title="场站总数" value={Math.floor(450 * m)} unit="座" icon={<Server size={14}/>} />
          <StatCard title="总桩数" value={Math.floor(12450 * m)} unit="个" icon={<Zap size={14}/>} />
          <StatCard title="平均利用率" value="28.4" unit="%" icon={<Percent size={14}/>} trend={1.2} />
          <StatCard title="设备故障率" value="0.8" unit="%" icon={<AlertTriangle size={14}/>} variant="alert" />
          <StatCard title="今日营收" value={Math.floor(45 * m)} unit="万元" icon={<Wallet size={14}/>} variant="success"/>
          <StatCard title="碳减排量" value={Math.floor(120 * m)} unit="吨" icon={<Leaf size={14}/>} variant="success" />
          <StatCard title="额定功率" value={Math.floor(850 * m)} unit="MW" />
          {/* Changed "Service Index" to "Served Vehicles" */}
          <StatCard title="累计服务车次" value={Math.floor(8500 * m)} unit="次/日" icon={<Car size={14}/>} />
        </div>

        {/* Section 2: Comprehensive Classification (7 Types) */}
        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 flex flex-col min-h-0 flex-1">
           <div className="flex items-center justify-between mb-2 border-b border-slate-700/50 pb-2">
             <h3 className="text-xs font-bold text-slate-300">多维分类统计</h3>
             <select 
                value={chartType} 
                onChange={(e) => setChartType(e.target.value)}
                className="bg-slate-900 border border-slate-600 text-[10px] text-white rounded px-2 py-0.5 outline-none focus:border-cyan-500"
              >
                <option value="power">按功率类型 (Power)</option>
                <option value="function">按功能场所 (Function)</option>
                <option value="utilization">按利用率 (Utilization)</option>
                <option value="cost">按成本分类 (Cost)</option>
                <option value="l2">按L2网格 (L2 Grid)</option>
                <option value="service">按服务能力 (Service)</option>
                <option value="ops">按运营情况 (Status)</option>
              </select>
           </div>
           
           <div className="flex-1 flex items-center">
              <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  <Pie 
                    data={getChartData()} 
                    cx="50%" cy="50%" 
                    innerRadius={30} outerRadius={50} 
                    dataKey="value" stroke="none"
                  >
                    {getChartData().map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <ReTooltip 
                    contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '4px', fontSize: '10px'}} 
                    itemStyle={{padding: 0}}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-1.5 pl-2 overflow-y-auto max-h-[140px] custom-scrollbar">
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

        {/* Section 3: Real-time Port Status */}
        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 shrink-0 h-[120px] flex flex-col">
           <h3 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
              <BatteryCharging size={12} className="text-emerald-400"/> 实时终端状态监控
           </h3>
           <div className="flex-1 flex flex-col justify-center gap-3">
             {[
               { label: '空闲 (Idle)', val: 45, color: 'bg-emerald-500' },
               { label: '充电中 (Busy)', val: 42, color: 'bg-cyan-500' },
               { label: '离线/故障 (Fault)', val: 13, color: 'bg-slate-500' }
             ].map((s, idx) => (
               <div key={idx} className="flex items-center gap-2">
                  <span className="text-[9px] text-slate-400 w-20 text-right">{s.label}</span>
                  <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${s.color}`} style={{width: `${s.val}%`}}></div>
                  </div>
                  <span className="text-[9px] font-mono text-white w-8">{s.val}%</span>
               </div>
             ))}
           </div>
        </div>
      </div>
    );
  }

  // S2: Dense Station Detail
  if (selectedStation) {
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
               <div className="flex gap-3 mt-1 text-[10px] text-slate-400 font-mono">
                 <span>ID: {selectedStation.id}</span>
                 <span>区域: {selectedStation.districtId.toUpperCase()}</span>
               </div>
             </div>
             <div className="text-right">
                {/* Changed "Composite Score" to "Safe Operation Days" */}
                <div className="text-xs text-slate-500 flex items-center justify-end gap-1"><ShieldCheck size={10}/> 安全运行</div>
                <div className="text-xl font-bold text-emerald-400 font-mono">1,245<span className="text-xs ml-1 text-slate-500">天</span></div>
             </div>
          </div>
        </div>

        {/* Scrollable Content Container - Flex 1 to take remaining space */}
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-2 min-h-0">
          
          {/* Row 1: Costs & Financials */}
          <div className="grid grid-cols-2 gap-2 shrink-0">
             <div className="bg-slate-800/50 p-2 rounded border border-slate-700">
               <div className="text-[10px] text-slate-400 mb-1 flex items-center gap-1"><Wallet size={10}/> 年度运营成本</div>
               <div className="text-lg font-mono text-white">{selectedStation.operationalCost}<span className="text-xs text-slate-500 ml-1">万元</span></div>
               <div className="w-full bg-slate-700 h-1 mt-1 rounded-full"><div className="bg-amber-500 h-full w-[70%] rounded-full"></div></div>
             </div>
             <div className="bg-slate-800/50 p-2 rounded border border-slate-700">
               <div className="text-[10px] text-slate-400 mb-1 flex items-center gap-1"><Users size={10}/> 人员配置</div>
               <div className="flex justify-between items-end">
                 <span className="text-lg font-mono text-white">{selectedStation.staffCount}<span className="text-xs text-slate-500 ml-1">人</span></span>
                 <span className="text-[10px] text-slate-500">¥{selectedStation.avgStaffSalary}/月</span>
               </div>
             </div>
          </div>

          {/* Row 2: Detailed Cost Structure Pie (8 Categories) */}
          <div className="bg-slate-800/50 p-3 rounded border border-slate-700 shrink-0">
             <h3 className="text-[10px] font-bold text-slate-300 mb-2">详细成本结构分布</h3>
             <div className="flex items-center h-32">
                <ResponsiveContainer width="45%" height="100%">
                  <PieChart>
                    <Pie data={PIE_DATA_COST} cx="50%" cy="50%" innerRadius={15} outerRadius={40} dataKey="value" stroke="none">
                      {PIE_DATA_COST.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <ReTooltip 
                      contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '4px', fontSize: '10px'}} 
                      itemStyle={{padding: 0}}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Scrollable Legend for 8 items */}
                <div className="flex-1 pl-2 overflow-y-auto max-h-[120px] custom-scrollbar grid grid-cols-1 gap-1">
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

          {/* Row 3: Facilities Info */}
          <div className="bg-slate-800/50 p-2 rounded border border-slate-700 shrink-0">
             <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300 mb-2">
                <div className="flex justify-between p-1 bg-slate-900 rounded"><span>停车费</span> <span className="text-white font-mono">¥{selectedStation.parkingFee}/h</span></div>
                <div className="flex justify-between p-1 bg-slate-900 rounded"><span>服务费</span> <span className="text-white font-mono">¥{selectedStation.serviceFee}/kWh</span></div>
             </div>
             <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-700 pt-2">
                <div className="flex items-center gap-1"><Lock size={10}/> 智能地锁</div>
                <div className="flex items-center gap-2">
                   <span className={selectedStation.hasGroundLock ? 'text-emerald-400' : 'text-slate-500'}>{selectedStation.hasGroundLock ? '已安装' : '无'}</span>
                   {selectedStation.hasGroundLock && <span className="text-xs text-white font-mono bg-slate-700 px-1 rounded">{selectedStation.groundLockCoverage}% 覆盖</span>}
                </div>
             </div>
          </div>

          {/* Row 4: Detailed Pile List Table */}
          <div className="bg-slate-800/50 rounded border border-slate-700 shrink-0">
             <h3 className="text-[10px] font-bold text-slate-300 p-2 bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
               终端设备详情列表 ({selectedStation.piles.length})
             </h3>
             <div className="overflow-x-auto max-h-[200px] custom-scrollbar">
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