import type { Transaction } from '../types';
import { subDays } from 'date-fns';

const generateId = () => Math.random().toString(36).substr(2, 9);

const today = new Date();

export const mockTransactions: Transaction[] = [
  { id: generateId(), date: subDays(today, 2).toISOString(), amount: 4500, category: 'Salary', type: 'income', description: 'Tech Corp Monthly Salary' },
  { id: generateId(), date: subDays(today, 3).toISOString(), amount: 120, category: 'Food', type: 'expense', description: 'Grocery Store' },
  { id: generateId(), date: subDays(today, 5).toISOString(), amount: 50, category: 'Entertainment', type: 'expense', description: 'Movie Tickets' },
  { id: generateId(), date: subDays(today, 8).toISOString(), amount: 1500, category: 'Rent', type: 'expense', description: 'Monthly Apartment Rent' },
  { id: generateId(), date: subDays(today, 12).toISOString(), amount: 60, category: 'Subscriptions', type: 'expense', description: 'Streaming Services' },
  { id: generateId(), date: subDays(today, 32).toISOString(), amount: 4500, category: 'Salary', type: 'income', description: 'Tech Corp Monthly Salary' },
  { id: generateId(), date: subDays(today, 35).toISOString(), amount: 200, category: 'Food', type: 'expense', description: 'Supermarket' },
  { id: generateId(), date: subDays(today, 40).toISOString(), amount: 80, category: 'Transport', type: 'expense', description: 'Gas Station' },
  { id: generateId(), date: subDays(today, 45).toISOString(), amount: 1500, category: 'Rent', type: 'expense', description: 'Monthly Apartment Rent' },
  { id: generateId(), date: subDays(today, 50).toISOString(), amount: 300, category: 'Shopping', type: 'expense', description: 'New Clothes' },
  { id: generateId(), date: subDays(today, 62).toISOString(), amount: 4500, category: 'Salary', type: 'income', description: 'Tech Corp Monthly Salary' },
  { id: generateId(), date: subDays(today, 65).toISOString(), amount: 150, category: 'Food', type: 'expense', description: 'Restaurant Dinner' },
  { id: generateId(), date: subDays(today, 70).toISOString(), amount: 1500, category: 'Rent', type: 'expense', description: 'Monthly Apartment Rent' },
  { id: generateId(), date: subDays(today, 80).toISOString(), amount: 45, category: 'Subscriptions', type: 'expense', description: 'Gym Membership' },
  { id: generateId(), date: subDays(today, 1).toISOString(), amount: 800, category: 'Freelance', type: 'income', description: 'Web Design Project' },
];
