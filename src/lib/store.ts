
import { create } from 'zustand'

interface AppState {
  dailyRitualCompleted: number;
  dailyRitualTotal: number;
  energyLevel: number;
}

export const useAppStore = create<AppState>()((set) => ({
  dailyRitualCompleted: 3,
  dailyRitualTotal: 5,
  energyLevel: 72,
}))
