import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { updateVehicle } from "../../actions";
import DeleteVehicleButton from "@/components/admin/DeleteVehicleButton";
type EditVehiclePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditVehiclePage({
  params,
}: EditVehiclePageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
  });

  if (!vehicle) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F7F7F3] px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/vehicles"
          className="text-sm font-medium text-[#6B7280] hover:text-[#111827]"
        >
          ← Vehicle Inventory
        </Link>

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C9A227]">
            Doctor&apos;s Autos
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#111827]">
            Edit Vehicle
          </h1>

          <p className="mt-2 text-[#6B7280]">
            Update the details of this vehicle.
          </p>
        </div>

        <form
          action={updateVehicle}
          className="mt-8 rounded-2xl border border-[#E8E8E2] bg-white p-6 shadow-sm sm:p-8"
        >
          <input type="hidden" name="id" value={vehicle.id} />

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              label="Make"
              name="make"
              defaultValue={vehicle.make}
              required
            />

            <FormField
              label="Model"
              name="model"
              defaultValue={vehicle.model}
              required
            />

            <FormField
              label="Year"
              name="year"
              type="number"
              defaultValue={vehicle.year}
              required
            />

            <FormField
              label="Price (₦)"
              name="price"
              type="number"
              defaultValue={Number(vehicle.price)}
              required
            />

            <FormField
              label="Mileage (km)"
              name="mileage"
              type="number"
              defaultValue={vehicle.mileage ?? undefined}
            />

            <div>
              <label
                htmlFor="condition"
                className="mb-2 block text-sm font-medium text-[#111827]"
              >
                Condition
              </label>

              <select
                id="condition"
                name="condition"
                defaultValue={vehicle.condition}
                className="w-full rounded-lg border border-[#E8E8E2] bg-white px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#C9A227]"
              >
                <option value="USED">Used</option>
                <option value="NEW">New</option>
              </select>
            </div>

            <FormField
              label="Body Type"
              name="bodyType"
              defaultValue={vehicle.bodyType ?? ""}
            />

            <FormField
              label="Fuel Type"
              name="fuelType"
              defaultValue={vehicle.fuelType ?? ""}
            />

            <FormField
              label="Transmission"
              name="transmission"
              defaultValue={vehicle.transmission ?? ""}
            />

            <FormField
              label="Drive Type"
              name="driveType"
              defaultValue={vehicle.driveType ?? ""}
            />

            <FormField
              label="Color"
              name="color"
              defaultValue={vehicle.color ?? ""}
            />

            <div className="flex items-center gap-3 pt-8">
              <input
                id="featured"
                name="featured"
                type="checkbox"
                defaultChecked={vehicle.featured}
                className="h-4 w-4 rounded border-[#E8E8E2]"
              />

              <label
                htmlFor="featured"
                className="text-sm font-medium text-[#111827]"
              >
                Feature this vehicle
              </label>
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium text-[#111827]"
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                defaultValue={vehicle.status}
                className="w-full rounded-lg border border-[#E8E8E2] bg-white px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#C9A227]"
              >
                <option value="AVAILABLE">Available</option>
                <option value="RESERVED">Reserved</option>
                <option value="SOLD">Sold</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-[#111827]"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={6}
                defaultValue={vehicle.description ?? ""}
                className="w-full resize-y rounded-lg border border-[#E8E8E2] bg-white px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#C9A227]"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-[#E8E8E2] pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/admin/vehicles"
              className="inline-flex items-center justify-center rounded-lg border border-[#E8E8E2] px-5 py-3 text-sm font-semibold text-[#111827] hover:bg-[#F7F7F3]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-[#0B1220] px-5 py-3 text-sm font-semibold"
              style={{ color: "#ffffff" }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function FormField({
  label,
  name,
  type = "text",
  defaultValue,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-[#111827]"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        min={type === "number" ? "0" : undefined}
        className="w-full rounded-lg border border-[#E8E8E2] bg-white px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#C9A227]"
      />
    </div>
  );
}