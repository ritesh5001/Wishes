import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { HiOutlineBellAlert, HiOutlineCalendarDays } from 'react-icons/hi2';
import api from '../utils/api';
import Loader from '../components/Loader';
import ReminderCard from '../components/ReminderCard';
import { useAuth } from '../context/AuthContext';

const Reminders = () => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState([]);
  const windowDays = 7;

  const fetchReminders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/reminders/upcoming', { params: { days: windowDays } });
      const remindersData = data?.upcoming ?? data ?? [];
      setReminders(Array.isArray(remindersData) ? remindersData : []);
    } catch (error) {
      toast.error(error.message);
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const groupedStats = useMemo(() => {
    return reminders.reduce(
      (accumulator, reminder) => {
        const t = (reminder.type || '').toLowerCase();
        if (t.includes('birth')) accumulator.birthdays += 1;
        else if (t.includes('marriage') || t.includes('wedding')) accumulator.marriages += 1;
        else if (t.includes('death')) accumulator.remembrances += 1;
        else accumulator.others += 1;
        return accumulator;
      },
      { birthdays: 0, marriages: 0, remembrances: 0, others: 0 },
    );
  }, [reminders]);

  if (loading) {
    return <Loader label="Loading reminders" />;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Upcoming reminders (next {windowDays} days)</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Stay prepared for important birthdays, anniversaries, and remembrance events.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchReminders}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-500 hover:text-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-800 dark:text-slate-300"
        >
          <HiOutlineCalendarDays className="h-5 w-5" />
          Refresh
        </button>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Birthdays', value: groupedStats.birthdays, tone: 'bg-rose-500/10 text-rose-600' },
          { label: 'Marriage anniversaries', value: groupedStats.marriages, tone: 'bg-emerald-500/10 text-emerald-600' },
          { label: 'Remembrance events', value: groupedStats.remembrances, tone: 'bg-slate-500/10 text-slate-600' },
          { label: 'Other reminders', value: groupedStats.others, tone: 'bg-brand-500/10 text-brand-600' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{stat.value}</p>
              </div>
              <span className={`flex h-10 w-10 items-center justify-center rounded-full ${stat.tone}`}>
                <HiOutlineBellAlert className="h-5 w-5" />
              </span>
            </div>
          </div>
        ))}
      </section>

      {reminders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          <p>No reminders yet. Add birthdays and anniversaries to see them here.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reminders.map((reminder) => (
            <ReminderCard key={reminder._id ?? reminder.date} reminder={reminder} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Reminders;
