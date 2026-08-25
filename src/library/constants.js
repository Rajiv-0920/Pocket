export const STORAGE_KEY = 'smart-bookmarks-v1';
export const THEME_KEY = 'shelf-theme';
export const LAYOUT_KEY = 'shelf-layout';

export const SUGGESTED_TAGS = [
  'Tech',
  'Design',
  'Useful',
  'Social',
  'News',
  'Research',
  'Inspiration',
  'Dev',
];

export const TAG_PALETTE = {
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

export const DEFAULT_TAG_STYLE = {
  bg: 'bg-zinc-100 dark:bg-zinc-700/50',
  text: 'text-zinc-700 dark:text-zinc-300',
  dot: 'bg-zinc-400',
};

// --- Category system ---
// Top-level: what kind of thing this bookmark is.
export const CATEGORIES = ['Learning', 'Tool', 'Other'];

export const CATEGORY_PALETTE = {
  Learning: {
    bg: 'bg-indigo-100 dark:bg-indigo-900/40',
    text: 'text-indigo-700 dark:text-indigo-300',
    dot: 'bg-indigo-400',
  },
  Tool: {
    bg: 'bg-teal-100 dark:bg-teal-900/40',
    text: 'text-teal-700 dark:text-teal-300',
    dot: 'bg-teal-400',
  },
  Other: {
    bg: 'bg-zinc-200 dark:bg-zinc-700/60',
    text: 'text-zinc-700 dark:text-zinc-300',
    dot: 'bg-zinc-400',
  },
};

// --- Tool sub-axes (Option B: two independent fields) ---
// Domain = the field/discipline the tool serves. Primary axis.
export const TOOL_DOMAINS = [
  'OSINT',
  'Cybersecurity',
  'Web Development',
  'Video Editing',
  'Design',
  'Productivity',
  'AI / ML',
  'General',
];

export const DOMAIN_PALETTE = {
  OSINT: {
    bg: 'bg-rose-100 dark:bg-rose-900/40',
    text: 'text-rose-700 dark:text-rose-300',
    dot: 'bg-rose-400',
  },
  Cybersecurity: {
    bg: 'bg-red-100 dark:bg-red-900/40',
    text: 'text-red-700 dark:text-red-300',
    dot: 'bg-red-500',
  },
  'Web Development': {
    bg: 'bg-sky-100 dark:bg-sky-900/40',
    text: 'text-sky-700 dark:text-sky-300',
    dot: 'bg-sky-400',
  },
  'Video Editing': {
    bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/40',
    text: 'text-fuchsia-700 dark:text-fuchsia-300',
    dot: 'bg-fuchsia-400',
  },
  Design: {
    bg: 'bg-pink-100 dark:bg-pink-900/40',
    text: 'text-pink-700 dark:text-pink-300',
    dot: 'bg-pink-400',
  },
  Productivity: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-400',
  },
  'AI / ML': {
    bg: 'bg-violet-100 dark:bg-violet-900/40',
    text: 'text-violet-700 dark:text-violet-300',
    dot: 'bg-violet-400',
  },
  General: {
    bg: 'bg-zinc-100 dark:bg-zinc-700/50',
    text: 'text-zinc-700 dark:text-zinc-300',
    dot: 'bg-zinc-400',
  },
};

// Media type = what kind of asset/content the tool works with. Secondary, optional axis.
export const TOOL_MEDIA_TYPES = ['Image', 'Audio', 'Video', 'PDF', 'Code'];

// --- Other category sub-type (single axis — unchanged) ---
export const OTHER_SUBTYPES = ['Article', 'Inspiration', 'Shopping', 'Misc'];

// --- Status (workflow tracking) ---
export const LEARNING_STATUS = ['Not Started', 'In Progress', 'Completed'];
export const ARTICLE_STATUS = ['Unread', 'Read'];
