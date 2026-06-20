import { create } from 'zustand';
import { Wallet } from '@/types';
import { MOCK_WALLETS, TOTAL_BALANCE } from '@/constants/mockData';

interface WalletStore {
  wallets: Wallet[];
  totalBalance: number;
  isLoading: boolean;
  defaultWallet: Wallet | null;
  addWallet: (wallet: Wallet) => void;
  removeWallet: (walletId: string) => void;
  setDefault: (walletId: string) => void;
  updateBalance: (walletId: string, balance: number) => void;
  syncWallets: () => Promise<void>;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  wallets: MOCK_WALLETS,
  totalBalance: TOTAL_BALANCE,
  isLoading: false,
  defaultWallet: MOCK_WALLETS.find((w) => w.isDefault) ?? MOCK_WALLETS[0],

  addWallet: (wallet) =>
    set((state) => {
      const newWallets = [...state.wallets, wallet];
      return {
        wallets: newWallets,
        totalBalance: newWallets.reduce((s, w) => s + w.balance, 0),
      };
    }),

  removeWallet: (walletId) =>
    set((state) => {
      const newWallets = state.wallets.filter((w) => w.id !== walletId);
      return {
        wallets: newWallets,
        totalBalance: newWallets.reduce((s, w) => s + w.balance, 0),
      };
    }),

  setDefault: (walletId) =>
    set((state) => ({
      wallets: state.wallets.map((w) => ({ ...w, isDefault: w.id === walletId })),
      defaultWallet: state.wallets.find((w) => w.id === walletId) ?? state.defaultWallet,
    })),

  updateBalance: (walletId, balance) =>
    set((state) => {
      const newWallets = state.wallets.map((w) =>
        w.id === walletId ? { ...w, balance } : w
      );
      return {
        wallets: newWallets,
        totalBalance: newWallets.reduce((s, w) => s + w.balance, 0),
      };
    }),

  syncWallets: async () => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 1500));
    set({ isLoading: false });
  },
}));
