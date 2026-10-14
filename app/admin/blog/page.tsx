
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { deleteBlogPost, toggleBlogPost } from "./actions";

export default async function AdminBlogPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: { updatedAt: "desc" },
  });

  const totalPublished = posts.filter((post) => post.published).length;

  return (
    <main className="min-h-screen bg-[#F7F7F3] px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C9A227]">
              Doctor&apos;s Autos
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#111827]">
              Blog Management
            </h1>
            <p className="mt-2 text-[#6B7280]">
              Create and manage articles for your customers.
            </p>
          </div>

          <Link
            href="/admin/blog/new"
            className="inline-flex items-center justify-center rounded-lg bg-[#0B1220] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1B2A42]"
          >
            + Create Blog Post
          </Link>
        </header>

        <nav
          aria-label="Admin navigation"
          className="mt-8 flex flex-wrap gap-3 border-b border-[#E8E8E2] pb-6"
        >
          <Link
            href="/admin/dashboard"
            className="rounded-lg border border-[#E8E8E2] bg-white px-4 py-2.5 text-sm font-semibold text-[#111827] hover:border-[#C9A227]"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/vehicles"
            className="rounded-lg border border-[#E8E8E2] bg-white px-4 py-2.5 text-sm font-semibold text-[#111827] hover:border-[#C9A227]"
          >
            Vehicles
          </Link>
          <Link
            href="/admin/reviews"
            className="rounded-lg border border-[#E8E8E2] bg-white px-4 py-2.5 text-sm font-semibold text-[#111827] hover:border-[#C9A227]"
          >
            Reviews
          </Link>
          <Link
            href="/admin/blog"
            className="rounded-lg border-2 border-[#0B1220] bg-[#0B1220] px-4 py-2.5 text-sm font-bold text-white"
            aria-current="page"
          >
            Blog
          </Link>
        </nav>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard label="Total Posts" value={posts.length} />
          <StatCard label="Published" value={totalPublished} />
          <StatCard label="Drafts" value={posts.length - totalPublished} />
        </section>

        <section className="mt-8 overflow-hidden rounded-xl border border-[#E8E8E2] bg-white shadow-sm">
          <div className="border-b border-[#E8E8E2] px-5 py-4">
            <h2 className="font-semibold text-[#111827]">All Blog Posts</h2>
          </div>

          {posts.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h3 className="text-lg font-semibold text-[#111827]">
                No blog posts yet
              </h3>
              <p className="mt-2 text-sm text-[#6B7280]">
                Create your first article to get started.
              </p>
              <Link
                href="/admin/blog/new"
                className="mt-5 inline-flex rounded-lg bg-[#0B1220] px-5 py-3 text-sm font-bold text-white hover:bg-[#1B2A42]"
              >
                Create your first post
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAFAF7] text-[#6B7280]">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Article</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold">Last Updated</th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8E2]">
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td className="min-w-56 px-5 py-4">
                        <p className="font-semibold text-[#111827]">
                          {post.title}
                        </p>
                        <p className="mt-1 text-xs text-[#6B7280]">
                          /blog/{post.slug}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            post.published
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-[#6B7280]">
                        {post.updatedAt.toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/blog/${post.id}/edit`}
                            className="rounded-md border border-[#E8E8E2] px-3 py-2 font-semibold text-[#111827] hover:border-[#C9A227]"
                          >
                            Edit
                          </Link>
                          <form action={toggleBlogPost}>
                            <input type="hidden" name="id" value={post.id} />
                            <button
                              type="submit"
                              className="rounded-md border border-[#E8E8E2] px-3 py-2 font-semibold text-[#111827] hover:border-[#C9A227]"
                            >
                              {post.published ? "Unpublish" : "Publish"}
                            </button>
                          </form>
                          <form action={deleteBlogPost}>
                            <input type="hidden" name="id" value={post.id} />
                            <button
                              type="submit"
                              className="rounded-md border border-red-200 px-3 py-2 font-semibold text-red-700 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[#E8E8E2] bg-white p-5 shadow-sm">
      <p className="text-sm text-[#6B7280]">{label}</p>
      <p className="mt-2 text-3xl font-bold text-[#111827]">{value}</p>
    </div>
  );
}
