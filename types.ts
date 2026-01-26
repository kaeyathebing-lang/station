export enum ViewState {
  S0_CITY = 'CITY',
  S1_DISTRICT = 'DISTRICT',
  S2_STATION = 'STATION'
}

export enum TimeMode {
  HISTORY = 'HISTORY',
  CURRENT = 'CURRENT',
  PREDICTION = 'PREDICTION'
}

export interface District {
  id: string;
  name: string;
  center: [number, number]; 
  coordinates: [number, number][]; 
  // Dynamic capacity for 3 time modes
  capacityHistory: number;
  capacityCurrent: number;
  capacityPrediction: number;
  
  revenueRank: 'S' | 'A' | 'B' | 'C';
  isActive: boolean; // True = Shenzhen (Interactive), False = Background (Decoration)
}

export interface PileDetail {
  id: string;
  type: string;
  power: number;
  status: 'Idle' | 'Charging' | 'Offline' | 'Fault';
  currentUser?: string;
}

export interface Station {
  id: string;
  districtId: string;
  name: string;
  locationLabel: string; // New: Functional Zone Tag (e.g., Commercial, Scenic)
  position: [number, number]; 
  type: 'Public' | 'Private' | 'Dedicated';
  // New Operational Fields
  revenueLevel: 'S' | 'A' | 'B' | 'C'; // S=High Profit, C=Loss
  fixedCost: number; // Wan Yuan
  operationalCost: number; // Wan Yuan/Year
  parkingFee: number;
  serviceFee: number;
  hasGroundLock: boolean;
  groundLockCoverage: number; // %
  staffCount: number;
  avgStaffSalary: number; // Yuan
  piles: PileDetail[];
}

export interface ChartDataPoint {
  time: string;
  value: number; // Main metric (e.g., Capacity or Revenue)
  value2?: number; // Secondary (e.g., Orders)
  value3?: number; // Prediction
}

export interface AssessmentTag {
  label: string;
  type: 'danger' | 'warning' | 'info';
  evidence: string;
}