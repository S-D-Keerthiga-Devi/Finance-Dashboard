import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { cn } from '../../utils/cn';
import { formatCurrency } from '../../utils/format';

export default function SummaryCards() {
  const transactions = useStore((state) => state.transactions);

  const { income, expense, balance } = useMemo(() => {
    return transactions.reduce(
      (acc, curr) => {
        if (curr.type === 'income') {
          acc.income += curr.amount;
          acc.balance += curr.amount;
        } else {
          acc.expense += curr.amount;
          acc.balance -= curr.amount;
        }
        return acc;
      },
      { income: 0, expense: 0, balance: 0 }
    );
  }, [transactions]);

  const cards = [
    { name: 'Total Balance', value: balance, icon: Wallet, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/50' },
    { name: 'Total Income', value: income, icon: ArrowUpRight, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/50' },
    { name: 'Total Expenses', value: expense, icon: ArrowDownRight, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div key={card.name} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.name}</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {formatCurrency(card.value)}
              </p>
            </div>
            <div className={cn("p-4 rounded-xl", card.bg)}>
              <card.icon className={cn("w-7 h-7", card.color)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
