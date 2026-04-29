import React from 'react';

/**
 * A hidden input field to catch bots.
 * Real users won't see or fill this. Bots will.
 */
export const Honeypot = ({
  name = 'website_url',
  value,
  onChange,
}: {
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div style={{ display: 'none' }} aria-hidden="true">
      <label htmlFor={name}>Leave this field empty</label>
      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
};
