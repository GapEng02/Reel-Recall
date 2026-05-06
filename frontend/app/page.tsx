"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";

type Reel = {
  id: string;
  url: string;
  title: string;
  username: string;
  description: string;
  tags: string;
};

const STORAGE_KEY = "reel-recall:saved-reels";

const initialFormState = {
  url: "",
  title: "",
  username: "",
  description: "",
  tags: "",
};

export default function Home() {
  const [reels, setReels] = useState<Reel[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const savedReels = window.localStorage.getItem(STORAGE_KEY);

    if (!savedReels) {
      return [];
    }

    try {
      return JSON.parse(savedReels) as Reel[];
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  });
  const [form, setForm] = useState(initialFormState);
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reels));
  }, [reels]);

  const filteredReels = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return reels;
    }

    return reels.filter((reel) =>
      [reel.title, reel.username, reel.description, reel.tags]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [reels, search]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextReel: Reel = {
      id: crypto.randomUUID(),
      url: form.url.trim(),
      title: form.title.trim(),
      username: form.username.trim(),
      description: form.description.trim(),
      tags: form.tags.trim(),
    };

    setReels((currentReels) => [nextReel, ...currentReels]);
    setForm(initialFormState);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl shadow-black/20 backdrop-blur">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-pink-300">
            Personal reel library
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Reel Recall
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            AI-powered memory search for saved Instagram Reels
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-white/10 bg-white p-6 text-slate-950 shadow-xl shadow-black/10"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-semibold tracking-tight">
                Save a reel
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Add the details you remember now so you can find it later.
              </p>
            </div>

            <div className="grid gap-4">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Reel URL
                <input
                  required
                  type="url"
                  value={form.url}
                  onChange={(event) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      url: event.target.value,
                    }))
                  }
                  placeholder="https://www.instagram.com/reel/..."
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-100"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Title
                  <input
                    required
                    type="text"
                    value={form.title}
                    onChange={(event) =>
                      setForm((currentForm) => ({
                        ...currentForm,
                        title: event.target.value,
                      }))
                    }
                    placeholder="Dinner idea"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-100"
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Username
                  <input
                    required
                    type="text"
                    value={form.username}
                    onChange={(event) =>
                      setForm((currentForm) => ({
                        ...currentForm,
                        username: event.target.value,
                      }))
                    }
                    placeholder="@creator"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-100"
                  />
                </label>
              </div>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Description
                <textarea
                  required
                  value={form.description}
                  onChange={(event) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      description: event.target.value,
                    }))
                  }
                  placeholder="What made this reel worth saving?"
                  rows={4}
                  className="resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-100"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Tags
                <input
                  type="text"
                  value={form.tags}
                  onChange={(event) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      tags: event.target.value,
                    }))
                  }
                  placeholder="recipes, travel, workouts"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-100"
                />
              </label>

              <button
                type="submit"
                className="mt-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-pink-200"
              >
                Save reel
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  Saved reels
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  {reels.length} {reels.length === 1 ? "reel" : "reels"} saved
                </p>
              </div>

              <label className="grid gap-2 text-sm font-medium text-slate-300 sm:min-w-72">
                Search
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search title, username, description, or tags"
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-pink-300 focus:ring-4 focus:ring-pink-300/10"
                />
              </label>
            </div>

            <div className="grid gap-4">
              {filteredReels.length > 0 ? (
                filteredReels.map((reel) => (
                  <article
                    key={reel.id}
                    className="rounded-3xl border border-white/10 bg-white p-5 text-slate-950 shadow-xl shadow-black/10"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-xl font-semibold tracking-tight">
                          {reel.title}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-pink-600">
                          {reel.username}
                        </p>
                      </div>
                      <a
                        href={reel.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-700"
                      >
                        Open reel
                      </a>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {reel.description}
                    </p>

                    {reel.tags && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {reel.tags
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean)
                          .map((tag, index) => (
                            <span
                              key={`${reel.id}-${tag}-${index}`}
                              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    )}
                  </article>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-white/15 p-8 text-center text-slate-400">
                  {reels.length === 0
                    ? "No reels saved yet. Add your first one to build your recall library."
                    : "No reels match your search."}
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
