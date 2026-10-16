import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({
  params,
}: BlogPostPageProps) {
  const { slug } = await params;

  const post = await prisma.blogPost.findFirst({
    where: {
      slug,
      published: true,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F7F7F3] px-6 py-12 lg:px-10">
      <article className="mx-auto max-w-4xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B7280] hover:text-[#111827]"
        >
          <span aria-hidden="true">←</span> Back to Blog
        </Link>

        <header className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9A7B19]">
            Doctors Autos
          </p>

          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#111827] sm:text-5xl">
            {post.title}
          </h1>

          <p className="mt-5 text-sm text-[#6B7280]">
            Published{" "}
            {(post.publishedAt ?? post.createdAt).toLocaleDateString(
              "en-GB",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}
          </p>

          {post.excerpt && (
            <p className="mt-6 text-lg leading-8 text-[#4B5563]">
              {post.excerpt}
            </p>
          )}
        </header>

        {post.coverImage && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-[#E8E8E2]">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              unoptimized
              priority
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        )}

        <div className="mt-10 rounded-2xl border border-[#E8E8E2] bg-white p-6 sm:p-10">
          <div className="whitespace-pre-wrap break-words text-base leading-8 text-[#374151]">
            {post.content}
          </div>
        </div>

        <footer className="mt-10 border-t border-[#E8E8E2] py-8">
          <p className="text-sm text-[#6B7280]">
            Looking for your next vehicle? Get in touch with Doctors Autos.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
          
<a
  href="https://wa.me/2348113545998"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#1DA851] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
>
  <span aria-hidden="true">☏</span>
  Contact Us on WhatsApp
</a>


            <Link
              href="/inventory"
              className="inline-flex items-center justify-center rounded-lg border border-[#D1D5DB] px-5 py-3 text-sm font-semibold text-[#111827] hover:bg-white"
            >
              Browse Inventory
            </Link>
          </div>
        </footer>
      </article>
    </main>
  );
}