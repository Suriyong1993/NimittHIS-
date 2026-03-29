import { create } from "zustand"

interface UiState {
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen })
}))
