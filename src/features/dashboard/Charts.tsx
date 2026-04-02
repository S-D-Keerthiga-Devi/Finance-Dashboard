import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, parseISO } from 'date-fns';
import { formatCurrency } from '../../utils/format';

const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#0ea5e9'];

export default function Charts() {
  const transactions = useStore((state) => state.transactions);
  const theme = useStore((state) => state.theme);

  const { trendData, categoryData } = useMemo(() => {
    // Trend Data processing
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let runningBalance = 0;
    const trendMap = new Map();

    sorted.forEach(t => {
      if (t.type === 'income') runningBalance += t.amount;
      else runningBalance -= t.amount;
      
      const dateKey = format(parseISO(t.date), 'MMM dd');
      trendMap.set(dateKey, runningBalance);
    });

    const trendData = Array.from(trendMap.entries()).map(([date, balance]) => ({ date, balance }));

    // Category Data processing (expenses only)
    const expenses = transactions.filter(t => t.type === 'expense');
    const catMap = new Map();
    expenses.forEach(t => {
      catMap.set(t.category, (catMap.get(t.category) || 0) + t.amount);
    });
    const categoryData = Array.from(catMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return { trendData, categoryData };
  }, [transactions]);

  const textColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? '#1e293b' : '#e2e8f0';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-lg">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</p>
          <p className="text-base font-bold text-indigo-600 dark:text-indigo-400">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-lg flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{payload[0].name}</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white ml-2">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-shadow hover:shadow-md">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 tracking-tight">Balance Trend</h2>
        <div className="w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} dy={10} minTickGap={30} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="balance" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-shadow hover:shadow-md flex flex-col h-full">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 tracking-tight">Spending Breakdown</h2>
        <div className="w-full flex-1 flex flex-col">
          {categoryData.length > 0 ? (
            <>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                      animationDuration={1000}
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-700/50">
                {categoryData.map((entry, index) => (
                  <div key={entry.name} className="flex items-start gap-2.5">
                    <div className="w-3 h-3 rounded-full shrink-0 mt-1" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-tight">{entry.name}</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(entry.value)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 w-full h-full">
              <p>No expenses to display</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
