import PropTypes from 'prop-types';
import {
  HiOutlineCalendar,
  HiOutlineHomeModern,
  HiOutlinePencilSquare,
  HiOutlinePhone,
  HiOutlineTrash,
  HiOutlineUserCircle,
} from 'react-icons/hi2';
import { format } from 'date-fns';

const formatDate = (value) => {
  if (!value) return null;
  try {
    return format(new Date(value), 'PPP');
  } catch (error) {
    return value;
  }
};

const ContactCard = ({ contact, onEdit, onDelete }) => (
  <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <HiOutlineUserCircle className="h-10 w-10 text-brand-500" />
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{contact.name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{contact.phone || 'No phone number provided'}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onEdit?.(contact)}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-500 hover:text-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:text-slate-300"
        >
          <HiOutlinePencilSquare className="h-4 w-4" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete?.(contact)}
          className="inline-flex items-center gap-1 rounded-lg border border-danger/20 px-3 py-2 text-sm font-medium text-danger transition hover:bg-danger/10 focus:outline-none focus:ring-2 focus:ring-danger/40"
        >
          <HiOutlineTrash className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>

    <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
      {contact.address && (
        <p className="flex items-center gap-2">
          <HiOutlineHomeModern className="h-4 w-4 text-brand-500" />
          {contact.address}
        </p>
      )}
      {contact.birthday && (
        <p className="flex items-center gap-2">
          <HiOutlineCalendar className="h-4 w-4 text-rose-500" />
          Birthday: <span className="font-medium">{formatDate(contact.birthday)}</span>
        </p>
      )}
      {contact.marriageAnniversary && (
        <p className="flex items-center gap-2">
          <HiOutlineCalendar className="h-4 w-4 text-emerald-500" />
          Marriage Anniversary: <span className="font-medium">{formatDate(contact.marriageAnniversary)}</span>
        </p>
      )}
      {contact.deathAnniversary && (
        <p className="flex items-center gap-2">
          <HiOutlineCalendar className="h-4 w-4 text-slate-500" />
          Death Anniversary: <span className="font-medium">{formatDate(contact.deathAnniversary)}</span>
        </p>
      )}
      {contact.notes && (
        <p className="rounded-lg bg-slate-100 px-3 py-2 text-xs leading-relaxed text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {contact.notes}
        </p>
      )}
    </div>
  </article>
);

ContactCard.propTypes = {
  contact: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string.isRequired,
    phone: PropTypes.string,
    address: PropTypes.string,
    birthday: PropTypes.string,
    marriageAnniversary: PropTypes.string,
    deathAnniversary: PropTypes.string,
    notes: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

ContactCard.defaultProps = {
  onEdit: undefined,
  onDelete: undefined,
};

export default ContactCard;
