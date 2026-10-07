import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getAvailableVehicles } from "@/lib/data/vehicles";

export default async function InventoryPage() {
  const vehicles = await getAvailableVehicles();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="border-b border-border bg-white px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
              Our Inventory
            </p>

            <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                  Find your next vehicle.
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
                  Explore the vehicles currently available at Doctor&apos;s
                  Autos in Ilorin.
                </p>
              </div>

              <p className="shrink-0 text-sm font-medium text-muted">
                {vehicles.length}{" "}
                {vehicles.length === 1 ? "vehicle" : "vehicles"} available
              </p>
            </div>
          </div>
        </section>

        <section className="bg-background px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {vehicles.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {vehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    slug={vehicle.slug}
                    year={vehicle.year}
                    make={vehicle.make}
                    model={vehicle.model}
                    price={`₦${Number(vehicle.price).toLocaleString()}`}
                    mileage={
                      vehicle.mileage
                        ? `${vehicle.mileage.toLocaleString()} km`
                        : undefined
                    }
                    transmission={vehicle.transmission ?? undefined}
                    fuelType={vehicle.fuelType ?? undefined}
                    featured={vehicle.featured}
                    image={vehicle.images[0]?.url}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-white px-6 py-20 text-center">
                <p className="text-lg font-semibold text-primary">
                  No vehicles currently available.
                </p>

                <p className="mt-2 text-sm text-muted">
                  Please check back soon for new inventory.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}