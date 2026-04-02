export type TransactionType = 'income' | 'expense';
export type Role = 'Viewer' | 'Admin';
export type Theme = 'light' | 'dark';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
  description: string;
}

export interface AppState {
  transactions: Transaction[];
  role: Role;
  theme: Theme;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, updatedTransaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setRole: (role: Role) => void;
  toggleTheme: () => void;
}
