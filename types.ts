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

export interface StaffRole {
  role: string;
  count: number;
  salary: number; // Monthly RMB
}

export interface Station {
  id: string;
  districtId: string;
  name: string;
  locationLabel: string; 
  position: [number, number]; 
  type: 'Public' | 'Private' | 'Dedicated';
  // Features
  features: string[]; // e.g. "Convenience Store", "Restroom"
  
  // Operational Fields
  revenueLevel: 'S' | 'A' | 'B' | 'C'; 
  fixedCost: number; // Wan Yuan
  operationalCost: number; // Wan Yuan/Year
  parkingFee: number;
  serviceFee: number;
  hasGroundLock: boolean;
  groundLockCoverage: number; // %
  
  // Detailed Staff
  staffDetails: StaffRole[];
  
  piles: PileDetail[];
  // Legacy fields kept for compatibility if needed, but we use staffDetails now
  staffCount: number;
  avgStaffSalary: number; 
}

export interface ChartDataPoint {
  time: string;
  value: number; // Main metric 
  value2?: number; // Secondary 
  value3?: number; // Tertiary
}

export interface AssessmentTag {
  label: string;
  type: 'danger' | 'warning' | 'info';
  evidence: string;
}