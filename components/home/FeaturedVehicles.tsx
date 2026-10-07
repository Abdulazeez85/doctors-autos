import Link from "next/link";
import { VehicleCard } from "@/components/vehicles/VehicleCard";

const vehicles = [
  {
    slug: "toyota-camry-2023",
    year: 2023,
    make: "Toyota",
    model: "Camry",
    price: "₦28,500,000",
    mileage: "32,000 km",
    transmission: "Automatic",
    fuelType: "Petrol",
    featured: true,
  },
  {
    slug: "lexus-rx-350-2022",
    year: 2022,
    make: "Lexus",
    model: "RX 350",
    price: "₦42,000,000",
    mileage: "41,000 km",
    transmission: "Automatic",
    fuelType: "Petrol",
    featured: true,
  },
  {
    slug: "mercedes-benz-c300-2021",
    year: 2021,
    make: "Mercedes-Benz",
    model: "C300",
    price: "₦35,000,000",
    mileage: "38,000 km",
    transmission: "Automatic",
    fuelType: "Petrol",
    featured: true,
  },
];

export function FeaturedVehicles() {
  return (
    <section className="border-t border-border bg-white px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
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

        {/* Vehicles */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.slug} {...vehicle} />
          ))}
        </div>
      </div>
    </section>
  );
}