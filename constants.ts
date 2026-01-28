import { District, Station, TimeMode, PileDetail, StaffRole } from './types';

// 1. Map Tile: OpenStreetMap Mapnik
export const MAP_TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

// 2. Irregular Grid Mesh Covering Viewport
export const DISTRICTS: District[] = [
  // --- INACTIVE BACKGROUND (Top - Dongguan side) ---
  { 
    id: 'bg_nw', name: '东莞西部', center: [22.85, 113.80], 
    capacityHistory: 0, capacityCurrent: 0, capacityPrediction: 0, revenueRank: 'C', isActive: false,
    coordinates: [[22.95, 113.60], [22.95, 113.95], [22.82, 113.92], [22.80, 113.70]]
  },
  { 
    id: 'bg_n', name: '东莞中部', center: [22.85, 114.10], 
    capacityHistory: 0, capacityCurrent: 0, capacityPrediction: 0, revenueRank: 'C', isActive: false,
    coordinates: [[22.95, 113.95], [22.95, 114.30], [22.80, 114.25], [22.82, 113.92]]
  },
  { 
    id: 'bg_ne', name: '惠州区域', center: [22.85, 114.45], 
    capacityHistory: 0, capacityCurrent: 0, capacityPrediction: 0, revenueRank: 'C', isActive: false,
    coordinates: [[22.95, 114.30], [22.95, 114.80], [22.75, 114.70], [22.80, 114.25]]
  },

  // --- ACTIVE SHENZHEN GRIDS (Irregular shapes) ---
  // West Group
  { 
    id: 'sz_baoan_n', name: '宝安北部', center: [22.72, 113.82], 
    capacityHistory: 45, capacityCurrent: 68, capacityPrediction: 75, revenueRank: 'A', isActive: true,
    coordinates: [[22.80, 113.70], [22.82, 113.92], [22.68, 113.90], [22.65, 113.75]]
  },
  { 
    id: 'sz_guangming', name: '光明区', center: [22.76, 113.96], 
    capacityHistory: 50, capacityCurrent: 72, capacityPrediction: 85, revenueRank: 'B', isActive: true,
    coordinates: [[22.82, 113.92], [22.80, 114.05], [22.72, 114.02], [22.68, 113.90]]
  },
  // Center Group
  { 
    id: 'sz_longhua', name: '龙华区', center: [22.70, 114.04], 
    capacityHistory: 60, capacityCurrent: 88, capacityPrediction: 95, revenueRank: 'S', isActive: true,
    coordinates: [[22.80, 114.05], [22.78, 114.15], [22.65, 114.12], [22.62, 114.02], [22.72, 114.02]]
  },
  { 
    id: 'sz_longgang_w', name: '龙岗西部', center: [22.72, 114.18], 
    capacityHistory: 55, capacityCurrent: 70, capacityPrediction: 65, revenueRank: 'B', isActive: true,
    coordinates: [[22.78, 114.15], [22.80, 114.25], [22.65, 114.28], [22.65, 114.12]]
  },
  // East Group
  { 
    id: 'sz_longgang_e', name: '龙岗东部', center: [22.73, 114.35], 
    capacityHistory: 40, capacityCurrent: 55, capacityPrediction: 50, revenueRank: 'B', isActive: true,
    coordinates: [[22.80, 114.25], [22.75, 114.45], [22.62, 114.42], [22.65, 114.28]]
  },
  { 
    id: 'sz_pingshan', name: '坪山区', center: [22.68, 114.40], 
    capacityHistory: 30, capacityCurrent: 45, capacityPrediction: 42, revenueRank: 'C', isActive: true,
    coordinates: [[22.75, 114.45], [22.75, 114.70], [22.60, 114.60], [22.62, 114.42]]
  },
  // South Group (Core)
  { 
    id: 'sz_qianhai', name: '前海中心', center: [22.54, 113.88], 
    capacityHistory: 70, capacityCurrent: 92, capacityPrediction: 88, revenueRank: 'S', isActive: true,
    coordinates: [[22.65, 113.75], [22.68, 113.90], [22.62, 114.02], [22.48, 113.95], [22.48, 113.80]]
  },
  { 
    id: 'sz_futian', name: '福田/罗湖', center: [22.55, 114.08], 
    capacityHistory: 75, capacityCurrent: 85, capacityPrediction: 98, revenueRank: 'S', isActive: true,
    coordinates: [[22.62, 114.02], [22.65, 114.12], [22.52, 114.15], [22.50, 114.05], [22.48, 113.95]]
  },
  { 
    id: 'sz_yantian', name: '盐田/大鹏', center: [22.58, 114.30], 
    capacityHistory: 35, capacityCurrent: 50, capacityPrediction: 45, revenueRank: 'C', isActive: true,
    coordinates: [[22.65, 114.12], [22.62, 114.42], [22.60, 114.60], [22.45, 114.55], [22.52, 114.15]]
  },
  // --- INACTIVE BACKGROUND (Bottom - Sea) ---
  { 
    id: 'bg_sw', name: '珠江口', center: [22.40, 113.80], 
    capacityHistory: 0, capacityCurrent: 0, capacityPrediction: 0, revenueRank: 'C', isActive: false,
    coordinates: [[22.48, 113.60], [22.48, 113.95], [22.30, 113.95], [22.30, 113.60]]
  },
  { 
    id: 'bg_se', name: '大亚湾海域', center: [22.40, 114.40], 
    capacityHistory: 0, capacityCurrent: 0, capacityPrediction: 0, revenueRank: 'C', isActive: false,
    coordinates: [[22.45, 114.55], [22.60, 114.70], [22.30, 114.80], [22.30, 114.40]]
  }
];

// New: Functional Zone Tags
export const LOCATION_TAGS = ['核心商业区', '高新科技园', '5A级景区', '高端住宅区', '交通枢纽', '物流园区', '会展中心'];
const FEATURE_POOL = ['支持线上操作', '附近有便利店', '24h卫生间', '免费Wifi', '餐饮休息室', '自动洗车机', '雨棚覆盖', '视频监控'];

const STAFF_ROLES_POOL = [
  { name: '站长', baseSalary: 12000 },
  { name: '值班长', baseSalary: 9500 },
  { name: '高压电工', baseSalary: 8500 },
  { name: '弱电技师', baseSalary: 8000 },
  { name: '安保主管', baseSalary: 6500 },
  { name: '安保员', baseSalary: 5500 },
  { name: '保洁主管', baseSalary: 5000 },
  { name: '保洁员', baseSalary: 4200 },
  { name: '客服专员', baseSalary: 6000 },
  { name: 'IT运维', baseSalary: 11000 }
];

const generateStaff = (): StaffRole[] => {
  // Randomly select 2 to 5 distinct roles for this station
  const numRoles = 2 + Math.floor(Math.random() * 4);
  const shuffledRoles = [...STAFF_ROLES_POOL].sort(() => 0.5 - Math.random());
  const selectedRoles = shuffledRoles.slice(0, numRoles);

  return selectedRoles.map(roleDef => ({
    role: roleDef.name,
    count: 1 + Math.floor(Math.random() * 3), // 1-3 people
    // Salary jitter: +/- 500
    salary: roleDef.baseSalary + (Math.floor(Math.random() * 11) - 5) * 100
  }));
};

const generatePiles = (count: number): PileDetail[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `P-${1000 + i}`,
    type: i % 3 === 0 ? 'DC-120kW' : 'DC-60kW',
    power: i % 3 === 0 ? 120 : 60,
    status: Math.random() > 0.8 ? 'Charging' : Math.random() > 0.9 ? 'Fault' : 'Idle',
    currentUser: Math.random() > 0.8 ? `粤B${Math.floor(10000 + Math.random() * 90000)}` : undefined
  }));
};

export const generateStations = (districtId: string): Station[] => {
  const stations: Station[] = [];
  const district = DISTRICTS.find(d => d.id === districtId);
  if (!district || !district.isActive) return []; 

  const center = district.center;
  const count = 12 + Math.floor(Math.random() * 6); 
  
  for (let i = 0; i < count; i++) {
    const lat = center[0] + (Math.random() - 0.5) * 0.08;
    const lng = center[1] + (Math.random() - 0.5) * 0.08;
    const revenueRand = Math.random();
    
    // Pick 3 random features
    const shuffledFeatures = [...FEATURE_POOL].sort(() => 0.5 - Math.random());

    stations.push({
      id: `${districtId}-s-${i}`,
      districtId,
      name: `${district.name}站 #${i + 1}`,
      locationLabel: LOCATION_TAGS[Math.floor(Math.random() * LOCATION_TAGS.length)], 
      position: [lat, lng],
      type: Math.random() > 0.7 ? 'Dedicated' : Math.random() > 0.4 ? 'Public' : 'Private',
      features: shuffledFeatures.slice(0, 3),
      revenueLevel: revenueRand > 0.8 ? 'S' : revenueRand > 0.5 ? 'A' : revenueRand > 0.2 ? 'B' : 'C',
      fixedCost: Math.floor(150 + Math.random() * 300),
      operationalCost: Math.floor(30 + Math.random() * 50),
      parkingFee: 10,
      serviceFee: 0.6,
      hasGroundLock: Math.random() > 0.3,
      groundLockCoverage: Math.floor(40 + Math.random() * 60),
      staffDetails: generateStaff(),
      piles: generatePiles(10 + Math.floor(Math.random() * 20)),
      staffCount: 0, // Computed from details later if needed, but redundant now
      avgStaffSalary: 0 // Redundant
    });
  }
  return stations;
};

// Generate 24h Order Counts (Integers)
export const generateOrderSeries = (points: number, base: number, variance: number) => {
  return Array.from({ length: points }, (_, i) => {
    // Peak hours: 10-14, 18-21
    let timeFactor = 1;
    if ((i >= 10 && i <= 14) || (i >= 18 && i <= 21)) timeFactor = 1.5;

    const val = Math.max(0, Math.floor((base * timeFactor) + (Math.random() - 0.5) * variance));
    return {
      time: `${String(i).padStart(2, '0')}:00`,
      value: val 
    };
  });
};

// Generate S2 Service Capability Data (Utilization, Available, Queue)
export const generateServiceCapSeries = (points: number) => {
  return Array.from({ length: points }, (_, i) => {
    // Mock profile
    const peak = (i > 9 && i < 22) ? 0.8 : 0.2;
    const random = Math.random() * 0.1;
    const utilization = Math.min(100, Math.max(0, (peak + random) * 100));
    
    return {
      time: `${String(i).padStart(2, '0')}:00`,
      value: Math.floor(utilization), // Utilization %
      value2: Math.floor(20 * (1 - (utilization/100))), // Available Piles (Inverse to util)
      value3: utilization > 80 ? Math.floor(Math.random() * 10) : 0 // Queue Count (Only when busy)
    };
  });
};

export const generateTimeSeries = (points: number, base: number, variance: number) => {
  return Array.from({ length: points }, (_, i) => {
    const trend = Math.sin(i * 0.25) * variance;
    return {
      time: `${String(i).padStart(2, '0')}:00`,
      value: Math.max(0, base + trend + (Math.random() - 0.5) * (variance/2)), 
    };
  });
};

// Generate Power Load vs Capacity (Area + Line)
export const generatePowerCapacitySeries = (points: number, capacity: number) => {
  return Array.from({ length: points }, (_, i) => {
    // Mock load profile
    const baseLoad = capacity * 0.4;
    // Two peaks
    const peak = (i > 9 && i < 14) || (i > 18 && i < 22) ? capacity * 0.4 : 0;
    const random = (Math.random() - 0.5) * (capacity * 0.1);
    
    return {
      time: `${String(i).padStart(2, '0')}:00`,
      value: capacity, // The Limit (Constant or slightly variable, typically constant for capacity)
      value2: Math.max(0, baseLoad + peak + random) // The Actual Load
    };
  });
};

// Spot Price Data
export const SPOT_PRICE_DATA = Array.from({ length: 24 }, (_, i) => {
  let price = 0.4; 
  if (i >= 10 && i <= 14) price = 1.2; 
  else if (i >= 18 && i <= 21) price = 1.5; 
  else if (i >= 0 && i <= 6) price = 0.25; 
  else price = 0.7; 
  
  return {
    time: `${String(i).padStart(2, '0')}:00`,
    value: price + (Math.random() - 0.5) * 0.1
  };
});

// Carbon Factor Data
export const CARBON_FACTOR_DATA = Array.from({ length: 24 }, (_, i) => {
  // Mock data: fluctuations
  return {
    time: `${String(i).padStart(2, '0')}:00`,
    value: 0.5 + Math.sin(i * 0.5) * 0.1 + (Math.random() - 0.5) * 0.05
  };
});

export const TIME_MODES = [
  { id: TimeMode.HISTORY, label: '历史回溯' },
  { id: TimeMode.CURRENT, label: '实时监控' },
  { id: TimeMode.PREDICTION, label: '未来预测' },
];

export const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#f43f5e', '#8b5cf6', '#d946ef', '#64748b', '#ec4899', '#14b8a6'];

export const PIE_DATA_COST = [
  { name: '充电桩资产', value: 30 },
  { name: '变压器/增容', value: 15 },
  { name: '电气配套', value: 10 },
  { name: '运维支出', value: 12 },
  { name: '场地租金', value: 10 },
  { name: '购电成本', value: 15 },
  { name: '人工支出', value: 5 },
  { name: '平台服务费', value: 3 },
];

export const PIE_DATA_POWER = [
  { name: '直流快充', value: 45 },
  { name: '液冷超充', value: 25 },
  { name: '交流慢充', value: 20 },
  { name: 'V2G终端', value: 10 },
];

export const PIE_DATA_FUNCTION = [
  { name: '专用场站', value: 120 },
  { name: '公共开放', value: 350 },
  { name: '换电站', value: 45 },
  { name: '居民小区', value: 210 },
  { name: '商业中心', value: 180 },
  { name: '高速服务', value: 95 },
];

export const PIE_DATA_UTILIZATION = [
  { name: '高利用率 (>60%)', value: 200 },
  { name: '中利用率 (30-60%)', value: 450 },
  { name: '低利用率 (<30%)', value: 350 },
];

export const PIE_DATA_COST_DIST = [
  { name: '高成本站', value: 150 },
  { name: '中成本站', value: 500 },
  { name: '低成本站', value: 350 },
];

export const PIE_DATA_L2_GRID = [
  { name: '核心商业网格', value: 320 },
  { name: '居住密集网格', value: 480 },
  { name: '工业区网格', value: 150 },
  { name: '其他网格', value: 50 },
];

export const PIE_DATA_SERVICE_CAP = [
  { name: 'S级卓越', value: 120 },
  { name: 'A级优秀', value: 340 },
  { name: 'B级良好', value: 400 },
  { name: 'C级一般', value: 140 },
];

export const PIE_DATA_OPS_STATUS = [
  { name: '运营正常', value: 850 },
  { name: '部分故障', value: 120 },
  { name: '停运维护', value: 30 },
];

export const PILE_STATUS_BASE = [
  { name: '空闲待机', value: 3200, color: '#22c55e' },
  { name: '正在充电', value: 8800, color: '#0ea5e9' },
  { name: '离线/故障', value: 450, color: '#ef4444' },
];