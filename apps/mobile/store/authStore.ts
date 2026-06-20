import { create } from 'zustand';
import { AuthState, User } from '@/types';
import { CURRENT_USER } from '@/constants/mockData';

interface AuthStore extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  verifyPin: () => void;
  verifyBiometric: () => void;
  updateBiometrics: (enabled: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: CURRENT_USER, // Pre-populated for demo
  token: 'demo_token_gescopay',
  refreshToken: 'demo_refresh_token',
  isAuthenticated: true, // Auto-authenticated for demo
  isPinVerified: true,
  isBiometricVerified: false,

  login: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: true,
      isPinVerified: false,
      isBiometricVerified: false,
    }),

  logout: () =>
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isPinVerified: false,
      isBiometricVerified: false,
    }),

  setUser: (user) => set({ user }),

  verifyPin: () => set({ isPinVerified: true }),

  verifyBiometric: () => set({ isBiometricVerified: true }),

  updateBiometrics: (enabled) =>
    set((state) => ({
      user: state.user ? { ...state.user, isBiometricsEnabled: enabled } : null,
    })),
}));
