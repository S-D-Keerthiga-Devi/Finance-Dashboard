import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { formatCurrency } from '../../utils/format';
import { TrendingUp, TrendingDown, PieChart, Target } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

export default function Insights() {
  const transactions = useStore((state) => state.transactions);

  const {
    highestCategory,
    highestAmount,
    thisMonthExpense,
    lastMonthExpense,
    momText,
    momIsIncrease,
    income,
    expense,
    ratio
  } = useMemo(() => {
    let thisMonthExp = 0;
    let lastMonthExp = 0;
    let totalInc = 0;
    let totalExp = 0;
    
    const catMap = new Map();

    transactions.forEach(t => {
      const date = parseISO(t.date);
      const diff = differenceInDays(new Date(), date);
      const isExp = t.type === 'expense';
      
      if (isExp) totalExp += t.amount;
      else totalInc += t.amount;

      const isThisWindow = diff >= 0 && diff < 30;
      const isLastWindow = diff >= 30 && diff < 60;

      if (isExp && isThisWindow) {
        thisMonthExp += t.amount;
        catMap.set(t.category, (catMap.get(t.category) || 0) + t.amount);
      }
      
      if (isExp && isLastWindow) {
        lastMonthExp += t.amount;
      }
    });

    let highestCat = 'N/A';
    let highestAmt = 0;
    Array.from(catMap.entries()).forEach(([cat, amt]) => {
      if (amt > highestAmt) {
        highestAmt = amt;
        highestCat = cat;
      }
    });

    let mom = 0;
    if (lastMonthExp > 0) {
      mom = ((thisMonthExp - lastMonthExp) / lastMonthExp) * 100;
    } else if (thisMonthExp > 0) {
      mom = 100;
    }
    
    const isInc = mom > 0;
    const absMom = Math.abs(mom).toFixed(1);
    const momStr = lastMonthExp === 0 && thisMonthExp === 0 
      ? "No expense data for accurate comparison"
      : `You spent ${absMom}% ${isInc ? 'more' : 'less'} than last month`;

    const total = totalInc + totalExp;
    const ratioVal = total === 0 ? 0 : (totalInc / total) * 100;

    return {
      highestCategory: highestCat,
      highestAmount: highestAmt,
      thisMonthExpense: thisMonthExp,
      lastMonthExpense: lastMonthExp,
      momText: momStr,
      momIsIncrease: isInc,
      income: totalInc,
      expense: totalExp,
      ratio: ratioVal
    };
  }, [transactions]);

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <div className="mb-8">
         <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Financial Insights</h1>
         <p className="text-slate-500 dark:text-slate-400 mt-1">AI-driven analysis of your spending habits.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Highest Category */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-4 mb-4">
             <div className="p-3 bg-fuchsia-100 dark:bg-fuchsia-900/50 rounded-xl text-fuchsia-600 dark:text-fuchsia-400">
               <PieChart className="w-6 h-6" />
             </div>
             <div>
               <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top Spending Category</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400">This month's highest expense area</p>
             </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
             <p className="text-3xl font-bold text-slate-900 dark:text-white">
               {highestCategory}
             </p>
             <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
               {formatCurrency(highestAmount)} accounted for this month
             </p>
          </div>
        </div>

        {/* MoM Comparison */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
           <div className="flex items-center gap-4 mb-4">
             <div className={`p-3 rounded-xl ${momIsIncrease ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'}`}>
               {momIsIncrease ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
             </div>
             <div>
               <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Month over Month</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400">Expense comparison</p>
             </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
             <p className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {momText}
             </p>
             <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 text-sm">
                This month: {formatCurrency(thisMonthExpense)} <br/>
                Last month: {formatCurrency(lastMonthExpense)}
             </p>
          </div>
        </div>

        {/* Income to Expense Ratio */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md lg:col-span-2">
          <div className="flex items-center gap-4 mb-6">
             <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-600 dark:text-blue-400">
               <Target className="w-6 h-6" />
             </div>
             <div>
               <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Income to Expense Ratio</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400">Lifetime financial health indicator</p>
             </div>
          </div>
          
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-3 uppercase rounded-full text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                  Income ({formatCurrency(income)})
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block py-1 px-3 uppercase rounded-full text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                  Expense ({formatCurrency(expense)})
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-6 mb-4 text-xs flex rounded-full bg-slate-100 dark:bg-slate-800 w-full mt-4">
               {income > 0 || expense > 0 ? (
                 <>
                   <div style={{ width: `${ratio}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500 transition-all duration-1000"></div>
                   <div style={{ width: `${100 - ratio}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500 transition-all duration-1000"></div>
                 </>
               ) : (
                 <div className="w-full bg-slate-300 dark:bg-slate-700"></div>
               )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-2">
              Your overall income makes up {ratio.toFixed(1)}% of all transaction volume.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
