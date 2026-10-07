import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-primary px-8 py-16 text-white sm:px-12 lg:px-16 lg:py-20">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
              Your next vehicle
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Ready to find your next car?
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-white/65">
              Explore our available vehicles or speak directly with Doctor&apos;s
              Autos about what you&apos;re looking for.
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Link
              href="/inventory"
              className="inline-flex items-center justify-center rounded-full bg-secondary px-7 py-3.5 text-sm font-semibold text-secondary-foreground transition-all hover:opacity-90 hover:shadow-lg"
            >
              Explore Inventory
            </Link>

            <a
              href="https://wa.me/2348113545998"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}