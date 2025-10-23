import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import AddContact from './pages/AddContact';
import Reminders from './pages/Reminders';
import NotFound from './pages/NotFound';
import Home from './pages/Home';

const App = () => (
  <>
    <Routes>
      <Route path="/" element={<Home />} />

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/add-contact" element={<AddContact />} />
          <Route path="/add-contact/:id" element={<AddContact />} />
          <Route path="/reminders" element={<Reminders />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>

    <Toaster
      position="top-right"
      toastOptions={{
        className: 'text-sm font-medium',
        success: {
          iconTheme: {
            primary: '#FF9933',
            secondary: '#ffffff',
          },
        },
      }}
    />
  </>
);

export default App;
