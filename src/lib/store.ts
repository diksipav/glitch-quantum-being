
import { create } from 'zustand'

interface AppState {
  dailyRitualCompleted: number;
  dailyRitualTotal: number;
  energyLevel: number;
  focusPoints: number;
  addFocusPoints: (amount: number) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  dailyRitualCompleted: 3,
  dailyRitualTotal: 5,
  energyLevel: 72,
  focusPoints: 0,
  addFocusPoints: (amount) => set((state) => ({ focusPoints: state.focusPoints + amount })),
}))
