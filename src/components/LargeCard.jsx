import { ExternalLink, Globe, Trash2 } from 'lucide-react';
import TagPill from './TagPill';
import {
  CategoryBadge,
  DomainBadge,
  MediaTypeBadge,
  StatusBadge,
} from './CategoryBadge';
import { useState } from 'react';
import { getDomain, timeAgo } from '../library/utils';
import { useDispatch } from 'react-redux';
import { visitBookmark } from '../features/bookmark/bookmarkSlice';

const LargeCard = ({ bookmark, onDelete }) => {
  const {
    id,
    url,
    name,
    description,
    image,
    tags,
    createdAt,
    category,
    subType,
    domain,
    mediaType,
    status,
  } = bookmark;
  const dispatch = useDispatch();
  const [imgFailed, setImgFailed] = useState(false);
  const siteDomain = getDomain(url);
  const hasMeta = category || domain || mediaType || status;

  return (
    <article className="group flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-700/60 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl dark:hover:shadow-zinc-950/60 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div className="relative h-44 shrink-0 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 overflow-hidden">
        {image && !imgFailed ? (
          <img
            src={image}
            alt={`${name} preview`}
            // onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <Globe className="h-9 w-9 text-zinc-300 dark:text-zinc-600" />
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
              {siteDomain}
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white/40 dark:from-zinc-900/60 to-transparent" />
        <button
          onClick={() => onDelete(id)}
          aria-label="Delete bookmark"
          className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 dark:bg-zinc-800/90 text-zinc-400 dark:text-zinc-500 shadow-md opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 dark:hover:text-red-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-center gap-2">
          <img
            src={`https://www.google.com/s2/favicons?sz=32&domain=${siteDomain}`}
            alt=""
            className="h-4 w-4 rounded shrink-0"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 truncate flex-1">
            {siteDomain}
          </span>
          <span className="text-[10px] text-zinc-300 dark:text-zinc-600 shrink-0">
            {timeAgo(createdAt)}
          </span>
        </div>
        <h3 className="font-bold text-zinc-900 dark:text-zinc-50 leading-snug line-clamp-2 text-sm">
          {name}
        </h3>
        {description && (
          <p className="text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-3 flex-1">
            {description}
          </p>
        )}

        {/* Category / domain / media type / status */}
        {hasMeta && (
          <div className="flex flex-wrap items-center gap-1.5">
            <CategoryBadge category={category} subType={subType} />
            <DomainBadge domain={domain} />
            <MediaTypeBadge mediaType={mediaType} />
            <StatusBadge status={status} />
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-0.5">
            {tags.map((t) => (
              <TagPill key={t} tag={t} />
            ))}
          </div>
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 transition-all hover:border-zinc-900 hover:bg-zinc-900 hover:text-white dark:hover:border-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900"
          onClick={() => dispatch(visitBookmark(id))}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Visit Site
        </a>
      </div>
    </article>
  );
};
export default LargeCard;
