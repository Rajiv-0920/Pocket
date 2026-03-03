import { Bookmark, Filter, Plus, Search, X } from 'lucide-react';
import { useRef } from 'react';
import { useState } from 'react';
import { HotkeysProvider, useHotkeys } from 'react-hotkeys-hook';
import ThemeToggle from './ThemeToggle';
import LayoutSwitcher from './LayoutSwitcher';
import { useSelector } from 'react-redux';

const Header = ({
  onModalOpen,
  setLayout,
  layout,
  setActiveTag,
  activeTag,
  search,
  setSearch,
}) => {
  const { bookmarks } = useSelector((state) => state.bookmark);
  const inputRef = useRef(null);

  const handleToggle = (e) => {
    e.preventDefault();
    if (document.activeElement === inputRef.current) {
      inputRef.current.blur();
    } else {
      inputRef.current.focus();
      inputRef.current.select();
    }
  };

  useHotkeys(['ctrl+k', 'meta+k'], handleToggle, {
    scope: ['search'],
    enableOnFormTags: true,
    preventDefault: true,
  });

  const allTags = [
    'All',
    ...Array.from(new Set(bookmarks.flatMap((b) => b.tags))).sort(),
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-5">
        {/* Top bar*/}
        <div className="flex items-center gap-3 py-3.5">
          {/* Wordmark*/}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100 shadow-sm transition-colors duration-300">
              <Bookmark className="h-4 w-4 text-white dark:text-zinc-900" />
            </div>
            <div className="hidden sm:flex items-baseline gap-2">
              <span className="font-bold text-zinc-900 dark:text-zinc-50 text-[15px] tracking-tight">
                Pocket
              </span>
              <span className="rounded-lg bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide transition-colors">
                {bookmarks.length}
              </span>
            </div>
          </div>
          {/* Search*/}
          <div className="relative flex-1 max-w-md mx-auto">
            <HotkeysProvider initiallyActiveScopes={['search']}>
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 py-2.5 pl-10 pr-9 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none focus:border-zinc-900 dark:focus:border-zinc-400 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-400/10 transition"
                placeholder="Search by name, URL, or tag…"
              />
              {!search && (
                <div className="hidden absolute right-3 top-1/2 -translate-y-1/2 sm:flex items-center gap-1 pointer-events-none select-none">
                  <kbd className="inline-flex h-5 items-center gap-1 rounded border border-zinc-200 bg-white px-2 font-sans text-[10px] font-medium text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500 shadow-md">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>
              )}
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 transition"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </HotkeysProvider>
          </div>

          {/* Right controls*/}
          <div className="flex items-center gap-2  shirk-0">
            <LayoutSwitcher layout={layout} onChange={setLayout} />
            <ThemeToggle />
            <button
              onClick={() => onModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 px-4 py-2 text-sm font-bold text-white dark:text-zinc-900 shadow-sm hover:bg-zinc-700 dark:hover:bg-white transition-all active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Site</span>
            </button>
          </div>
        </div>

        {/* Tag filter row */}
        <div className="flex items-center gap-2 pb-3 overflow-x-auto no-scrollbar">
          <Filter className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeTag === tag
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              {tag}
              {tag !== 'All' && (
                <span className="ml-1.5 font-medium opacity-60">
                  {bookmarks.filter((b) => b.tags.includes(tag)).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
