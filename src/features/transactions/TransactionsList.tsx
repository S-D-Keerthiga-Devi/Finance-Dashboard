import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Search, Filter, Plus, Pencil, Trash2, ArrowUpDown, Receipt } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { format, parseISO } from 'date-fns';
import { cn } from '../../utils/cn';
import TransactionFormModal from './TransactionFormModal';
import type { Transaction } from '../../types';

export default function TransactionsList() {
  const { transactions, role, deleteTransaction } = useStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const filteredAndSorted = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesSearch = 
          t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
          t.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || t.type === typeFilter;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortField === 'date') {
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        } else {
          comparison = a.amount - b.amount;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [transactions, searchTerm, typeFilter, sortField, sortOrder]);

  const handleSort = (field: 'date' | 'amount') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const openAddModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const openEditModal = (t: Transaction) => {
    setEditingTransaction(t);
    setIsModalOpen(true);
  };

  const isAdmin = role === 'Admin';

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Transactions</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and view your financial records.</p>
        </div>
        
        {isAdmin && (
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add Transaction
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
        {/* Filters Top Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by description or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
            />
          </div>
          
          <div className="relative">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <select
               value={typeFilter}
               onChange={(e) => setTypeFilter(e.target.value as any)}
               className="pl-9 pr-8 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none min-w-[140px]"
             >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
             </select>
          </div>
        </div>

        {/* Table / List */}
        {filteredAndSorted.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm font-medium border-b border-slate-200 dark:border-slate-700/50">
                  <th className="p-4 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200" onClick={() => handleSort('date')}>
                    <div className="flex items-center gap-1">Date <ArrowUpDown className="w-4 h-4" /></div>
                  </th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200" onClick={() => handleSort('amount')}>
                    <div className="flex items-center justify-end gap-1">Amount <ArrowUpDown className="w-4 h-4" /></div>
                  </th>
                  <th className="p-4">Type</th>
                  {isAdmin && <th className="p-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredAndSorted.map((t) => (
                  <tr key={t.id} className="border-b border-slate-100 dark:border-slate-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="p-4 text-slate-500 dark:text-slate-400 text-sm whitespace-nowrap">
                      {format(parseISO(t.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="p-4 font-medium text-slate-900 dark:text-slate-200">{t.description}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {t.category}
                      </span>
                    </td>
                    <td className={cn("p-4 font-semibold whitespace-nowrap text-right", t.type === 'income' ? 'text-emerald-600' : 'text-slate-900 dark:text-slate-200')}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        t.type === 'income' 
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" 
                          : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                      )}>
                        {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditModal(t)} className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent border dark:border-transparent dark:hover:border-slate-700">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteTransaction(t.id)} className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 border-transparent border dark:border-transparent dark:hover:border-rose-500/20">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-200 dark:border-slate-700">
              <Receipt className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No transactions found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              We couldn't find any transactions matching your current filters. Try adjusting your search term or filter category.
            </p>
            {isAdmin && (
               <button 
                 onClick={openAddModal}
                 className="mt-6 flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm border border-slate-200 dark:border-slate-700"
               >
                 <Plus className="w-4 h-4" />
                 Add New Record
               </button>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <TransactionFormModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          transaction={editingTransaction}
        />
      )}
    </div>
  );
}
