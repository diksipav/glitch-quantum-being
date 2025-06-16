
import { create } from 'zustand'

interface EnergyLevels {
  mental: number;
  physical: number;
  emotional: number;
  intentional: number;
}

interface AppState {
  energyLevel: number;
  energyLevels: EnergyLevels;
  focusPoints: number;
  addFocusPoints: (amount: number) => void;
  updateEnergyLevels: (levels: EnergyLevels) => void;
  getAverageEnergyLevel: () => number;
}

export const useAppStore = create<AppState>()((set, get) => ({
  energyLevel: 72,
  energyLevels: {
    mental: 0,
    physical: 0,
    emotional: 0,
    intentional: 0,
  },
  focusPoints: 0,
  addFocusPoints: (amount) => set((state) => ({ focusPoints: state.focusPoints + amount })),
  updateEnergyLevels: (levels) => set({ energyLevels: levels }),
  getAverageEnergyLevel: () => {
    const { energyLevels } = get();
    const total = energyLevels.mental + energyLevels.physical + energyLevels.emotional + energyLevels.intentional;
    return Math.round(total / 4);
  },
}))
