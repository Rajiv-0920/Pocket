import { useState } from 'react';
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

  const filtered = bookmarks.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      b.name.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q) ||
      b.url.toLowerCase().includes(q) ||
      b.tags.some((t) => t.toLowerCase().includes(q));
    return matchSearch && (activeTag === 'All' || b.tags.includes(activeTag));
  });

  const hasFilters = !!(search || activeTag !== 'All');

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

      {/* Filters bar */}
      {hasFilters && (
        <div className="mb-6 flex items-center gap-3">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              {filtered.length}
            </span>{' '}
            {filtered.length === 1 ? 'result' : 'results'}
            {activeTag !== 'All' && (
              <>
                {' '}
                tagged{' '}
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {activeTag}
                </span>
              </>
            )}
            {search && (
              <>
                {' '}
                for{' '}
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  "{search}"
                </span>
              </>
            )}
          </p>
          <button
            onClick={() => {
              setSearch('');
              setActiveTag('All');
            }}
            className="text-xs text-zinc-400 dark:text-zinc-500 underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-300 transition"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Bookmarks grid */}
      {filtered.length === 0 ? (
        <div className={`grid ${gridClass} transition-all duration-300`}>
          <EmptyState
            hasFilters={hasFilters}
            onAdd={() => setModalOpen(true)}
          />
        </div>
      ) : (
        <div className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
            {search
              ? `Results for "${search}"`
              : activeTag !== 'All'
                ? `Tagged "${activeTag}"`
                : 'All Bookmarks'}
          </h2>
          <div className={`grid ${gridClass} transition-all duration-300`}>
            {filtered.map(renderCard)}
          </div>
        </div>
      )}
    </main>
  );
};

export default MainContent;
