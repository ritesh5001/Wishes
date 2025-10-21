import PropTypes from 'prop-types';

const Loader = ({ label }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-10 text-slate-500 dark:text-slate-400">
    <span className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" aria-hidden="true" />
    <p className="text-sm font-medium">{label}...</p>
  </div>
);

Loader.propTypes = {
  label: PropTypes.string,
};

Loader.defaultProps = {
  label: 'Loading',
};

export default Loader;
