import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import {
  HiOutlineBellAlert,
  HiOutlineCog6Tooth,
  HiOutlineHome,
  HiOutlinePlusCircle,
  HiOutlineUsers,
  HiOutlineXMark,
} from 'react-icons/hi2';

import BrandLogo from './BrandLogo';
const navItems = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: HiOutlineHome,
  },
  {
    label: 'Contacts',
    to: '/contacts',
    icon: HiOutlineUsers,
  },
  {
    label: 'Add Contact',
    to: '/add-contact',
    icon: HiOutlinePlusCircle,
  },
  {
    label: 'Reminders',
    to: '/reminders',
    icon: HiOutlineBellAlert,
  },
];

const Sidebar = ({ isOpen, onClose }) => (
  <>
    <div
      className={`fixed inset-0 z-30 bg-slate-900/40 transition-opacity duration-200 md:hidden ${
        isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      onClick={onClose}
      aria-hidden="true"
    />

    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-slate-50/80 backdrop-blur transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900/80 md:static md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
    <div className="flex items-center justify-between px-6 py-5 md:hidden">
  <BrandLogo size={48} />
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-brand-500 hover:text-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          aria-label="Close navigation"
        >
          <HiOutlineXMark className="h-6 w-6" />
        </button>
      </div>

    <div className="hidden px-6 py-6 md:block">
  <BrandLogo size={48} />
      </div>

      <nav className="flex-1 space-y-1 px-3 pb-6">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 ${
                isActive
                  ? 'bg-brand-500 text-white shadow-soft'
                  : 'text-slate-600 hover:bg-white hover:text-brand-600 dark:text-slate-300 dark:hover:bg-slate-800'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}

        <div className="mt-6 rounded-xl border border-dashed border-slate-300 px-4 py-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
            <HiOutlineCog6Tooth className="h-5 w-5 text-brand-500" />
            Settings
          </div>
          <p className="mt-2 text-xs leading-relaxed">
            Personalize notifications and preferences. Feature coming soon.
          </p>
        </div>
      </nav>
    </aside>
  </>
);

Sidebar.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

Sidebar.defaultProps = {
  isOpen: false,
  onClose: () => {},
};

export default Sidebar;
