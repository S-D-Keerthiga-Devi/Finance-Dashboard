import { Menu, Moon, Sun, Shield, ChevronDown, Check } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useState, useRef, useEffect } from 'react';

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, toggleTheme, role, setRole } = useStore();
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const roleMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target as Node)) {
        setIsRoleMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 transition-colors duration-200">
      <button 
        onClick={onMenuClick}
        className="p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 lg:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* flex spacer */}
      <div className="flex-1 lg:hidden"></div>

      <div className="flex items-center gap-3 sm:gap-4 ml-auto">
        <div className="relative" ref={roleMenuRef}>
          <button 
            type="button"
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <Shield className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 pr-1">{role}</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
          
          {isRoleMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50 transform origin-top-right transition-all">
              <button
                type="button"
                className={`flex items-center justify-between w-full text-left px-4 py-2.5 text-sm transition-colors ${role === 'Viewer' ? 'text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50/50 dark:bg-indigo-900/20' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                onClick={() => { setRole('Viewer'); setIsRoleMenuOpen(false); }}
              >
                <span>Viewer</span>
                {role === 'Viewer' && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
              </button>
              <button
                type="button"
                className={`flex items-center justify-between w-full text-left px-4 py-2.5 text-sm transition-colors ${role === 'Admin' ? 'text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50/50 dark:bg-indigo-900/20' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                onClick={() => { setRole('Admin'); setIsRoleMenuOpen(false); }}
              >
                <span>Admin</span>
                {role === 'Admin' && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => toggleTheme()}
          className="flex items-center justify-center p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center border border-indigo-200 dark:border-indigo-800 shadow-sm">
          <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400">AJ</span>
        </div>
      </div>
    </header>
  );
}
