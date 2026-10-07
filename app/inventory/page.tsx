import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import {
  getInventoryFilterOptions,
  getInventoryVehicles,
} from "@/lib/data/vehicles";import Link from "next/link";
type InventoryPageProps = {
  searchParams: Promise<{
    search?: string;
    make?: string;
    condition?: string;
    bodyType?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
};

export default async function InventoryPage({
  searchParams,
}: InventoryPageProps) {
  const params = await searchParams;

  const condition =
    params.condition === "NEW" || params.condition === "USED"
      ? params.condition
      : undefined;

  const minPrice = params.minPrice
    ? Number(params.minPrice)
    : undefined;

  const maxPrice = params.maxPrice
    ? Number(params.maxPrice)
    : undefined;

  const sort =
    params.sort === "price-asc" || params.sort === "price-desc"
      ? params.sort
      : "newest";
const filterOptions = await getInventoryFilterOptions();
  const vehicles = await getInventoryVehicles({
    search: params.search?.trim() || undefined,
    make: params.make?.trim() || undefined,
    condition,
    bodyType: params.bodyType?.trim() || undefined,
    minPrice:
      minPrice !== undefined && !Number.isNaN(minPrice)
        ? minPrice
        : undefined,
    maxPrice:
      maxPrice !== undefined && !Number.isNaN(maxPrice)
        ? maxPrice
        : undefined,
    sort,
  });

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
            <div className="mb-10 rounded-2xl border border-border bg-white p-5">
              <form
                method="GET"
                action="/inventory"
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
              >
                <div className="lg:col-span-2">
                  <label
                    htmlFor="search"
                    className="text-xs font-semibold uppercase tracking-wider text-muted"
                  >
                    Search
                  </label>

                  <input
                    id="search"
                    name="search"
                    type="search"
                    defaultValue={params.search}
                    placeholder="Search make or model..."
                    className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-primary outline-none transition focus:border-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="make"
                    className="text-xs font-semibold uppercase tracking-wider text-muted"
                  >
                    Make
                  </label>

                  <select
                    id="make"
                    name="make"
                    defaultValue={params.make ?? ""}
                    className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-primary outline-none transition focus:border-primary"
                  >
                    <option value="">All Makes</option>

{filterOptions.makes.map((make) => (
  <option key={make} value={make}>
    {make}
  </option>
))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="condition"
                    className="text-xs font-semibold uppercase tracking-wider text-muted"
                  >
                    Condition
                  </label>

                  <select
                    id="condition"
                    name="condition"
                    defaultValue={params.condition ?? ""}
                    className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-primary outline-none transition focus:border-primary"
                  >
                    <option value="">All conditions</option>
                    <option value="NEW">New</option>
                    <option value="USED">Used</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="bodyType"
                    className="text-xs font-semibold uppercase tracking-wider text-muted"
                  >
                    Body Type
                  </label>

                  <select
                    id="bodyType"
                    name="bodyType"
                    defaultValue={params.bodyType ?? ""}
                    className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-primary outline-none transition focus:border-primary"
                  >
                    <option value="">All Body Types</option>

{filterOptions.bodyTypes.map((bodyType) => (
  <option key={bodyType} value={bodyType}>
    {bodyType}
  </option>
))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="minPrice"
                    className="text-xs font-semibold uppercase tracking-wider text-muted"
                  >
                    Min Price
                  </label>

                  <input
                    id="minPrice"
                    name="minPrice"
                    type="number"
                    min="0"
                    defaultValue={params.minPrice}
                    placeholder="₦ minimum"
                    className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-primary outline-none transition focus:border-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="maxPrice"
                    className="text-xs font-semibold uppercase tracking-wider text-muted"
                  >
                    Max Price
                  </label>

                  <input
                    id="maxPrice"
                    name="maxPrice"
                    type="number"
                    min="0"
                    defaultValue={params.maxPrice}
                    placeholder="₦ maximum"
                    className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-primary outline-none transition focus:border-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="sort"
                    className="text-xs font-semibold uppercase tracking-wider text-muted"
                  >
                    Sort By
                  </label>

                  <select
                    id="sort"
                    name="sort"
                    defaultValue={sort}
                    className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-primary outline-none transition focus:border-primary"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>

                <div className="flex items-end gap-3 md:col-span-2 lg:col-span-4">
                  <button
                    type="submit"
                    className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold transition-all hover:bg-primary/90 hover:shadow-lg"
                    style={{ color: "#ffffff" }}
                  >
                    Apply Filters
                  </button>

                  <Link 
                    href="/inventory"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-white px-6 text-sm font-semibold text-primary transition-all hover:bg-surface-muted"
                  >
                    Clear
                  </Link>
                </div>
              </form>
            </div>

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
                  No vehicles match your search.
                </p>

                <p className="mt-2 text-sm text-muted">
                  Try adjusting your filters or search criteria.
                </p>

                <Link 
                  href="/inventory"
                  className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold"
                  style={{ color: "#ffffff" }}
                >
                  View All Vehicles
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}