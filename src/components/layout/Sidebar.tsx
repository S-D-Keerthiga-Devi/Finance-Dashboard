import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, Lightbulb, X, Wallet } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: ArrowRightLeft },
  { name: 'Insights', href: '/insights', icon: Lightbulb },
];

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={cn("fixed inset-0 z-40 bg-slate-900/80 transition-opacity lg:hidden", isOpen ? "opacity-100" : "opacity-0 pointer-events-none")}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <div className="p-1.5 bg-indigo-600 rounded-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">Zorvyn</span>
          </Link>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-indigo-700 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
