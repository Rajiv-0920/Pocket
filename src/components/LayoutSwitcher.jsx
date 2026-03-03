import { LayoutGrid, Grid2X2, StretchHorizontal } from 'lucide-react';

const LayoutSwitcher = ({ layout, onChange }) => {
  const options = [
    { key: 'small', icon: LayoutGrid, label: 'Small' },
    { key: 'medium', icon: Grid2X2, label: 'Medium' },
    { key: 'large', icon: StretchHorizontal, label: 'Large' },
  ];

  return (
    <div className="flex items-center gap-0.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 p-0.5">
      {options.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          aria-label={`${label} layout`}
          title={`${label} layout`}
          className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200 ${
            layout === key
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
          }`}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
};

export default LayoutSwitcher;
