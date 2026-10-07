import Link from "next/link";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { getFeaturedVehicles } from "@/lib/data/vehicles";

export async function FeaturedVehicles() {
  const vehicles = await getFeaturedVehicles();

  return (
    <section className="border-t border-border bg-white px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
              Featured Inventory
            </p>

            <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Find something you&apos;ll love.
            </h2>

            <p className="mt-4 max-w-xl text-base leading-7 text-muted">
              Explore some of the vehicles currently available at Doctor&apos;s
              Autos.
            </p>
          </div>

          <Link
            href="/inventory"
            className="text-sm font-semibold text-primary transition-colors hover:text-secondary"
          >
            View all vehicles →
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      </div>
    </section>
  );
}