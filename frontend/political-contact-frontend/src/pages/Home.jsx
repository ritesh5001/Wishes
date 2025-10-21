import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineBellAlert,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlineFingerPrint,
  HiOutlineSparkles,
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';

const featureItems = [
  {
    title: 'People-first insights',
    description: 'Capture birthdays, anniversaries, and personal notes so every interaction feels thoughtful.',
    icon: HiOutlineSparkles,
  },
  {
    title: 'Smart reminders',
    description:
      'Automated alerts help you plan ahead for upcoming events, ensuring no important date is missed.',
    icon: HiOutlineBellAlert,
  },
  {
    title: 'Secure workspace',
    description: 'Enterprise-grade authentication with granular permissions keeps sensitive information protected.',
    icon: HiOutlineFingerPrint,
  },
  {
    title: 'Analytics that guide you',
    description: 'Actionable dashboards show community trends, helping you prioritize outreach with confidence.',
    icon: HiOutlineChartBar,
  },
];

const steps = [
  {
    title: 'Create your account',
    body: 'Sign up in seconds and invite your core team members to collaborate seamlessly.',
  },
  {
    title: 'Import contacts',
    body: 'Add residents, local leaders, and key stakeholders with all their important milestones.',
  },
  {
    title: 'Automate reminders',
    body: 'Enable smart notifications and stay ahead of birthdays, anniversaries, and community events.',
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const root = document.documentElement;
    const storedTheme = localStorage.getItem('pcm_theme');
    const nextTheme = storedTheme === 'dark' ? 'dark' : 'light';
    root.classList.toggle('dark', nextTheme === 'dark');
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Constituent milestones tracked', value: '25K+' },
      { label: 'Automated reminders sent', value: '480K+' },
      { label: 'Leaders who trust PCM', value: '1,200+' },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white font-semibold">
            PCM
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-brand-600">Political Contact Manager</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Connect with care</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex dark:text-slate-300">
          <a href="#features" className="hover:text-brand-500">Features</a>
          <a href="#workflow" className="hover:text-brand-500">Workflow</a>
          <a href="#security" className="hover:text-brand-500">Security</a>
          <a href="#cta" className="hover:text-brand-500">Get started</a>
        </nav>

        <div className="flex items-center gap-3 text-sm font-medium">
          <Link
            to="/login"
            className="rounded-xl border border-slate-200 px-4 py-2 text-slate-600 transition hover:border-brand-500 hover:text-brand-500 dark:border-slate-800 dark:text-slate-300"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-brand-500 px-4 py-2 text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600"
          >
            Create account
          </Link>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-100 via-white to-emerald-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900" />
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl dark:text-white"
              >
                Relationship intelligence for leaders who listen.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-6 text-lg text-slate-600 dark:text-slate-300"
              >
                Political Contact Manager brings every constituent detail—birthdays, anniversaries, family notes,
                meaningful dates—into one secure workspace so you can lead with empathy and precision.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600"
                >
                  Get started now
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-500 hover:text-brand-500 dark:border-slate-700 dark:text-slate-200"
                >
                  View live demo
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-10 grid gap-6 rounded-2xl border border-slate-200 bg-white/60 p-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/60 sm:grid-cols-3"
              >
                {stats.map((item) => (
                  <div key={item.label}>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{item.value}</p>
                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute -left-10 -top-10 hidden h-40 w-40 rounded-full bg-brand-500/30 blur-3xl lg:block" />
              <div className="absolute -bottom-16 -right-10 hidden h-40 w-40 rounded-full bg-emerald-400/40 blur-3xl lg:block" />
              <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Inside the workspace</p>
                <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Every contact, every milestone, one secure profile.
                </h3>
                <ul className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/10 text-brand-600">
                      <HiOutlineCheckCircle className="h-4 w-4" />
                    </span>
                    Detailed records for birthdays, anniversaries, family details, and community insights.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/10 text-brand-600">
                      <HiOutlineCheckCircle className="h-4 w-4" />
                    </span>
                    Automated reminders and shared agendas keep your team aligned before every outreach.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/10 text-brand-600">
                      <HiOutlineCheckCircle className="h-4 w-4" />
                    </span>
                    Expertly designed UX for mobile and desktop so you stay responsive on the go.
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Features</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Designed for modern leaders</h2>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              From onboarding to daily operations, Political Contact Manager brings clarity and confidence to your
              outreach strategy.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {featureItems.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="workflow" className="bg-white py-20 dark:bg-slate-950/40">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Workflow</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                  Get organized in three simple steps
                </h2>
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  PCM eliminates guesswork so you can focus on meaningful engagement.
                </p>
              </div>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/10 text-sm font-semibold text-brand-600">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{step.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="security" className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Security first</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
                Trusted infrastructure for sensitive relationships
              </h2>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                PCM is built with encrypted data storage, role-based access, and audit trails so you can manage
                community information with confidence.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li>• SOC 2 aligned practices and continuous monitoring</li>
                <li>• Secure REST APIs with JWT authentication and granular scopes</li>
                <li>• Region-aware infrastructure and configurable data retention</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-brand-100 via-white to-emerald-100 p-8 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Built for teams who lead with empathy
              </h3>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                From legislators to community organizers, PCM keeps your team aligned around what matters most:
                people.
              </p>

              <div className="mt-6 grid gap-4 text-sm text-slate-600 dark:text-slate-300">
                <div className="rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                  “PCM makes it effortless to coordinate outreach across our ward. We never miss milestone moments.”
                </div>
                <div className="rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                  “Our constituents feel seen, and our team finally has a single source of truth for every contact.”
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="cta" className="py-20">
          <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Ready to elevate your outreach?</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">Start your PCM workspace today</h2>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Join leaders who rely on Political Contact Manager to build deep, enduring community relationships.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600"
              >
                Create free account
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-500 hover:text-brand-500 dark:border-slate-700 dark:text-slate-200"
              >
                Explore workspace
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Political Contact Manager. Built for connection.</p>
          <div className="flex gap-4">
            <a href="mailto:hello@pcm.app" className="hover:text-brand-500">Support</a>
            <a href="#" className="hover:text-brand-500">Privacy</a>
            <a href="#" className="hover:text-brand-500">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
