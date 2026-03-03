import {
  BookMarked,
  Link,
  Loader2,
  Plus,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import { useCallback } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBookmark } from '../features/bookmark/bookmarkSlice';
import TagPill from './TagPill';
import { SUGGESTED_TAGS } from '../library/constants';

const EMPTY_FORM = {
  url: '',
  name: '',
  description: '',
  tags: [],
  tagInput: '',
  _image: null,
};

const AddModal = ({ onClose }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [fetching, setFetching] = useState(false);
  const [fetchStatus, setFetchStatus] = useState(null);
  const [formError, setFormError] = useState('');
  const debounceRef = useRef(null);
  const dispatch = useDispatch();

  const fetchMeta = useCallback(async (rawUrl) => {
    let url = rawUrl.trim();

    if (!url || url.length < 8) return;
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

    try {
      new URL(url);
    } catch {
      return;
    }

    setFetching(true);
    setFetchStatus(null);

    try {
      const res = await fetch(
        `https://api.microlink.io?url=${encodeURIComponent(url)}`,
      );
      const json = await res.json();

      if (json.status === 'success') {
        const { title, description, image } = json.data;
        setForm((f) => ({
          ...f,
          url,
          name: title ? title : f?.name.trim() || '',
          description: description ? description : f?.description.trim() || '',
          _image: image?.url || null,
        }));
        setFetchStatus('success');
      } else {
        setFetchStatus('error');
      }
    } catch {
      setFetchStatus('error');
    } finally {
      setFetching(false);
    }
  }, []);

  function handleUrlChange(e) {
    const val = e.target.value;

    setForm((f) => ({ ...f, url: val }));
    setFetchStatus(null);

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (val.length > 8) fetchMeta(val);
    }, 900);
  }

  function handleUrlBlur() {
    clearTimeout(debounceRef.current);
    if (form.url.length > 8) fetchMeta(form.url);
  }

  function addTag(tag) {
    const clean = tag.trim();
    if (!clean || form.tags.includes(clean)) return;
    setForm((f) => ({ ...f, tags: [...f.tags, clean], tagInput: '' }));
  }

  function removeTag(tag) {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  }

  function handleTagKeyDown(e) {
    if ((e.key === 'Enter' || e.key === ',') && form.tagInput.trim()) {
      e.preventDefault();
      addTag(form.tagInput);
    }
  }

  const handleSave = () => {
    if (!form.url.trim()) return setFormError('URL is required.');
    if (!form.name.trim()) return setFormError('Name is required.');
    let finalUrl = form.url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) finalUrl = 'https://' + finalUrl;
    const bookmark = {
      url: finalUrl,
      name: form.name.trim(),
      description: form.description.trim(),
      image: form._image,
      tags: form.tags,
    };
    setForm(EMPTY_FORM);
    dispatch(createBookmark(bookmark));
    onClose();
  };

  // Shared input classes
  const inputBase =
    'w-full rounded-xl border py-2.5 text-sm outline-none transition focus:ring-2';
  const inputColors =
    'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-400 focus:ring-zinc-900/10 dark:focus:ring-zinc-400/10';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(10,10,15,0.70)',
        backdropFilter: 'blur(14px)',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 px-6 py-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-100">
              <Plus className="h-4 w-4 text-white dark:text-zinc-900" />
            </div>
            <div>
              <h2 className="font-bold text-zinc-900 dark:text-zinc-50 text-[15px]">
                Add Bookmark
              </h2>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                Paste a URL — we'll auto-fill the details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {/* URL */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-widest">
              URL <span className="text-zinc-900 dark:text-zinc-100">*</span>
            </label>
            <div className="relative">
              <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
              <input
                value={form.url}
                onChange={handleUrlChange}
                onBlur={handleUrlBlur}
                placeholder="https://example.com"
                className={`${inputBase} pl-10 pr-10 ${
                  fetchStatus === 'success'
                    ? 'bg-zinc-50 dark:bg-zinc-800/60 border-emerald-300 dark:border-emerald-600 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-emerald-100 dark:focus:ring-emerald-800/30 focus:border-emerald-400 dark:focus:border-emerald-500'
                    : fetchStatus === 'error'
                      ? 'bg-zinc-50 dark:bg-zinc-800/60 border-amber-300 dark:border-amber-600 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-amber-100 dark:focus:ring-amber-800/30 focus:border-amber-400 dark:focus:border-amber-500'
                      : inputColors
                }`}
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                {fetching && (
                  <Loader2 className="h-4 w-4 text-zinc-400 dark:text-zinc-500 animate-spin" />
                )}
                {!fetching && fetchStatus === 'success' && (
                  <Sparkles className="h-4 w-4 text-emerald-500" />
                )}
              </div>
            </div>
            {fetchStatus === 'success' && (
              <p className="mt-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                Metadata auto-filled from the site
              </p>
            )}
            {fetchStatus === 'error' && (
              <p className="mt-1.5 text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                Couldn't fetch metadata — fill in manually
              </p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-widest">
              Name <span className="text-zinc-900 dark:text-zinc-100">*</span>
            </label>
            <div className="relative">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Site name"
                className={`${inputBase} px-3.5 pr-10 ${inputColors}`}
              />
              {fetching && (
                <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-300 dark:text-zinc-600 animate-spin" />
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-widest">
              Description
            </label>
            <div className="relative">
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="What is this site about?"
                rows={3}
                className={`${inputBase} px-3.5 resize-none ${inputColors}`}
              />
              {fetching && (
                <Loader2 className="absolute right-3.5 top-3.5 h-3.5 w-3.5 text-zinc-300 dark:text-zinc-600 animate-spin" />
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-widest">
              Tags
            </label>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {form.tags.map((t) => (
                  <TagPill
                    key={t}
                    tag={t}
                    onRemove={() => removeTag(t)}
                    size="md"
                  />
                ))}
              </div>
            )}
            <div className="relative">
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
              <input
                value={form.tagInput}
                onChange={(e) => setForm({ ...form, tagInput: e.target.value })}
                onKeyDown={handleTagKeyDown}
                placeholder="Type a tag and press Enter…"
                className={`${inputBase} pl-10 pr-3.5 ${inputColors}`}
              />
            </div>
            <div className="mt-3">
              <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">
                Suggested
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_TAGS.filter((t) => !form.tags.includes(t)).map(
                  (t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => addTag(t)}
                      className="rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-1 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:text-zinc-800 dark:hover:text-zinc-200 transition"
                    >
                      + {t}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>

          {formError && (
            <p className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40 px-4 py-3 text-xs font-medium text-red-600 dark:text-red-400">
              {formError}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 px-6 py-4 shrink-0">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={fetching}
            className="flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 px-5 py-2.5 text-sm font-bold text-white dark:text-zinc-900 shadow-md hover:bg-zinc-700 dark:hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            {fetching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <BookMarked className="h-4 w-4" />
            )}
            Save Bookmark
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddModal;
