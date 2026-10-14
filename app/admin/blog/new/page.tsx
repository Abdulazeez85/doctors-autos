
import Link from "next/link";
import { requireAdmin } from "@/lib/require-admin";

import { createBlogPost } from "../actions";

export default async function NewBlogPostPage() {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-[#F7F7F3] px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/blog"
          className="text-sm font-semibold text-[#6B7280] hover:text-[#111827]"
        >
          &larr; Back to Blog Management
        </Link>

        <header className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C9A227]">
            Doctor&apos;s Autos
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#111827]">
            Create Blog Post
          </h1>
          <p className="mt-2 text-[#6B7280]">
            Write an article for your customers.
          </p>
        </header>

        <form
          action={createBlogPost}
          className="mt-8 space-y-6 rounded-xl border border-[#E8E8E2] bg-white p-6 shadow-sm sm:p-8"
        >
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-semibold text-[#111827]"
            >
              Article title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              maxLength={200}
              placeholder="e.g. 5 Things to Check Before Buying a Used Car"
              className="w-full rounded-lg border border-[#D1D5DB] px-4 py-3 text-[#111827] outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
            />
          </div>

          <div>
            <label
              htmlFor="excerpt"
              className="mb-2 block text-sm font-semibold text-[#111827]"
            >
              Short excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              maxLength={500}
              placeholder="A short introduction displayed on the blog listing."
              className="w-full rounded-lg border border-[#D1D5DB] px-4 py-3 text-[#111827] outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
            />
            <p className="mt-1 text-xs text-[#6B7280]">
              Maximum 500 characters.
            </p>
          </div>

          <div>
            <label
              htmlFor="coverImage"
              className="mb-2 block text-sm font-semibold text-[#111827]"
            >
              Cover image URL
            </label>
            <input
              id="coverImage"
              name="coverImage"
              type="url"
              placeholder="https://example.com/car-photo.jpg"
              className="w-full rounded-lg border border-[#D1D5DB] px-4 py-3 text-[#111827] outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
            />
            <p className="mt-1 text-xs text-[#6B7280]">
              Paste a publicly accessible image URL.
            </p>
          </div>

          <div>
            <label
              htmlFor="content"
              className="mb-2 block text-sm font-semibold text-[#111827]"
            >
              Article content *
            </label>
            <textarea
              id="content"
              name="content"
              rows={16}
              required
              placeholder="Write your article here..."
              className="w-full rounded-lg border border-[#D1D5DB] px-4 py-3 text-[#111827] outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
            />
            <p className="mt-1 text-xs text-[#6B7280]">
              You can write multiple paragraphs. We&apos;ll improve the article
formatting in a later step.
            </p>
          </div>

          <label className="flex items-start gap-3 rounded-lg bg-[#F7F7F3] p-4">
            <input
              type="checkbox"
              name="published"
              className="mt-1 h-4 w-4 accent-[#C9A227]"
            />
            <span>
              <span className="block text-sm font-semibold text-[#111827]">
                Publish immediately
              </span>
              <span className="mt-1 block text-sm text-[#6B7280]">
                Leave unchecked to save this article as a draft.
              </span>
            </span>
          </label>

          <div className="flex flex-col-reverse gap-3 border-t border-[#E8E8E2] pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/admin/blog"
              className="inline-flex items-center justify-center rounded-lg border border-[#D1D5DB] px-5 py-3 text-sm font-semibold text-[#111827] hover:bg-[#F7F7F3]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-[#0B1220] px-6 py-3 text-sm font-bold text-white hover:bg-[#1B2A42]"
            >
              Save Blog Post
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
