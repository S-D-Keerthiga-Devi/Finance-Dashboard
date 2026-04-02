import SummaryCards from './SummaryCards';
import Charts from './Charts';

export default function Dashboard() {
  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here's your financial summary at a glance.</p>
      </div>
      
      <SummaryCards />
      <Charts />
    </div>
  );
}
