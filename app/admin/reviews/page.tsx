import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { setReviewPublished } from "./actions";
export default async function AdminReviewsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
  });
  const publishedCount = reviews.filter((review) => review.published).length;
  return (
    <main className="min-h-screen bg-[#F7F7F3] px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C9A227]">
              Doctor&apos;s Autos
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#111827]">
              Review Management
            </h1>
            <p className="mt-2 text-[#6B7280]">
              Review customer feedback and choose which reviews appear publicly.
            </p>
          </div>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center justify-center rounded-lg border border-[#E8E8E2] bg-white px-4 py-3 text-sm font-semibold text-[#111827] hover:border-[#C9A227]"
          >
            Back to Dashboard
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
            aria-current="page"
            className="rounded-lg border-2 border-[#0B1220] bg-[#0B1220] px-4 py-2.5 text-sm font-bold text-white"
          >
            Reviews
          </Link>
        </nav>
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#E8E8E2] bg-white p-5">
            <p className="text-sm text-[#6B7280]">Total reviews</p>
            <p className="mt-2 text-3xl font-bold text-[#111827]">
              {reviews.length}
            </p>
          </div>
          <div className="rounded-xl border border-[#E8E8E2] bg-white p-5">
            <p className="text-sm text-[#6B7280]">Published</p>
            <p className="mt-2 text-3xl font-bold text-[#111827]">
              {publishedCount}
            </p>
          </div>
          <div className="rounded-xl border border-[#E8E8E2] bg-white p-5">
            <p className="text-sm text-[#6B7280]">Awaiting publication</p>
            <p className="mt-2 text-3xl font-bold text-[#111827]">
              {reviews.length - publishedCount}
            </p>
          </div>
        </section>
        <section className="mt-8 space-y-4">
          {reviews.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#D5D5CC] bg-white p-10 text-center">
              <h2 className="text-lg font-semibold text-[#111827]">
                No reviews yet
              </h2>
              <p className="mt-2 text-sm text-[#6B7280]">
                Customer reviews will appear here when they are added.
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-xl border border-[#E8E8E2] bg-white p-5 sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-bold text-[#111827]">
                        {review.customerName}
                      </h2>
                      <span
                        className={
                          review.published
                            ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                            : "rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800"
                        }
                      >
                        {review.published ? "Published" : "Unpublished"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[#9A7715]" aria-label={`${review.rating} out of 5 stars`}>
                      {"★".repeat(Math.max(0, Math.min(5, review.rating)))}
                      {"☆".repeat(5 - Math.max(0, Math.min(5, review.rating)))}
                      <span className="ml-2 text-[#6B7280]">
                        {review.rating}/5
                      </span>
                    </p>
                    <p className="mt-3 whitespace-pre-wrap leading-7 text-[#4B5563]">
                      {review.comment}
                    </p>
                    <p className="mt-4 text-xs text-[#6B7280]">
                      Submitted {review.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <form action={setReviewPublished}>
                    <input type="hidden" name="id" value={review.id} />
                    <input
                      type="hidden"
                      name="published"
                      value={review.published ? "false" : "true"}
                    />
                    <button
                      type="submit"
                      className={
                        review.published
                          ? "w-full rounded-lg border border-[#E8E8E2] px-4 py-2.5 text-sm font-semibold text-[#111827] hover:border-red-300 hover:text-red-700 sm:w-auto"
                          : "w-full rounded-lg bg-[#0B1220] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1B2A42] sm:w-auto"
                      }
                    >
                      {review.published ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
