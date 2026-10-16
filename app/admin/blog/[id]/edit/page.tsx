import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { updateBlogPost } from "../../actions";

type EditBlogPostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBlogPostPage({
  params,
}: EditBlogPostPageProps) {
  await requireAdmin();

  const { id } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

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
            Doctors Autos
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#111827]">
            Edit Blog Post
          </h1>
          <p className="mt-2 text-[#6B7280]">
            Update your article and save your changes.
          </p>
        </header>

        <form
          action={updateBlogPost}
          className="mt-8 space-y-6 rounded-xl border border-[#E8E8E2] bg-white p-6 shadow-sm sm:p-8"
        >
          <input type="hidden" name="id" value={post.id} />

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
              defaultValue={post.title}
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
              defaultValue={post.excerpt ?? ""}
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
              defaultValue={post.coverImage ?? ""}
              placeholder="https://example.com/car-photo.jpg"
              className="w-full rounded-lg border border-[#D1D5DB] px-4 py-3 text-[#111827] outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
            />
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
              defaultValue={post.content}
              className="w-full rounded-lg border border-[#D1D5DB] px-4 py-3 text-[#111827] outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
            />
            <p className="mt-1 text-xs text-[#6B7280]">
              Separate paragraphs with blank lines.
            </p>
          </div>

          <div className="rounded-lg bg-[#F7F7F3] p-4">
            <p className="text-sm font-semibold text-[#111827]">
              Publication status
            </p>
            <p className="mt-1 text-sm text-[#6B7280]">
              This post is currently{" "}
              <strong>{post.published ? "Published" : "a Draft"}</strong>.
              Editing it will not change its publication status.
            </p>
          </div>

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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}