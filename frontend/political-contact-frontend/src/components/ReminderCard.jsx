import PropTypes from 'prop-types';
import { format, formatDistanceToNow } from 'date-fns';
import { HiOutlineBellAlert } from 'react-icons/hi2';

const badgeStyles = {
  birthday: 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200',
  marriage: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200',
  death: 'bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-200',
};

const ReminderCard = ({ reminder }) => {
  const type = reminder.type?.toLowerCase();
  const badgeClass = badgeStyles[type] ?? 'bg-brand-100 text-brand-600';
  const rawDate = reminder.date ? new Date(reminder.date) : null;
  const date = rawDate && !Number.isNaN(rawDate.getTime()) ? rawDate : null;

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 dark:bg-brand-500/20">
            <HiOutlineBellAlert className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{reminder.name}</h3>
            {reminder.contactName && (
              <p className="text-xs text-slate-500 dark:text-slate-400">For {reminder.contactName}</p>
            )}
          </div>
        </div>

        {type && (
          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${badgeClass}`}>
            {type}
          </span>
        )}
      </div>

      {date && (
        <div className="text-sm text-slate-600 dark:text-slate-300">
          <p className="font-medium">{format(date, 'PPP')}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {formatDistanceToNow(date, { addSuffix: true })}
          </p>
        </div>
      )}

      {reminder.notes && (
        <p className="rounded-lg bg-slate-100 px-3 py-2 text-xs leading-relaxed text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {reminder.notes}
        </p>
      )}
    </article>
  );
};

ReminderCard.propTypes = {
  reminder: PropTypes.shape({
    _id: PropTypes.string,
    type: PropTypes.string,
    date: PropTypes.string,
    name: PropTypes.string,
    contactName: PropTypes.string,
    notes: PropTypes.string,
  }).isRequired,
};

export default ReminderCard;
