import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { HiOutlineMagnifyingGlass, HiOutlinePlusCircle } from 'react-icons/hi2';
import api from '../utils/api';
import Loader from '../components/Loader';
import ContactCard from '../components/ContactCard';
import { useAuth } from '../context/AuthContext';

const Contacts = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/contacts');
      const contactsData = data?.contacts ?? data ?? [];
      setContacts(Array.isArray(contactsData) ? contactsData : []);
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
    fetchContacts();
  }, [fetchContacts]);

  const handleDelete = async (contact) => {
    const confirmation = window.confirm(`Delete ${contact.name}? This action cannot be undone.`);
    if (!confirmation) return;

    try {
      await api.delete(`/contacts/${contact._id}`);
      toast.success('Contact deleted');
      setContacts((prev) => prev.filter((item) => item._id !== contact._id));
    } catch (error) {
      toast.error(error.message);
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  const filteredContacts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return contacts;
    return contacts.filter((contact) => contact.name?.toLowerCase().includes(term));
  }, [contacts, search]);

  if (loading) {
    return <Loader label="Fetching contacts" />;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Contacts</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Search, update, and manage the people you care about.
          </p>
        </div>

        <Link
          to="/add-contact"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/40"
        >
          <HiOutlinePlusCircle className="h-5 w-5" />
          Add contact
        </Link>
      </header>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search contacts by name"
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <button
          type="button"
          onClick={fetchContacts}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-500 hover:text-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-800 dark:text-slate-300"
        >
          Refresh
        </button>
      </div>

      {filteredContacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          <p>No contacts found.</p>
          <button
            type="button"
            onClick={() => navigate('/add-contact')}
            className="text-sm font-semibold text-brand-600 hover:text-brand-500"
          >
            Add your first contact
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredContacts.map((contact) => (
            <ContactCard
              key={contact._id ?? contact.name}
              contact={contact}
              onEdit={() => navigate(`/add-contact/${contact._id}`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Contacts;
