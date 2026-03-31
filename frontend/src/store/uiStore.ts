import { create } from "zustand"

interface UiState {
  sidebarOpen: boolean
  assistantOpen: boolean
  setSidebarOpen: (value: boolean) => void
  setAssistantOpen: (value: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  assistantOpen: false,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setAssistantOpen: (assistantOpen) => set({ assistantOpen })
}))
