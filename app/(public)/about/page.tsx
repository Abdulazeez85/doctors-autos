import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Doctors Autos in Ilorin, Kwara State, and our commitment to helping customers find a vehicle that suits their needs.",
};

const values = [
  {
    number: "01",
    title: "Customer First",
    description:
      "We believe choosing a vehicle should feel straightforward. We aim to understand your needs and help you explore suitable options.",
  },
  {
    number: "02",
    title: "Clarity and Transparency",
    description:
      "We value clear communication, honest conversations, and helping customers understand their options before making a decision.",
  },
  {
    number: "03",
    title: "The Right Fit",
    description:
      "Every buyer has different priorities. We want to help you consider your budget, preferences, and intended use when choosing a vehicle.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-[#0B1220] px-6 py-20 text-white sm:py-28 lg:px-10">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#B08D20]/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#D7B64B]">
            Get to know us
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
            More than finding a car.
            <span className="mt-2 block text-[#D7B64B]">
              Finding the right fit.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
            At Doctors Autos, we want to make your vehicle search clearer,
            more convenient, and focused on what matters to you.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/inventory"
              className="inline-flex items-center justify-center rounded-full bg-[#B08D20] px-7 py-3.5 text-sm font-semibold !text-white transition-colors hover:bg-[#9A7B19]"
            >
              Explore our inventory
            </Link>

            <Link
              href="/reviews"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Customer reviews
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9A7B19]">
              Who we are
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Welcome to Doctors Autos
            </h2>
          </div>

          <div className="space-y-5 text-base leading-8 text-muted">
            <p>
              Doctors Autos is a vehicle dealership based in Ilorin,
              Kwara State, Nigeria. We help customers explore available vehicles
              and consider the options that best match their needs.
            </p>

            <p>
              We understand that buying a vehicle is an important decision.
              Whether you are searching for a car for everyday use, family
              journeys, or business, we want your search to begin with useful
              information and clear communication.
            </p>

            <p>
              Our goal is to give every customer a welcoming experience and
              help make the process of finding a suitable vehicle easier to
              navigate.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F7F3] px-6 py-16 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9A7B19]">
              What guides us
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
              The principles behind your experience
            </h2>

            <p className="mt-4 leading-7 text-[#6B7280]">
              These are the values we aim to bring to every customer
              interaction.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <article
                key={value.number}
                className="rounded-2xl border border-[#E8E8E2] bg-white p-7 shadow-sm"
              >
                <span className="text-sm font-bold tracking-widest text-[#9A7B19]">
                  {value.number}
                </span>

                <h3 className="mt-5 text-xl font-bold text-[#111827]">
                  {value.title}
                </h3>

                <p className="mt-3 leading-7 text-[#6B7280]">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 rounded-3xl bg-[#0B1220] p-8 text-white sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D7B64B]">
              Visit or contact us
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Let&apos;s find a vehicle that works for you.
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-white/70">
              Have a question about an available vehicle? Get in touch with
              Doctors Autos or browse our current inventory.
            </p>

            <p className="mt-5 text-sm text-white/80">
              Ilorin, Kwara State, Nigeria
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <a
              href="https://wa.me/2348113545998"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#B08D20] px-6 py-3.5 text-sm font-semibold !text-white transition-colors hover:bg-[#9A7B19]"
            >
              Chat on WhatsApp
            </a>

            <Link
              href="/inventory"
              className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Browse vehicles
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}