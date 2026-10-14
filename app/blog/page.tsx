import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
     select: {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  coverImage: true,
  publishedAt: true,
  createdAt: true,
},
  }); 

  return (
    <main className="min-h-screen bg-[#F7F7F3] px-6 py-12 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B08D20]">
            Doctor&apos;s Autos
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#111827] sm:text-5xl">
            The Doctor&apos;s Autos Blog
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#6B7280]">
            Helpful insights on buying, maintaining, and getting the best value
            from your next vehicle.
          </p>
        </header>

        {posts.length === 0 ? (
          <section className="mt-12 rounded-2xl border border-[#E8E8E2] bg-white px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-[#111827]">
              New articles coming soon
            </h2>
            <p className="mt-3 text-[#6B7280]">
              We&apos;re preparing helpful automotive tips and updates. Please
              check back soon.
            </p>
          </section>
        ) : (
          <section className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="overflow-hidden rounded-2xl border border-[#E8E8E2] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {post.coverImage ? (
                  <div className="relative aspect-[16/10] bg-[#E8E8E2]">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[16/10] items-center justify-center bg-[#0B1220] px-6 text-center">
                    <span className="text-2xl font-bold text-white">
                      Doctor&apos;s Autos
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#9A7B19]">
                    {(post.publishedAt ?? post.createdAt).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>

                  <h2 className="mt-3 text-xl font-bold leading-snug text-[#111827]">
                    {post.title}
                  </h2>

                  <p className="mt-3 line-clamp-3 whitespace-pre-line text-sm leading-6 text-[#6B7280]">
                    {post.excerpt || post.content.slice(0, 180)}
                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#111827] hover:text-[#9A7B19]"
                  >
                    Read article <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}