import { useState } from 'react';
import { getDomain, timeAgo } from '../library/utils';
import { ExternalLink, Globe, Trash2 } from 'lucide-react';
import { CategoryBadge, DomainBadge } from './CategoryBadge';
import { useDispatch } from 'react-redux';
import { visitBookmark } from '../features/bookmark/bookmarkSlice';

const MediumCard = ({ bookmark, onDelete }) => {
  const { id, url, name, image, tags, createdAt, category, subType, domain } =
    bookmark;
  const dispatch = useDispatch();
  const [imgFailed, setImgFailed] = useState(false);
  const siteDomain = getDomain(url);
  // Prefer showing the Tool domain badge (e.g. "OSINT") when present, otherwise fall back to category
  const showDomain = category === 'Tool' && domain;

  return (
    <article className="group flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-700/60 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl dark:hover:shadow-zinc-950/60 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Image */}
      <div className="relative h-28 shrink-0 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 overflow-hidden">
        {image && !imgFailed ? (
          <img
            src={image}
            alt={`${name} preview`}
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5">
            <Globe className="h-7 w-7 text-zinc-300 dark:text-zinc-600" />
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
              {siteDomain}
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/50 dark:from-zinc-900/70 to-transparent" />
        {category && (
          <div className="absolute left-2 top-2">
            {showDomain ? (
              <DomainBadge domain={domain} size="sm" />
            ) : (
              <CategoryBadge category={category} subType={subType} size="sm" />
            )}
          </div>
        )}
        <button
          onClick={() => onDelete(id)}
          aria-label="Delete bookmark"
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 dark:bg-zinc-800/90 text-zinc-400 shadow-md opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 dark:hover:text-red-400"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        {/* Favicon + domain */}
        <div className="flex items-center gap-1.5">
          <img
            src={`https://www.google.com/s2/favicons?sz=32&domain=${siteDomain}`}
            alt=""
            className="h-3.5 w-3.5 rounded shrink-0"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 truncate flex-1">
            {siteDomain}
          </span>
          <span className="text-[9px] text-zinc-300 dark:text-zinc-600 shrink-0">
            {timeAgo(createdAt)}
          </span>
        </div>
        {/* Name */}
        <h3 className="font-bold text-zinc-900 dark:text-zinc-50 leading-snug line-clamp-2 text-xs">
          {name}
        </h3>
        {/* Visit button */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex items-center justify-center gap-1 rounded-lg border border-zinc-200 dark:border-zinc-700 py-1.5 text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 transition-all hover:border-zinc-900 hover:bg-zinc-900 hover:text-white dark:hover:border-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900"
          onClick={() => dispatch(visitBookmark(id))}
        >
          <ExternalLink className="h-3 w-3" />
          Visit
        </a>
      </div>
    </article>
  );
};
export default MediumCard;
