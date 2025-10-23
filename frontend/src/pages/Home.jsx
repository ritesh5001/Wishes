import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';
import Footer from '../components/Footer';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // If the user is already logged in, take them straight to the app
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Respect saved theme preference (light/dark)
  useEffect(() => {
    const root = document.documentElement;
    const storedTheme = localStorage.getItem('pcm_theme');
    const nextTheme = storedTheme === 'dark' ? 'dark' : 'light';
    root.classList.toggle('dark', nextTheme === 'dark');
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <BrandLogo size={56} />
        </Link>

        <div className="flex items-center gap-3 text-sm font-medium">
          <Link
            to="/login"
            className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600 transition hover:border-brand-500 hover:text-brand-500 dark:border-slate-800 dark:text-slate-300"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-brand-500 px-4 py-2 text-white shadow-sm transition hover:bg-brand-600"
          >
            Create account
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6">
        <section className="flex min-h-[68vh] flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl dark:text-white">
            Keep important dates in one place
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            Add contacts with their birthdays, anniversaries, and other events. We’ll remind you before they happen so
            you never miss a moment.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/register"
              className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
            >
              Get started
            </Link>
            <Link
              to="/login"
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand-500 hover:text-brand-500 dark:border-slate-700 dark:text-slate-200"
            >
              I already have an account
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
