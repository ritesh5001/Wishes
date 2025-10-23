import { useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';

  const stored = localStorage.getItem('pcm_theme');
  if (stored === 'dark' || stored === 'light') {
    return stored;
  }

  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
  return prefersDark ? 'dark' : 'light';
};

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('pcm_theme', theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const layoutClass = useMemo(
    () =>
      'min-h-screen bg-slate-100 font-sans text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-50',
    [],
  );

  return (
    <div className={layoutClass}>
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex flex-1 flex-col">
          <Navbar
            onMenuClick={() => setSidebarOpen(true)}
            onToggleTheme={setTheme}
            theme={theme}
          />
          <main className="mx-auto w-full max-w-6xl flex-1 p-6">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
