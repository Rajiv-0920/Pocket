import { useState } from 'react';
import { getDomain, getTagStyle } from '../library/utils';
import { Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { visitBookmark } from '../features/bookmark/bookmarkSlice';

const SmallCard = ({ bookmark, onDelete }) => {
  const { id, url, name, tags, createdAt, lastVisited } = bookmark;
  const dispatch = useDispatch();
  const domain = getDomain(url);
  const [hovered, setHovered] = useState(false);

  const timeAgo = (timestamp) => {
    if (!timestamp) return null;
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    return `${days}d ago`;
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => dispatch(visitBookmark(id))}
      className="group relative flex flex-col items-center gap-2 py-3 px-1 cursor-pointer"
      title={name}
    >
      {/* Delete button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(id);
        }}
        aria-label="Delete bookmark"
        className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-500 dark:hover:text-red-400 z-10"
      >
        <Trash2 className="h-2.5 w-2.5" />
      </button>

      {/* Favicon Icon Box */}
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center group-hover:border-zinc-400 dark:group-hover:border-zinc-500 group-hover:scale-110 transition-all duration-200 overflow-hidden shadow-sm">
          <img
            src={`https://www.google.com/s2/favicons?sz=64&domain=${domain}`}
            alt=""
            className="w-6 h-6"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Green dot if recently visited */}
        {lastVisited && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-zinc-900" />
        )}
      </div>

      {/* Name */}
      <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 text-center truncate w-full leading-tight group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition">
        {name}
      </span>

      {/* Time ago */}
      {lastVisited && (
        <span className="text-[10px] text-zinc-400 dark:text-zinc-600 -mt-1">
          {timeAgo(lastVisited)}
        </span>
      )}
    </a>
  );
};

export default SmallCard;
