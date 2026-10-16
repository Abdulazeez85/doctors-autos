import Link from "next/link";
import { prisma } from "@/lib/prisma";
const fallbackTestimonials = [
  {
    id: "fallback-1",
    name: "The Quantum Dev",
    location: "Ilorin",
    rating: 5,
    comment:
      "The process was straightforward and the team was very helpful. I got exactly what I was looking for.",
  },
  {
    id: "fallback-2",
    name: "Evaride Cars",
    location: "Kwara State",
    rating: 5,
    comment:
      "Great experience from start to finish. Communication was clear and the vehicle was exactly as described.",
  },
  {
    id: "fallback-3",
    name: "CarGeek247",
    location: "Ilorin",
    rating: 5,
    comment:
      "Professional service and a smooth buying experience. I would definitely recommend Doctors Autos.",
  },
];
export async function Testimonials() {
  const publishedReviews = await prisma.review.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      id: true,
      customerName: true,
      rating: true,
      comment: true,
    },
  });
  const testimonials =
    publishedReviews.length > 0
      ? publishedReviews.map((review) => ({
          id: review.id,
          name: review.customerName,
          location: "",
          rating: review.rating,
          comment: review.comment,
        }))
      : fallbackTestimonials;
  const showingFallback = publishedReviews.length === 0;
  return (
    <section className="bg-background px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
              Customer Reviews
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Trusted by our customers.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted">
              {showingFallback
                ? "Every customer experience matters. Here's what some of our customers have to say."
                : "Read feedback shared by customers of Doctors Autos."}
            </p>
          </div>
          <Link
            href="/reviews"
            className="text-sm font-semibold text-primary transition-colors hover:text-secondary"
          >
            Read all reviews →
          </Link>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => {
            const rating = Math.max(0, Math.min(5, testimonial.rating));
            return (
              <article
                key={testimonial.id}
                className="rounded-2xl border border-border bg-white p-7 transition-shadow duration-300 hover:shadow-lg"
              >
                <div
                  className="flex gap-1 text-secondary"
                  aria-label={`${rating} out of 5 stars`}
                >
                  {"★".repeat(rating)}
                  {"☆".repeat(5 - rating)}
                </div>
                <blockquote className="mt-6 text-base leading-7 text-foreground/80">
                  “{testimonial.comment}”
                </blockquote>
                <div className="mt-7 border-t border-border pt-5">
                  <p className="text-sm font-bold text-primary">
                    {testimonial.name}
                  </p>
                  {testimonial.location && (
                    <p className="mt-1 text-xs text-muted">
                      {testimonial.location}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
