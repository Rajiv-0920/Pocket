import { BookMarked, Plus, Search } from 'lucide-react';

const EmptyState = ({ hasFilters, onAdd }) => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-28 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
        {hasFilters ? (
          <Search className="h-7 w-7 text-zinc-400 dark:text-zinc-500" />
        ) : (
          <BookMarked className="h-7 w-7 text-zinc-400 dark:text-zinc-500" />
        )}
      </div>
      <h3 className="font-bold text-zinc-800 dark:text-zinc-200 text-base mb-1.5">
        {hasFilters ? 'No matching bookmarks' : 'Your shelf is empty'}
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed">
        {hasFilters
          ? 'Try a different search term or clear your filters.'
          : 'Add your first bookmark to start building your personal web library.'}
      </p>
      {!hasFilters && (
        <button
          onClick={onAdd}
          className="mt-6 flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 px-5 py-2.5 text-sm font-bold text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-white transition"
        >
          <Plus className="h-4 w-4" /> Add First Bookmark
        </button>
      )}
    </div>
  );
};

export default EmptyState;
