import Link from "next/link";
import { deleteVehicle } from "./actions";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminVehiclesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const vehicles = await prisma.vehicle.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
        take: 1,
      },
    },
  });

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
              Manage the vehicles displayed on your dealership website.
            </p>
          </div>

          <Link
            href="/admin/vehicles/new"
            className="inline-flex items-center justify-center rounded-lg bg-[#0B1220] px-5 py-3 text-sm font-semibold"
            style={{ color: "#ffffff" }}
          >
            + Add Vehicle
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#E8E8E2] bg-white shadow-sm">
          {vehicles.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h2 className="text-lg font-semibold text-[#111827]">
                No vehicles yet
              </h2>

              <p className="mt-2 text-sm text-[#6B7280]">
                Add your first vehicle to get started.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="border-b border-[#E8E8E2] bg-[#F7F7F3]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                      Vehicle
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                      Condition
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                      Featured
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E8E8E2]">
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-[#F7F7F3]">
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-semibold text-[#111827]">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </p>

                          <p className="mt-1 text-sm text-[#6B7280]">
                            {vehicle.bodyType ?? "Vehicle"} ·{" "}
                            {vehicle.mileage
                              ? `${vehicle.mileage.toLocaleString()} km`
                              : "Mileage N/A"}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5 font-medium text-[#111827]">
                        ₦{Number(vehicle.price).toLocaleString()}
                      </td>

                      <td className="px-6 py-5">
                        <StatusBadge value={vehicle.condition} />
                      </td>

                      <td className="px-6 py-5">
                        <StatusBadge value={vehicle.status} />
                      </td>

                      <td className="px-6 py-5">
                        {vehicle.featured ? (
                          <span className="text-sm font-medium text-[#C9A227]">
                            Yes
                          </span>
                        ) : (
                          <span className="text-sm text-[#6B7280]">No</span>
                        )}
                      </td>

                      <td className="px-6 py-5">
  <div className="flex items-center justify-end gap-4">
    <Link
      href={`/admin/vehicles/${vehicle.id}/edit`}
      className="text-sm font-semibold text-[#111827] hover:text-[#C9A227]"
    >
      Edit
    </Link>

    <form action={deleteVehicle}>
      <input type="hidden" name="id" value={vehicle.id} />

      <button
        type="submit"
        className="text-sm font-semibold text-red-600 hover:text-red-700"
      >
        Delete
      </button>
    </form>
  </div>
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function StatusBadge({ value }: { value: string }) {
  return (
    <span className="inline-flex rounded-full bg-[#F1F1EC] px-3 py-1 text-xs font-semibold text-[#111827]">
      {value}
    </span>
  );
}