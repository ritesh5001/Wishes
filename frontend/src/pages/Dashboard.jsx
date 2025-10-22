import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  HiOutlineArrowTopRightOnSquare,
  HiOutlineCalendar,
  HiOutlineChevronRight,
  HiOutlineUserGroup,
  HiOutlineUsers,
} from 'react-icons/hi2';
import api from '../utils/api';
import Loader from '../components/Loader';
import ReminderCard from '../components/ReminderCard';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [contactsResponse, remindersResponse] = await Promise.all([
          api.get('/contacts'),
          api.get('/reminders/upcoming'),
        ]);

        const contactsData = contactsResponse.data?.contacts ?? contactsResponse.data ?? [];
        const remindersData = remindersResponse.data?.reminders ?? remindersResponse.data ?? [];

        setContacts(Array.isArray(contactsData) ? contactsData : []);
        setReminders(Array.isArray(remindersData) ? remindersData : []);
      } catch (error) {
        toast.error(error.message);
        if (error.response?.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [logout]);

  const stats = useMemo(() => {
    const birthdayCount = reminders.filter((item) => item.type?.toLowerCase() === 'birthday').length;
    const marriageCount = reminders.filter((item) => item.type?.toLowerCase() === 'marriage').length;
    const deathCount = reminders.filter((item) => item.type?.toLowerCase() === 'death').length;

    return [
      {
        label: 'Total contacts',
        value: contacts.length,
        icon: HiOutlineUsers,
        accent: 'bg-brand-500/10 text-brand-600',
      },
      {
        label: 'Upcoming birthdays',
        value: birthdayCount,
        icon: HiOutlineCalendar,
        accent: 'bg-rose-500/10 text-rose-600',
      },
      {
        label: 'Wedding anniversaries',
        value: marriageCount,
        icon: HiOutlineUserGroup,
        accent: 'bg-emerald-500/10 text-emerald-600',
      },
      {
        label: 'Remembrance events',
        value: deathCount,
        icon: HiOutlineCalendar,
        accent: 'bg-slate-500/10 text-slate-600',
      },
    ];
  }, [contacts.length, reminders]);

  const latestReminders = useMemo(() => reminders.slice(0, 4), [reminders]);
  const recentContacts = useMemo(() => contacts.slice(0, 4), [contacts]);

  const formatContactDate = (value) => {
    if (!value) return null;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return format(parsed, 'dd MMM');
  };

  if (loading) {
    return <Loader label="Loading dashboard" />;
  }

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Overview</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Keep track of important milestones and stay connected with your community.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/contacts"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-500 hover:text-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:text-slate-300"
            >
              View contacts
              <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
            </Link>
            <Link
              to="/add-contact"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/40"
            >
              New contact
              <HiOutlineChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <motion.div
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                staggerChildren: 0.05,
                duration: 0.4,
              },
            },
          }}
        >
          {stats.map(({ label, value, icon: Icon, accent }) => (
            <motion.div
              key={label}
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <span className={`flex h-8 w-8 items-center justify-center rounded-full ${accent}`}>
                  <Icon className="h-4 w-4" />
                </span>
                {label}
              </div>
              <p className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <header className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Upcoming reminders</h3>
            <Link to="/reminders" className="text-sm font-semibold text-brand-600 hover:text-brand-500">
              View all
            </Link>
          </header>

          {latestReminders.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No reminders scheduled yet.</p>
          ) : (
            <div className="space-y-4">
              {latestReminders.map((reminder) => (
                <ReminderCard key={reminder._id ?? reminder.date} reminder={reminder} />
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <header className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recently added contacts</h3>
            <Link to="/contacts" className="text-sm font-semibold text-brand-600 hover:text-brand-500">
              Manage
            </Link>
          </header>

          {recentContacts.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">You have not added any contacts yet.</p>
          ) : (
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {recentContacts.map((contact) => (
                <li
                  key={contact._id ?? contact.name}
                  className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-800"
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{contact.name}</p>
                    {formatContactDate(contact.birthday) && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Birthday: {formatContactDate(contact.birthday)}
                      </p>
                    )}
                  </div>
                  <span className="text-xs font-medium uppercase text-brand-600">{contact.phone ?? 'Contact'}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
