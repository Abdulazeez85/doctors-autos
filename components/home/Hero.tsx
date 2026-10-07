import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-8 lg:py-20">
        {/* Copy */}
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            Ilorin, Kwara State
          </div>

          <h1 className="max-w-xl text-5xl font-bold leading-[1.05] tracking-[-0.04em] text-primary sm:text-6xl lg:text-7xl">
            Drive with
            <span className="block">confidence.</span>
          </h1>

          <p className="mt-7 max-w-lg text-base leading-7 text-muted sm:text-lg">
            Discover quality vehicles selected for drivers who value
            reliability, style, and a buying experience they can trust.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
  href="/inventory"
  className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-semibold transition-all hover:bg-primary/90 hover:shadow-xl"
  style={{ color: "#ffffff" }}
>
  Explore Inventory
</Link>

            <a
  href="https://wa.me/2348113545998"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center justify-center rounded-full border border-primary/15 bg-white px-7 py-3.5 text-sm font-semibold text-primary transition-all hover:border-primary/30 hover:bg-surface-muted hover:shadow-md"
>
  Chat on WhatsApp
</a>
          </div>

          <div className="mt-12 flex items-center gap-8 border-t border-border pt-7">
            <div>
              <p className="text-2xl font-bold text-primary">Quality</p>
              <p className="mt-1 text-xs text-muted">Selected vehicles</p>
            </div>

            <div className="h-10 w-px bg-border" />

            <div>
              <p className="text-2xl font-bold text-primary">Trusted</p>
              <p className="mt-1 text-xs text-muted">Customer focused</p>
            </div>
          </div>
        </div>

        {/* Visual */}
        <div className="relative">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-accent-light/60 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2rem] bg-primary p-3 shadow-2xl">
            <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[1.5rem] bg-[#1a2230]">
              <div className="px-8 text-center text-white/40">
                <p className="text-sm font-medium uppercase tracking-[0.2em]">
                  Doctor&apos;s Autos
                </p>
                <p className="mt-2 text-xs">
                  Premium vehicle imagery coming next
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-5 rounded-2xl border border-border bg-white px-5 py-4 shadow-xl">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">
              Your next journey
            </p>
            <p className="mt-1 text-sm font-bold text-primary">
              Starts here.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}