import React, { useState } from 'react';
import PropTypes from 'prop-types';

const BrandLogo = ({ size, showText, textClassName }) => {
  const [imgOk, setImgOk] = useState(true);

  return (
    <div className="flex items-center gap-2">
      {imgOk ? (
        <img
          src="/logo.png"
          alt="Smaran"
          width={size}
          height={size}
          className="block object-contain"
          onError={() => setImgOk(false)}
        />
      ) : (
        <span
          className="flex items-center justify-center rounded-full bg-brand-500 text-white font-semibold"
          style={{ width: size, height: size, fontSize: Math.max(10, Math.floor(size * 0.45)) }}
        >
          Sm
        </span>
      )}
      {showText ? (
        <span className={textClassName}>Smaran</span>
      ) : null}
    </div>
  );
};

BrandLogo.propTypes = {
  size: PropTypes.number,
  showText: PropTypes.bool,
  textClassName: PropTypes.string,
};

BrandLogo.defaultProps = {
  size: 40,
  showText: false,
  textClassName: 'text-base font-semibold text-slate-800 dark:text-slate-100',
};

export default BrandLogo;
