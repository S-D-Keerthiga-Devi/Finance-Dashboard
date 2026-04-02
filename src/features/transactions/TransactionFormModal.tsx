import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { X } from 'lucide-react';
import type { Transaction } from '../../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export default function TransactionFormModal({ isOpen, onClose, transaction }: ModalProps) {
  const { addTransaction, editTransaction } = useStore();
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense' as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description,
        amount: transaction.amount.toString(),
        category: transaction.category,
        type: transaction.type,
        date: transaction.date.split('T')[0]
      });
    } else {
      setFormData({
         description: '',
         amount: '',
         category: '',
         type: 'expense',
         date: new Date().toISOString().split('T')[0]
      });
    }
  }, [transaction, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString()
    };

    if (transaction) {
      editTransaction(transaction.id, data);
    } else {
      addTransaction(data);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {transaction ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5 cursor-pointer">
               <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Type</span>
               <select 
                 value={formData.type}
                 onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                 className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 disabled:opacity-50"
               >
                 <option value="expense">Expense</option>
                 <option value="income">Income</option>
               </select>
            </label>
            <label className="flex flex-col gap-1.5">
               <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Date</span>
               <input 
                 type="date" 
                 required
                 value={formData.date}
                 onChange={(e) => setFormData({...formData, date: e.target.value})}
                 className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
               />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</span>
            <input 
              type="text" 
              required
              placeholder="E.g. Groceries at Whole Foods"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
               <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</span>
               <input 
                 type="text" 
                 required
                 placeholder="E.g. Food"
                 value={formData.category}
                 onChange={(e) => setFormData({...formData, category: e.target.value})}
                 className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
               />
            </label>
            <label className="flex flex-col gap-1.5">
               <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount</span>
               <div className="relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">$</span>
                 <input 
                   type="number" 
                   required
                   min="0.01"
                   step="0.01"
                   placeholder="0.00"
                   value={formData.amount}
                   onChange={(e) => setFormData({...formData, amount: e.target.value})}
                   className="w-full pl-8 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                 />
               </div>
            </label>
          </div>

          <div className="pt-4 flex gap-3 justify-end mt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent dark:border-slate-700"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
            >
              {transaction ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
