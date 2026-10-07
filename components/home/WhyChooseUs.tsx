const benefits = [
  {
    number: "01",
    title: "Quality Vehicles",
    description:
      "We focus on vehicles that offer reliability, comfort, and value for your money.",
  },
  {
    number: "02",
    title: "Transparent Deals",
    description:
      "Clear information and straightforward communication from the first conversation to the final handover.",
  },
  {
    number: "03",
    title: "Customer First",
    description:
      "We believe buying a vehicle should feel simple, respectful, and stress-free.",
  },
  {
    number: "04",
    title: "Based in Ilorin",
    description:
      "Proudly serving drivers in Ilorin, Kwara State, and customers beyond our local community.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-background px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
            Why Doctor&apos;s Autos
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            A dealership built around confidence.
          </h2>

          <p className="mt-5 text-base leading-7 text-muted">
            Finding the right vehicle is an important decision. We&apos;re
            committed to making that decision easier with quality vehicles,
            honest communication, and customer-focused service.
          </p>
        </div>

        <div className="mt-14 grid border-t border-border sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div
              key={benefit.number}
              className="border-b border-border px-0 py-8 sm:px-6 sm:nth-[2]:border-l lg:border-b-0 lg:border-l lg:first:border-l-0 lg:px-7"
            >
              <span className="text-xs font-bold tracking-[0.2em] text-secondary">
                {benefit.number}
              </span>

              <h3 className="mt-5 text-lg font-bold text-primary">
                {benefit.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-muted">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 