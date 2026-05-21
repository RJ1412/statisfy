import React from 'react';

export default function PageHeader({ title, description }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
      <div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-3 drop-shadow-lg tracking-tight">
          {title}
        </h1>
        {description && <p className="font-body text-text-secondary text-base max-w-2xl">{description}</p>}
      </div>
    </div>
  );
}
