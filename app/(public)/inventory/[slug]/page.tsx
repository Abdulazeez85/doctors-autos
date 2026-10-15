import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getVehicleBySlug } from "@/lib/data/vehicles";

type VehicleDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function VehicleDetailPage({
  params,
}: VehicleDetailPageProps) {
  const { slug } = await params;

  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="border-b border-border bg-white px-6 py-12 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Link
              href="/inventory"
              className="text-sm font-semibold text-muted transition-colors hover:text-primary"
            >
              ← Back to Inventory
            </Link>

            <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
              <div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-surface-muted">
                  {vehicle.images.length > 0 ? (
                    <Image
                      src={vehicle.images[0].url}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                          Doctor&apos;s Autos
                        </p>

                        <p className="mt-2 text-sm text-muted/70">
                          Vehicle image coming soon
                        </p>
                      </div>
                    </div>
                  )}

                  {vehicle.featured && (
                    <div className="absolute left-5 top-5 rounded-full bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
                      Featured
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:pt-4">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
                  {vehicle.condition}
                </p>

                <p className="mt-4 text-sm font-medium text-muted">
                  {vehicle.year}
                </p>

                <h1 className="mt-2 text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                  {vehicle.make} {vehicle.model}
                </h1>

                <p className="mt-6 text-3xl font-bold tracking-tight text-primary">
                  ₦{Number(vehicle.price).toLocaleString()}
                </p>

                {vehicle.description && (
                  <p className="mt-6 text-base leading-7 text-muted">
                    {vehicle.description}
                  </p>
                )}

                <div className="mt-8 grid grid-cols-2 gap-3">
                  {vehicle.mileage !== null && (
                    <div className="rounded-2xl border border-border bg-background p-4">
                      <p className="text-xs font-medium text-muted">Mileage</p>
                      <p className="mt-1 text-sm font-semibold text-primary">
                        {vehicle.mileage.toLocaleString()} km
                      </p>
                    </div>
                  )}

                  {vehicle.transmission && (
                    <div className="rounded-2xl border border-border bg-background p-4">
                      <p className="text-xs font-medium text-muted">
                        Transmission
                      </p>
                      <p className="mt-1 text-sm font-semibold text-primary">
                        {vehicle.transmission}
                      </p>
                    </div>
                  )}

                  {vehicle.fuelType && (
                    <div className="rounded-2xl border border-border bg-background p-4">
                      <p className="text-xs font-medium text-muted">
                        Fuel Type
                      </p>
                      <p className="mt-1 text-sm font-semibold text-primary">
                        {vehicle.fuelType}
                      </p>
                    </div>
                  )}

                  {vehicle.bodyType && (
                    <div className="rounded-2xl border border-border bg-background p-4">
                      <p className="text-xs font-medium text-muted">
                        Body Type
                      </p>
                      <p className="mt-1 text-sm font-semibold text-primary">
                        {vehicle.bodyType}
                      </p>
                    </div>
                  )}

                  {vehicle.driveType && (
                    <div className="rounded-2xl border border-border bg-background p-4">
                      <p className="text-xs font-medium text-muted">
                        Drive Type
                      </p>
                      <p className="mt-1 text-sm font-semibold text-primary">
                        {vehicle.driveType}
                      </p>
                    </div>
                  )}

                  {vehicle.color && (
                    <div className="rounded-2xl border border-border bg-background p-4">
                      <p className="text-xs font-medium text-muted">Color</p>
                      <p className="mt-1 text-sm font-semibold text-primary">
                        {vehicle.color}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={`https://wa.me/2348113545998?text=${encodeURIComponent(
                      `Hello Doctor's Autos, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center rounded-full bg-primary px-6 py-3.5 text-sm font-semibold transition-all hover:bg-primary/90 hover:shadow-lg"
                    style={{ color: "#ffffff" }}
                  >
                    Ask About This Vehicle
                  </a>

                  <a
                    href="tel:+2348113545998"
                    className="inline-flex items-center justify-center rounded-full border border-border bg-white px-6 py-3.5 text-sm font-semibold text-primary transition-all hover:border-primary/20 hover:bg-surface-muted"
                  >
                    Call Dealer
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {vehicle.images.length > 1 && (
          <section className="bg-background px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
                Gallery
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary">
                More photos
              </h2>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {vehicle.images.slice(1).map((image) => (
                  <div
                    key={image.id}
                    className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-muted"
                  >
                    <Image
                      src={image.url}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}