// types/battery.ts
export type BatteryModel = 'TRES 35' | 'TRES 48' | 'TRES 70' | 'TRES 102';
export type BatteryVisualState = {
  id: number;
  model: string;
  currentCycle: number;
  status: 'charging' | 'discharging' | 'idle' | 'done';
  totalCycles: number;
};

export type LineVisualState = {
  line: number;
  batteries: BatteryVisualState[];
};

export type SimulationSnapshot = {
  time: number;
  lines: LineVisualState[];

};

export interface SimulationInput {
  model: BatteryModel;
  quantity: number;
  totalCycles: number;
   lineNumber: number;
   
}



   
