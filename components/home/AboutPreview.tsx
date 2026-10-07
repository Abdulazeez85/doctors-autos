 import Link from "next/link";

export function AboutPreview() {
  return (
    <section className="bg-white px-6 py-24 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        {/* Visual */}
        <div className="relative">
          <div className="absolute -left-5 -top-5 h-32 w-32 rounded-full bg-accent-light/70 blur-2xl" />

          <div className="relative aspect-4/3 overflow-hidden rounded-[2rem] bg-primary p-3 shadow-xl">
            <div className="flex h-full items-center justify-center rounded-[1.5rem] bg-[#1a2230] px-8 text-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
                  Doctor&apos;s Autos
                </p>

                <p className="mt-3 text-sm text-white/40">
                  Showroom imagery coming soon
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-5 -right-4 rounded-2xl border border-border bg-white px-6 py-5 shadow-xl">
            <p className="text-2xl font-bold text-primary">Ilorin</p>
            <p className="mt-1 text-xs text-muted">Kwara State, Nigeria</p>
          </div>
        </div>

        {/* Content */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
            About Doctor&apos;s Autos
          </p>

          <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl lg:text-5xl">
            More than just a car dealership.
          </h2>

          <div className="mt-6 max-w-xl space-y-4 text-base leading-7 text-muted">
            <p>
              At Doctor&apos;s Autos, we believe finding your next vehicle
              should be a confident and straightforward experience.
            </p>

            <p>
              From the vehicles we showcase to the way we communicate with our
              customers, our goal is simple: provide quality vehicles and
              dependable service you can trust.
            </p>
          </div>

          <Link
  href="/about"
  className="mt-8 inline-flex items-center rounded-full bg-primary px-6 py-3.5 text-sm font-semibold transition-all hover:bg-primary/90 hover:shadow-lg"
  style={{ color: "#ffffff" }}
>
  Learn More
  <span className="ml-2">→</span>
</Link>
        </div>
      </div>
    </section>
  );
}