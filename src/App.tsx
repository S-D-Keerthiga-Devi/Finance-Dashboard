import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './features/dashboard/Dashboard';
import TransactionsList from './features/transactions/TransactionsList';
import Insights from './features/insights/Insights';
import { useStore } from './store/useStore';

function App() {
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={theme === 'dark' ? 'dark h-screen w-full bg-slate-950 text-slate-100 overflow-hidden transition-colors' : 'h-screen w-full bg-slate-50 text-slate-900 overflow-hidden transition-colors'}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
          <Route path="transactions" element={<TransactionsList />} />
          <Route path="insights" element={<Insights />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
