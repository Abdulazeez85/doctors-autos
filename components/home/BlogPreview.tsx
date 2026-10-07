import Link from "next/link";

const posts = [
  {
    slug: "how-to-choose-the-right-car",
    category: "Buying Guide",
    title: "How to choose the right car for your needs",
    excerpt:
      "A practical guide to considering your budget, lifestyle, and priorities before buying your next vehicle.",
  },
  {
    slug: "used-car-buying-guide",
    category: "Car Buying",
    title: "What to check before buying a used car",
    excerpt:
      "The important things every buyer should inspect before committing to a pre-owned vehicle.",
  },
  {
    slug: "car-maintenance-basics",
    category: "Maintenance",
    title: "Simple habits that keep your car running well",
    excerpt:
      "A few practical maintenance habits that can help you protect your vehicle and avoid unnecessary problems.",
  },
];

export function BlogPreview() {
  return (
    <section className="bg-white px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
              From the Blog
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Useful automotive insights.
            </h2>

            <p className="mt-4 max-w-xl text-base leading-7 text-muted">
              Helpful guides and practical advice to make vehicle ownership
              easier.
            </p>
          </div>

          <Link
            href="/blog"
            className="text-sm font-semibold text-primary transition-colors hover:text-secondary"
          >
            View all articles →
          </Link>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group overflow-hidden rounded-2xl border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex aspect-[16/9] items-center justify-center bg-surface-muted">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  Doctor&apos;s Autos
                </span>
              </div>

              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
                  {post.category}
                </p>

                <h3 className="mt-3 text-xl font-bold leading-snug tracking-tight text-primary">
                  {post.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-muted">
                  {post.excerpt}
                </p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-5 inline-flex text-sm font-semibold text-primary transition-colors group-hover:text-secondary"
                >
                  Read article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}