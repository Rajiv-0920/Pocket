import { X } from 'lucide-react';

const TAG_PALETTE = {
  Tech: {
    bg: 'bg-blue-100 dark:bg-blue-900/40',
    text: 'text-blue-700 dark:text-blue-300',
    dot: 'bg-blue-400',
  },
  Design: {
    bg: 'bg-pink-100 dark:bg-pink-900/40',
    text: 'text-pink-700 dark:text-pink-300',
    dot: 'bg-pink-400',
  },
  Useful: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-400',
  },
  Social: {
    bg: 'bg-violet-100 dark:bg-violet-900/40',
    text: 'text-violet-700 dark:text-violet-300',
    dot: 'bg-violet-400',
  },
  News: {
    bg: 'bg-amber-100 dark:bg-amber-900/40',
    text: 'text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-400',
  },
  Research: {
    bg: 'bg-cyan-100 dark:bg-cyan-900/40',
    text: 'text-cyan-700 dark:text-cyan-300',
    dot: 'bg-cyan-400',
  },
  Inspiration: {
    bg: 'bg-orange-100 dark:bg-orange-900/40',
    text: 'text-orange-700 dark:text-orange-300',
    dot: 'bg-orange-400',
  },
  Dev: {
    bg: 'bg-slate-200 dark:bg-slate-700/60',
    text: 'text-slate-700 dark:text-slate-300',
    dot: 'bg-slate-500',
  },
};

const DEFAULT_TAG_STYLE = {
  bg: 'bg-zinc-100 dark:bg-zinc-700/50',
  text: 'text-zinc-700 dark:text-zinc-300',
  dot: 'bg-zinc-400',
};

const getTagStyle = (tag) => {
  return TAG_PALETTE[tag] || DEFAULT_TAG_STYLE;
};

const TagPill = ({ tag, onRemove, size = 'sm' }) => {
  const s = getTagStyle(tag);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium transition-colors ${s.bg} ${s.text} ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${s.dot}`} />
      {tag}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 hover:opacity-60 transition-opacity"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      )}
    </span>
  );
};

export default TagPill;
