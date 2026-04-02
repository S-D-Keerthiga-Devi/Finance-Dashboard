import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState } from '../types';
import { mockTransactions } from '../data/mockData';

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      transactions: mockTransactions,
      role: 'Viewer',
      theme: 'light',

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            { ...transaction, id: Math.random().toString(36).substr(2, 9) },
            ...state.transactions,
          ],
        })),

      editTransaction: (id, updatedTransaction) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updatedTransaction } : t
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      setRole: (role) => set({ role }),

      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          // Sync with document element for tailwind dark mode
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { theme: newTheme };
        }),
    }),
    {
      name: 'finance-dashboard-storage',
    }
  )
);
