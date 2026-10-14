import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import VehicleInventoryTable from "@/components/admin/vehicle-inventory-table";

export default async function AdminVehiclesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const vehicles = await prisma.vehicle.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const serializableVehicles = vehicles.map((vehicle) => ({
    ...vehicle,
    price: vehicle.price.toString(),
  }));

  return (
    <main className="min-h-screen bg-[#F7F7F3] px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/admin/dashboard"
              className="text-sm font-medium text-[#6B7280] hover:text-[#111827]"
            >
              ← Dashboard
            </Link>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#C9A227]">
              Doctor&apos;s Autos
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#111827]">
              Vehicle Inventory
            </h1>

            <p className="mt-2 text-[#6B7280]">
              Search, filter, and manage the vehicles displayed on your dealership website.
            </p>
          </div>

          <Link
            href="/admin/vehicles/new"
            className="inline-flex items-center justify-center rounded-lg bg-[#0B1220] px-5 py-3 text-sm font-semibold text-white"
          >
            + Add Vehicle
          </Link>
        </div>

        <VehicleInventoryTable vehicles={serializableVehicles} />
      </div>
    </main>
  );
}