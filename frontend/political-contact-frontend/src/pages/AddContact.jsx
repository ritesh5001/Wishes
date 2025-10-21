import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { HiOutlineArrowLeft, HiOutlineCheckCircle } from 'react-icons/hi2';
import api from '../utils/api';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  name: '',
  phone: '',
  address: '',
  birthday: '',
  marriageAnniversary: '',
  deathAnniversary: '',
  notes: '',
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

        setForm({
          name: contact.name ?? '',
          phone: contact.phone ?? '',
          address: contact.address ?? '',
          birthday: formatForInput(contact.birthday),
          marriageAnniversary: formatForInput(contact.marriageAnniversary),
          deathAnniversary: formatForInput(contact.deathAnniversary),
          notes: contact.notes ?? '',
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

  const payload = useMemo(() => {
    const cleaned = { ...form };
    Object.entries(cleaned).forEach(([key, value]) => {
      cleaned[key] = value || undefined;
    });
    return cleaned;
  }, [form]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
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
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Person's full name"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Phone number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="Contact number"
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
            placeholder="House number, street, locality, city"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            rows={3}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="birthday" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Birthday
            </label>
            <input
              id="birthday"
              name="birthday"
              type="date"
              value={form.birthday}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label htmlFor="marriageAnniversary" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Marriage anniversary
            </label>
            <input
              id="marriageAnniversary"
              name="marriageAnniversary"
              type="date"
              value={form.marriageAnniversary}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label htmlFor="deathAnniversary" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Death anniversary
            </label>
            <input
              id="deathAnniversary"
              name="deathAnniversary"
              type="date"
              value={form.deathAnniversary}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
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
