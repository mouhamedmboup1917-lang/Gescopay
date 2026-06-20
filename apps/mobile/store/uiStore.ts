import { create } from 'zustand';
import { Theme, Language, ToastMessage } from '@/types';

interface UIStore {
  theme: Theme;
  language: Language;
  toasts: ToastMessage[];
  isBalanceHidden: boolean;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
  toggleBalanceVisibility: () => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  theme: 'light',
  language: 'fr',
  toasts: [],
  isBalanceHidden: false,

  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
  toggleBalanceVisibility: () =>
    set((state) => ({ isBalanceHidden: !state.isBalanceHidden })),

  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: `toast_${Date.now()}` },
      ],
    })),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
