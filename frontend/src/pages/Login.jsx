import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { HiOutlineLockClosed, HiOutlineEnvelope } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import BrandLogo from '../components/BrandLogo';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await login(form);
      toast.success('Welcome back!');
      const redirectTo = location.state?.from?.pathname ?? '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-brand-50 via-white to-brand-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="flex flex-1 items-center justify-center px-4">
  <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
  <div className="mb-8 text-center">
                <div className="flex justify-center"><BrandLogo size={56} /></div>
          <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100">Login to your account</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Access your dashboard, contacts, and reminders.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Email address
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500 dark:border-slate-700 dark:bg-slate-900">
              <HiOutlineEnvelope className="h-5 w-5 text-slate-400" />
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Password
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500 dark:border-slate-700 dark:bg-slate-900">
              <HiOutlineLockClosed className="h-5 w-5 text-slate-400" />
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/40 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-brand-600 transition hover:text-brand-500"
          >
            Create one now
          </Link>
        </p>
        </div>
      </div>
      <div>
        
      </div>
      <Footer />
    </div>
  );
};

export default Login;
