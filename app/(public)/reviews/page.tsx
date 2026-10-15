import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ReviewSubmissionForm } from "./ReviewSubmissionForm";
export const metadata: Metadata = {
  title: "Customer Reviews | Doctor's Autos",
  description:
    "Read customer feedback and experiences with Doctor's Autos in Ilorin, Kwara State.",
};
export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) /
        reviews.length
      : 0;
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-background">
        <section className="bg-primary px-6 py-20 text-white lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
              Customer Experiences
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              What our customers say.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              At Doctor&apos;s Autos, we believe buying a vehicle should be a
              straightforward and enjoyable experience. Read feedback from
              customers who have shared their experiences with us.
            </p>
            {reviews.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <span
                  className="text-2xl tracking-wide text-secondary"
                  aria-label={`Average rating ${averageRating.toFixed(1)} out of 5`}
                >
                  {"★".repeat(Math.max(0, Math.min(5, Math.round(averageRating))))}
                </span>
                <div>
                  <p className="font-bold">
                    {averageRating.toFixed(1)} out of 5
                  </p>
                  <p className="text-sm text-white/70">
                    Based on {reviews.length}{" "}
                    {reviews.length === 1 ? "review" : "reviews"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
        <section className="px-6 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10">
              <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                Customer reviews
              </h2>
              <p className="mt-3 text-muted">
                Honest feedback from our customers.
              </p>
            </div>
            {reviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center sm:px-12">
                <div
                  className="text-4xl text-secondary"
                  aria-hidden="true"
                >
                  ★
                </div>
                <h3 className="mt-5 text-xl font-bold text-primary">
                  Our customer stories are coming soon
                </h3>
                <p className="mx-auto mt-3 max-w-lg leading-7 text-muted">
                  We look forward to sharing feedback from our customers here.
                  In the meantime, explore our available vehicles or contact
                  our team for assistance.
                </p>
                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    href="/inventory"
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Browse Inventory
                  </Link>
                  <a
                    href="https://wa.me/2348113545998"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg border border-border bg-white px-5 py-3 text-sm font-semibold text-primary transition-colors hover:border-secondary"
                  >
                    Contact Us on WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {reviews.map((review) => {
                  const rating = Math.max(0, Math.min(5, review.rating));
                  return (
                    <article
                      key={review.id}
                      className="flex flex-col rounded-2xl border border-border bg-white p-7 transition-shadow duration-300 hover:shadow-lg"
                    >
                      <div
                        className="flex gap-1 text-xl text-secondary"
                        aria-label={`${rating} out of 5 stars`}
                      >
                        {"★".repeat(rating)}
                        {"☆".repeat(5 - rating)}
                      </div>
                      <blockquote className="mt-6 flex-1 whitespace-pre-wrap text-base leading-7 text-foreground/80">
                        &ldquo;{review.comment}&rdquo;
                      </blockquote>
                      <div className="mt-7 border-t border-border pt-5">
                        <p className="font-bold text-primary">
                          {review.customerName}
                        </p>
                        <p className="mt-2 text-xs text-muted">
                          {review.createdAt.toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
            <div className="mt-12 text-center">
              <Link
                href="/inventory"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-secondary"
              >
                Explore our vehicles <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
                <section className="bg-background px-6 pb-16 lg:px-8 lg:pb-20">
          <div className="mx-auto max-w-3xl">
            <ReviewSubmissionForm />
          </div>
        </section>
      </main>
    </div>
  );
}
