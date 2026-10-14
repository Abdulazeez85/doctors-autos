"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { deleteVehicle } from "@/app/admin/vehicles/actions";

type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number | string;
  mileage: number | null;
  bodyType: string | null;
  condition: string;
  status: string;
  featured: boolean;
};

type Props = {
  vehicles: Vehicle[];
};

const filters = ["ALL", "AVAILABLE", "SOLD", "RESERVED"] as const;

export default function VehicleInventoryTable({ vehicles }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<(typeof filters)[number]>("ALL");

  const counts = useMemo(
    () => ({
      ALL: vehicles.length,
      AVAILABLE: vehicles.filter((v) => v.status === "AVAILABLE").length,
      SOLD: vehicles.filter((v) => v.status === "SOLD").length,
      RESERVED: vehicles.filter((v) => v.status === "RESERVED").length,
    }),
    [vehicles],
  );

  const filteredVehicles = useMemo(() => {
    const term = search.trim().toLowerCase();

    return vehicles.filter((vehicle) => {
      const matchesSearch =
        !term ||
        `${vehicle.year} ${vehicle.make} ${vehicle.model}`
          .toLowerCase()
          .includes(term);

      const matchesStatus =
        statusFilter === "ALL" || vehicle.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [vehicles, search, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setStatusFilter(filter)}
            className={`rounded-xl border p-5 text-left transition ${
              statusFilter === filter
                ? "border-[#C9A227] bg-[#FFFDF5]"
                : "border-[#E8E8E2] bg-white hover:border-[#C9A227]"
            }`}
          >
            <p className="text-sm text-[#6B7280]">
              {filter === "ALL"
                ? "Total vehicles"
                : filter.charAt(0) + filter.slice(1).toLowerCase()}
            </p>
            <p className="mt-2 text-2xl font-bold text-[#111827]">
              {counts[filter]}
            </p>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-md">
          <label
            htmlFor="vehicle-search"
            className="mb-2 block text-sm font-medium text-[#111827]"
          >
            Search inventory
          </label>
          <input
            id="vehicle-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by make, model, or year..."
            className="w-full rounded-lg border border-[#E8E8E2] bg-white px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
          />
        </div>

        <p className="text-sm text-[#6B7280]" aria-live="polite">
          Showing {filteredVehicles.length} of {vehicles.length} vehicles
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E8E8E2] bg-white shadow-sm">
        {filteredVehicles.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <h2 className="text-lg font-semibold text-[#111827]">
              No matching vehicles
            </h2>
            <p className="mt-2 text-sm text-[#6B7280]">
              Try another search or select a different status.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("ALL");
              }}
              className="mt-4 text-sm font-semibold text-[#8A6A00] hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="border-b border-[#E8E8E2] bg-[#F7F7F3]">
                <tr>
                  {["Vehicle", "Price", "Condition", "Status", "Featured", "Actions"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className={`px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#6B7280] ${
                          heading === "Actions" ? "text-right" : "text-left"
                        }`}
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E2]">
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-[#F7F7F3]">
                    <td className="px-6 py-5">
                      <p className="font-semibold text-[#111827]">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </p>
                      <p className="mt-1 text-sm text-[#6B7280]">
                        {vehicle.bodyType ?? "Vehicle"} ·{" "}
                        {vehicle.mileage != null
                          ? `${vehicle.mileage.toLocaleString()} km`
                          : "Mileage N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-5 font-medium text-[#111827]">
                      ₦{Number(vehicle.price).toLocaleString("en-NG")}
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge value={vehicle.condition} />
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge value={vehicle.status} />
                    </td>
                    <td className="px-6 py-5">
                      {vehicle.featured ? (
                        <span className="text-sm font-medium text-[#8A6A00]">
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
  );
}

function StatusBadge({ value }: { value: string }) {
  const styles: Record<string, string> = {
    AVAILABLE: "bg-emerald-50 text-emerald-700",
    SOLD: "bg-red-50 text-red-700",
    RESERVED: "bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[value] ?? "bg-[#F1F1EC] text-[#111827]"
      }`}
    >
      {value}
    </span>
  );
}