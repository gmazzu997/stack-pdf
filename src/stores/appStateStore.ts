import { create } from 'zustand';

interface AppStateStore {
  isInitialized: boolean;

  initializeApp: () => Promise<void>;
}

export const useAppStateStore = create<AppStateStore>((set) => ({
  isInitialized: false,

  initializeApp: async () => {
    set({ isInitialized: true });
  },
}));
