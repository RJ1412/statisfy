import React from 'react';
import useTimeRange from '../../hooks/useTimeRange';

export default function TimeRangePicker() {
  const { timeRange, setTimeRange } = useTimeRange();

  const options = [
    { value: 'short_term', label: '4W' },
    { value: 'medium_term', label: '6M' },
    { value: 'long_term', label: 'ALL' }
  ];

  return (
    <div className="flex bg-void border border-border rounded-pill p-[3px] gap-[2px]">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setTimeRange(opt.value)}
          className={`flex-1 py-[7px] px-3 border-none rounded-pill font-body text-[13px] font-semibold transition-all duration-base ease-out ${
            timeRange === opt.value
              ? 'bg-elevated text-text-primary shadow-[0_1px_4px_rgba(0,0,0,0.4)] scale-100'
              : 'bg-transparent text-text-secondary hover:bg-glass hover:text-text-primary scale-95'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
