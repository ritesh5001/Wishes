import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { HiOutlineBars3, HiOutlineBellAlert, HiOutlineMoon, HiOutlineSun, HiOutlineUserCircle } from 'react-icons/hi2';
import BrandLogo from './BrandLogo';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onMenuClick, onToggleTheme, theme }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('You have been logged out');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Centered large logo on mobile */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center md:hidden">
          <BrandLogo size={56} />
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-brand-500 hover:text-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 md:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            aria-label="Toggle navigation"
          >
            <HiOutlineBars3 className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Hide the left-side logo on mobile (centered logo is shown) */}
            <span className="hidden md:inline-flex"><BrandLogo size={48} /></span>
            {/* Hide greeting on small screens to avoid wrapping */}
            <h1 className="hidden md:block text-base font-semibold text-slate-800 dark:text-slate-100">
              {user?.name ? `Welcome back, ${user.name.split(' ')[0]}!` : 'Dashboard'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={() => onToggleTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-brand-500 hover:text-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? (
              <HiOutlineSun className="h-5 w-5" />
            ) : (
              <HiOutlineMoon className="h-5 w-5" />
            )}
          </button>

          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-brand-500 hover:text-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            aria-label="Notifications"
          >
            <HiOutlineBellAlert className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-danger" />
          </button>

          {/* Hide the detailed user panel on mobile to save space */}
          <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
            <HiOutlineUserCircle className="h-8 w-8 text-brand-500" />
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.name ?? 'Guest'}</p>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-medium text-brand-600 transition hover:text-brand-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

Navbar.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
  onToggleTheme: PropTypes.func.isRequired,
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
};

export default Navbar;
