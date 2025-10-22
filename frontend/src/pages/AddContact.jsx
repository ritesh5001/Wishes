import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { HiOutlineArrowLeft, HiOutlineCheckCircle, HiOutlinePlus, HiOutlineXMark, HiOutlineTag } from 'react-icons/hi2';
import api from '../utils/api';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  firstName: '',
  lastName: '',
  address: '',
  tags: [],
  notes: '',
  events: [
    // example default row (optional): { type: 'birthday', date: '' }
  ],
};

const formatForInput = (value) => {
  if (!value) return '';
  try {
    return format(new Date(value), 'yyyy-MM-dd');
  } catch (error) {
    return value;
  }
};

const AddContact = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { logout } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [tagInput, setTagInput] = useState('');
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

        // Support both new and legacy schema
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
          firstName: legacyFirst,
          lastName: legacyLast,
          address: addressString,
          tags: Array.isArray(contact.tags) ? contact.tags : [],
          notes: contact.notes ?? '',
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

  // address is a single string now

  const addTag = () => {
    const v = tagInput.trim();
    if (!v) return;
    if (form.tags.includes(v)) {
      setTagInput('');
      return;
    }
    setForm((prev) => ({ ...prev, tags: [...prev.tags, v] }));
    setTagInput('');
  };

  const removeTag = (tag) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
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
    const tags = Array.isArray(form.tags) && form.tags.length > 0 ? form.tags : undefined;
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
      firstName: form.firstName || undefined,
      lastName: form.lastName || undefined,
      address: form.address || undefined,
      tags,
      notes: form.notes || undefined,
      events,
    };
  }, [form]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      if (!payload.firstName) {
        toast.error('First name is required');
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
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First name"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last name"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
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

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Tags</label>
          <div className="flex flex-wrap items-center gap-2">
            {form.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <HiOutlineTag className="h-3 w-3" />
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="ml-1 rounded-full p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700">
                  <HiOutlineXMark className="h-3 w-3" />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Add tag and press Enter"
              className="min-w-[200px] flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            <button type="button" onClick={addTag} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:border-brand-500 hover:text-brand-500 dark:border-slate-700 dark:text-slate-300">
              <HiOutlinePlus className="h-4 w-4" /> Add tag
            </button>
          </div>
        </div>

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

        <div>
          <label htmlFor="notes" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Personal preferences, family details, community contributions, etc."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            rows={4}
          />
        </div>

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
