
import { create } from 'zustand'

interface AppState {
  energyLevel: number;
  focusPoints: number;
  addFocusPoints: (amount: number) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  energyLevel: 72,
  focusPoints: 0,
  addFocusPoints: (amount) => set((state) => ({ focusPoints: state.focusPoints + amount })),
}))
