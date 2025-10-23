import { Link } from 'react-router-dom';
import { HiOutlineHome } from 'react-icons/hi2';
import Footer from '../components/Footer';
import BrandLogo from '../components/BrandLogo';

const NotFound = () => (
  <div className="flex min-h-screen flex-col bg-gradient-to-br from-brand-50 via-white to-brand-100 px-4 text-center dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
    <div className="flex flex-1 items-center justify-center">
  <div className="max-w-md rounded-3xl border border-slate-200 bg-white/80 p-10 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
  <div className="mb-4 flex justify-center"><BrandLogo size={56} /></div>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">404</p>
      <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-100">Page not found</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        The resource you are looking for does not exist or might have been moved.
      </p>

      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/40"
      >
        <HiOutlineHome className="h-5 w-5" />
        Back to dashboard
      </Link>
      </div>
    </div>
    <Footer />
  </div>
);

export default NotFound;
