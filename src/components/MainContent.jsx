import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpDown, Check, SlidersHorizontal, X } from 'lucide-react';
import EmptyState from './EmptyState';
import { useDispatch, useSelector } from 'react-redux';
import LargeCard from './LargeCard';
import MediumCard from './MediumCard';
import SmallCard from './SmallCard';
import {
  deleteBookmark,
  visitBookmark,
  selectRecentVisits,
} from '../features/bookmark/bookmarkSlice';
import {
  CATEGORIES,
  TOOL_DOMAINS,
  TOOL_MEDIA_TYPES,
  OTHER_SUBTYPES,
  LEARNING_STATUS,
  ARTICLE_STATUS,
  CATEGORY_PALETTE,
  DOMAIN_PALETTE,
} from '../library/constants';

function getStatusOptions(category, subType) {
  if (category === 'Learning') return LEARNING_STATUS;
  if (category === 'Other' && subType === 'Article') return ARTICLE_STATUS;
  return [];
}

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
  { id: 'name-asc', label: 'Name (A–Z)' },
  { id: 'name-desc', label: 'Name (Z–A)' },
  { id: 'most-visited', label: 'Most visited' },
  { id: 'recently-visited', label: 'Recently visited' },
];

function sortBookmarks(list, sortId) {
  const arr = [...list];
  switch (sortId) {
    case 'oldest':
      return arr.sort((a, b) => a.createdAt - b.createdAt);
    case 'name-asc':
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return arr.sort((a, b) => b.name.localeCompare(a.name));
    case 'most-visited':
      return arr.sort((a, b) => (b.visitCount || 0) - (a.visitCount || 0));
    case 'recently-visited':
      // Bookmarks never visited (lastVisited === null) sink to the bottom
      return arr.sort((a, b) => {
        if (!a.lastVisited && !b.lastVisited) return 0;
        if (!a.lastVisited) return 1;
        if (!b.lastVisited) return -1;
        return b.lastVisited - a.lastVisited;
      });
    case 'newest':
    default:
      return arr.sort((a, b) => b.createdAt - a.createdAt);
  }
}

const MainContent = ({
  activeTag,
  layout,
  setActiveTag,
  setModalOpen,
  search,
  setSearch,
}) => {
  const { bookmarks } = useSelector((state) => state.bookmark);
  const recentVisits = useSelector(selectRecentVisits);
  const dispatch = useDispatch();

  const [panelOpen, setPanelOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');
  const [activeSubType, setActiveSubType] = useState(''); // 'Other' only
  const [activeDomain, setActiveDomain] = useState(''); // 'Tool' only
  const [activeMediaType, setActiveMediaType] = useState(''); // 'Tool' only, independent of domain
  const [activeStatus, setActiveStatus] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statusOptions = getStatusOptions(activeCategory, activeSubType);

  function selectCategory(cat) {
    const next = activeCategory === cat ? '' : cat;
    setActiveCategory(next);
    setActiveSubType('');
    setActiveDomain('');
    setActiveMediaType('');
    setActiveStatus('');
  }

  function selectSubType(sub) {
    setActiveSubType(activeSubType === sub ? '' : sub);
    setActiveStatus('');
  }

  function selectDomain(d) {
    setActiveDomain(activeDomain === d ? '' : d);
  }

  function selectMediaType(m) {
    setActiveMediaType(activeMediaType === m ? '' : m);
  }

  function selectStatus(st) {
    setActiveStatus(activeStatus === st ? '' : st);
  }

  function clearAllFilters() {
    setSearch('');
    setActiveTag('All');
    setActiveCategory('');
    setActiveSubType('');
    setActiveDomain('');
    setActiveMediaType('');
    setActiveStatus('');
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return bookmarks.filter((b) => {
      const matchSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.description?.toLowerCase().includes(q) ||
        b.url.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q));

      const matchTag = activeTag === 'All' || b.tags.includes(activeTag);
      const matchCategory = !activeCategory || b.category === activeCategory;
      const matchSubType = !activeSubType || b.subType === activeSubType;
      const matchDomain = !activeDomain || b.domain === activeDomain;
      const matchMediaType =
        !activeMediaType || b.mediaType === activeMediaType;
      const matchStatus = !activeStatus || b.status === activeStatus;

      return (
        matchSearch &&
        matchTag &&
        matchCategory &&
        matchSubType &&
        matchDomain &&
        matchMediaType &&
        matchStatus
      );
    });
  }, [
    bookmarks,
    search,
    activeTag,
    activeCategory,
    activeSubType,
    activeDomain,
    activeMediaType,
    activeStatus,
  ]);

  const sorted = useMemo(
    () => sortBookmarks(filtered, sortBy),
    [filtered, sortBy],
  );

  const activeFilterCount = [
    search,
    activeTag !== 'All' ? activeTag : '',
    activeCategory,
    activeSubType,
    activeDomain,
    activeMediaType,
    activeStatus,
  ].filter(Boolean).length;

  const hasFilters = activeFilterCount > 0;

  const gridClass = {
    small: 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2',
    medium: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3',
    large: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5',
  }[layout];

  const timeAgo = (timestamp) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    return `${days}d ago`;
  };

  const renderCard = (b) => {
    const onDelete = () => dispatch(deleteBookmark(b));
    if (layout === 'small')
      return <SmallCard key={b.id} bookmark={b} onDelete={onDelete} />;
    if (layout === 'medium')
      return <MediumCard key={b.id} bookmark={b} onDelete={onDelete} />;
    return <LargeCard key={b.id} bookmark={b} onDelete={onDelete} />;
  };

  const pillBase =
    'rounded-full border px-3 py-1.5 text-[11px] font-semibold transition';
  const pillInactive =
    'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-500';

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      {recentVisits.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
            Recently Visited
          </h2>

          <div className="flex gap-3 overflow-x-auto py-1 scrollbar-hide">
            {recentVisits.map((b, index) => (
              <a
                key={b.id}
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => dispatch(visitBookmark(b.id))}
                className="flex flex-col items-center gap-2 min-w-[72px] max-w-[72px] group cursor-pointer"
              >
                {/* Favicon Circle with index badge */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center group-hover:border-zinc-400 dark:group-hover:border-zinc-500 group-hover:scale-105 transition-all duration-200 overflow-hidden">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${b.url}&sz=64`}
                      alt={b.name}
                      className="w-6 h-6"
                    />
                  </div>
                  {/* Recency badge — only on the most recent */}
                  {index === 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-zinc-900" />
                  )}
                </div>

                {/* Name */}
                <span className="text-[11px] text-zinc-600 dark:text-zinc-400 text-center truncate w-full group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition leading-tight">
                  {b.name}
                </span>

                {/* Time ago */}
                <span className="text-[10px] text-zinc-400 dark:text-zinc-600 -mt-1">
                  {timeAgo(b.lastVisited)}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Smart filter toggle + results row */}
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => setPanelOpen((v) => !v)}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
            panelOpen || hasFilters
              ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
              : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-500'
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-0.5 rounded-full bg-white/20 dark:bg-black/10 px-1.5 py-0.5 text-[10px]">
              {activeFilterCount}
            </span>
          )}
        </button>

        {hasFilters && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              {sorted.length}
            </span>{' '}
            {sorted.length === 1 ? 'result' : 'results'}
          </p>
        )}

        {/* Sort dropdown */}
        <div className="relative ml-auto" ref={sortRef}>
          <button
            onClick={() => setSortOpen((v) => !v)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
              sortOpen
                ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-500'
            }`}
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            {SORT_OPTIONS.find((o) => o.id === sortBy)?.label}
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg py-1.5 z-20">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSortBy(opt.id);
                    setSortOpen(false);
                  }}
                  className="w-full flex items-center justify-between gap-2 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition text-left"
                >
                  {opt.label}
                  {sortBy === opt.id && (
                    <Check className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {hasFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-zinc-400 dark:text-zinc-500 underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-300 transition"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Smart filter panel */}
      {panelOpen && (
        <div className="mb-6 rounded-2xl border border-zinc-200 dark:border-zinc-700/60 bg-white dark:bg-zinc-900 p-4 space-y-4">
          {/* Category */}
          <div>
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-widest">
              Category
            </p>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => {
                const palette = CATEGORY_PALETTE[cat];
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => selectCategory(cat)}
                    className={`${pillBase} flex items-center gap-1.5 ${
                      isActive
                        ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                        : pillInactive
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full shrink-0 ${palette.dot}`}
                    />
                    {cat}
                    <span className="opacity-60">
                      {bookmarks.filter((b) => b.category === cat).length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tool: Domain — independent axis */}
          {activeCategory === 'Tool' && (
            <div>
              <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-widest">
                Domain
              </p>
              <div className="flex flex-wrap gap-1.5">
                {TOOL_DOMAINS.map((d) => {
                  const palette = DOMAIN_PALETTE[d];
                  const isActive = activeDomain === d;
                  const count = bookmarks.filter(
                    (b) => b.category === 'Tool' && b.domain === d,
                  ).length;
                  return (
                    <button
                      key={d}
                      onClick={() => selectDomain(d)}
                      className={`${pillBase} flex items-center gap-1.5 ${
                        isActive
                          ? 'border-teal-500 bg-teal-500 text-white'
                          : pillInactive
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full shrink-0 ${palette.dot}`}
                      />
                      {d}
                      <span className="opacity-60">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tool: Media Type — independent axis, combines with Domain via AND */}
          {activeCategory === 'Tool' && (
            <div>
              <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-widest">
                Media Type
              </p>
              <div className="flex flex-wrap gap-1.5">
                {TOOL_MEDIA_TYPES.map((m) => (
                  <button
                    key={m}
                    onClick={() => selectMediaType(m)}
                    className={`${pillBase} ${
                      activeMediaType === m
                        ? 'border-cyan-500 bg-cyan-500 text-white'
                        : pillInactive
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Other: Sub-type */}
          {activeCategory === 'Other' && (
            <div>
              <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-widest">
                Type of Item
              </p>
              <div className="flex flex-wrap gap-1.5">
                {OTHER_SUBTYPES.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => selectSubType(sub)}
                    className={`${pillBase} ${
                      activeSubType === sub
                        ? 'border-teal-500 bg-teal-500 text-white'
                        : pillInactive
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Status — only when relevant */}
          {statusOptions.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-widest">
                Status
              </p>
              <div className="flex flex-wrap gap-1.5">
                {statusOptions.map((st) => (
                  <button
                    key={st}
                    onClick={() => selectStatus(st)}
                    className={`${pillBase} ${
                      activeStatus === st
                        ? 'border-indigo-500 bg-indigo-500 text-white'
                        : pillInactive
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active filter chips (visible even when panel is collapsed) */}
      {hasFilters && (
        <div className="mb-6 flex flex-wrap items-center gap-1.5">
          {search && (
            <FilterChip label={`"${search}"`} onClear={() => setSearch('')} />
          )}
          {activeTag !== 'All' && (
            <FilterChip
              label={`Tag: ${activeTag}`}
              onClear={() => setActiveTag('All')}
            />
          )}
          {activeCategory && (
            <FilterChip
              label={activeCategory}
              onClear={() => selectCategory(activeCategory)}
            />
          )}
          {activeSubType && (
            <FilterChip
              label={activeSubType}
              onClear={() => selectSubType(activeSubType)}
            />
          )}
          {activeDomain && (
            <FilterChip
              label={activeDomain}
              onClear={() => selectDomain(activeDomain)}
            />
          )}
          {activeMediaType && (
            <FilterChip
              label={activeMediaType}
              onClear={() => selectMediaType(activeMediaType)}
            />
          )}
          {activeStatus && (
            <FilterChip
              label={activeStatus}
              onClear={() => selectStatus(activeStatus)}
            />
          )}
        </div>
      )}

      {/* Bookmarks grid */}
      {sorted.length === 0 ? (
        <div className={`grid ${gridClass} transition-all duration-300`}>
          <EmptyState
            hasFilters={hasFilters}
            onAdd={() => setModalOpen(true)}
          />
        </div>
      ) : (
        <div className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
            {hasFilters ? 'Filtered Results' : 'All Bookmarks'}
          </h2>
          <div className={`grid ${gridClass} transition-all duration-300`}>
            {sorted.map(renderCard)}
          </div>
        </div>
      )}
    </main>
  );
};

const FilterChip = ({ label, onClear }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">
    {label}
    <button
      onClick={onClear}
      className="hover:opacity-60 transition-opacity"
      aria-label={`Remove ${label} filter`}
    >
      <X className="h-2.5 w-2.5" />
    </button>
  </span>
);

export default MainContent;
