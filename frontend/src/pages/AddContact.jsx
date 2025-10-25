import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { HiOutlineArrowLeft, HiOutlineCheckCircle, HiOutlinePlus, HiOutlineXMark } from 'react-icons/hi2';
import api from '../utils/api';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  name: '',
  address: '',
  events: [
  ],
};

const formatForInput = (value) => {
  if (!value) return '';
  try {
    return format(new Date(value), 'yyyy-MM-dd');
  } catch {
    return value;
  }
};

const AddContact = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { logout } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchContact = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const { data } = await api.get(`/contacts/${id}`);
        const contact = data?.contact ?? data;
        if (!contact) {
          toast.error('Contact not found');
          navigate('/contacts');
          return;
        }

        const legacyName = contact.name ?? '';
        const split = legacyName.trim().split(' ');
        const legacyFirst = contact.firstName ?? split[0] ?? '';
        const legacyLast = contact.lastName ?? (split.length > 1 ? split.slice(1).join(' ') : '');

        const addressString = typeof contact.address === 'object' && contact.address !== null
          ? [contact.address.line1, contact.address.city, contact.address.state, contact.address.pincode].filter(Boolean).join(', ')
          : (contact.address ?? '');

        const eventsArray = Array.isArray(contact.events) ? contact.events.map((e) => ({
          type: e.type ?? 'custom',
          label: e.label ?? '',
          date: formatForInput(e.date),
          recurring: typeof e.recurring === 'boolean' ? e.recurring : true,
        })) : [
          contact.birthday ? { type: 'birthday', date: formatForInput(contact.birthday), label: '', recurring: true } : null,
          contact.marriageAnniversary ? { type: 'marriage', date: formatForInput(contact.marriageAnniversary), label: '', recurring: true } : null,
          contact.deathAnniversary ? { type: 'death', date: formatForInput(contact.deathAnniversary), label: '', recurring: true } : null,
        ].filter(Boolean);

        setForm({
          name: contact.name ?? `${legacyFirst} ${legacyLast}`.trim(),
          address: addressString,
          events: eventsArray,
        });
      } catch (error) {
        toast.error(error.message);
        if (error.response?.status === 401) {
          logout();
          navigate('/login');
          return;
        }
        navigate('/contacts');
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [id, logout, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  

  const addEventRow = () => {
    setForm((prev) => ({ ...prev, events: [...prev.events, { type: 'birthday', label: '', date: '', recurring: true }] }));
  };

  const updateEventRow = (index, patch) => {
    setForm((prev) => {
      const copy = [...prev.events];
      copy[index] = { ...copy[index], ...patch };
      return { ...prev, events: copy };
    });
  };

  const removeEventRow = (index) => {
    setForm((prev) => ({ ...prev, events: prev.events.filter((_, i) => i !== index) }));
  };

  const payload = useMemo(() => {
    const events = Array.isArray(form.events)
      ? form.events
          .map((e) => ({
            type: e.type || 'custom',
            label: e.label || undefined,
            date: e.date || undefined,
            recurring: typeof e.recurring === 'boolean' ? e.recurring : true,
          }))
          .filter((e) => e.type && e.date)
      : undefined;

    return {
      name: form.name || undefined,
      address: form.address || undefined,
      events,
    };
  }, [form]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      if (!payload.name) {
        toast.error('Name is required');
        setSaving(false);
        return;
      }

      if (id) {
        await api.put(`/contacts/${id}`, payload);
        toast.success('Contact updated');
      } else {
        await api.post('/contacts', payload);
        toast.success('Contact added');
      }
      navigate('/contacts');
    } catch (error) {
      toast.error(error.message);
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader label="Loading contact" />;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {id ? 'Edit contact' : 'Add a new contact'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Capture important milestones to stay connected year-round.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-500 hover:text-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-800 dark:text-slate-300"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back
        </button>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Full name"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            required
          />
        </div>

        <div>
          <label htmlFor="address" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Full address"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            rows={3}
          />
        </div>

        {/* Tags removed */}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Events</label>
            <button type="button" onClick={addEventRow} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:border-brand-500 hover:text-brand-500 dark:border-slate-700 dark:text-slate-300">
              <HiOutlinePlus className="h-4 w-4" /> Add event
            </button>
          </div>
          <div className="space-y-3">
            {form.events.length === 0 && (
              <p className="text-xs text-slate-500 dark:text-slate-400">No events added. Use the button above to add birthdays, anniversaries, etc.</p>
            )}
            {form.events.map((ev, idx) => (
              <div key={idx} className="grid gap-2 sm:grid-cols-4">
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Type</label>
                  <select
                    value={ev.type}
                    onChange={(e) => updateEventRow(idx, { type: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <option value="birthday">Birthday</option>
                    <option value="marriage">Marriage</option>
                    <option value="wedding">Wedding</option>
                    <option value="death">Death</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Label (optional)</label>
                  <input
                    type="text"
                    value={ev.label ?? ''}
                    onChange={(e) => updateEventRow(idx, { label: e.target.value })}
                    placeholder="e.g. Son's birthday"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Date</label>
                  <input
                    type="date"
                    value={ev.date ?? ''}
                    onChange={(e) => updateEventRow(idx, { date: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>
                <div className="flex items-end justify-between gap-2">
                  <label className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={ev.recurring ?? true}
                      onChange={(e) => updateEventRow(idx, { recurring: e.target.checked })}
                    />
                    Recurring
                  </label>
                  <button type="button" onClick={() => removeEventRow(idx)} className="inline-flex items-center gap-1 rounded-lg border border-danger/20 px-3 py-2 text-xs font-medium text-danger hover:bg-danger/10">
                    <HiOutlineXMark className="h-4 w-4" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes removed */}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Securely stored on the server. Only authenticated users can make changes.
          </p>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/40 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <HiOutlineCheckCircle className="h-5 w-5" />
            {saving ? 'Saving…' : id ? 'Update contact' : 'Save contact'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddContact;
