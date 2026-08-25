import {
  CATEGORY_PALETTE,
  DOMAIN_PALETTE,
  DEFAULT_TAG_STYLE,
} from '../library/constants';

// Top-level category pill, e.g. "Tool", optionally with Other's subType: "Other · Article"
export const CategoryBadge = ({ category, subType, size = 'sm' }) => {
  if (!category) return null;
  const s = CATEGORY_PALETTE[category] || DEFAULT_TAG_STYLE;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium transition-colors ${s.bg} ${s.text} ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${s.dot}`} />
      {category}
      {subType && <span className="opacity-70">· {subType}</span>}
    </span>
  );
};

// Tool domain pill, e.g. "OSINT", "Web Development"
export const DomainBadge = ({ domain, size = 'sm' }) => {
  if (!domain) return null;
  const s = DOMAIN_PALETTE[domain] || DEFAULT_TAG_STYLE;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium transition-colors ${s.bg} ${s.text} ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${s.dot}`} />
      {domain}
    </span>
  );
};

// Tool media-type pill, e.g. "Video" — plain outlined, since it's a secondary attribute
export const MediaTypeBadge = ({ mediaType, size = 'sm' }) => {
  if (!mediaType) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-700 font-medium text-zinc-500 dark:text-zinc-400 ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      {mediaType}
    </span>
  );
};

// Status pill, e.g. "In Progress"
export const StatusBadge = ({ status, size = 'sm' }) => {
  if (!status) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-700 font-medium text-zinc-500 dark:text-zinc-400 ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      {status}
    </span>
  );
};
