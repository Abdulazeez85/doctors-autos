
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createVehicle } from "../actions";

export default async function NewVehiclePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
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
            Add Vehicle
          </h1>

          <p className="mt-2 text-[#6B7280]">
            Add a vehicle to your dealership inventory.
          </p>
        </div>

        <form
          action={createVehicle}
          className="mt-8 rounded-2xl border border-[#E8E8E2] bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              label="Make"
              name="make"
              placeholder="Toyota"
              required
            />

            <FormField
              label="Model"
              name="model"
              placeholder="Camry"
              required
            />

            <FormField
              label="Year"
              name="year"
              type="number"
              placeholder="2023"
              required
            />

            <FormField
              label="Price (₦)"
              name="price"
              type="number"
              placeholder="28500000"
              required
            />

            <FormField
              label="Mileage (km)"
              name="mileage"
              type="number"
              placeholder="32000"
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
                defaultValue="USED"
                className="w-full rounded-lg border border-[#E8E8E2] bg-white px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#C9A227]"
              >
                <option value="USED">Used</option>
                <option value="NEW">New</option>
              </select>
            </div>

            <FormField
              label="Body Type"
              name="bodyType"
              placeholder="SUV"
            />

            <FormField
              label="Fuel Type"
              name="fuelType"
              placeholder="Petrol"
            />

            <FormField
              label="Transmission"
              name="transmission"
              placeholder="Automatic"
            />

            <FormField
              label="Drive Type"
              name="driveType"
              placeholder="AWD"
            />

            <FormField
              label="Color"
              name="color"
              placeholder="Black"
            />

            <div className="flex items-center gap-3 pt-8">
              <input
                id="featured"
                name="featured"
                type="checkbox"
                className="h-4 w-4 rounded border-[#E8E8E2]"
              />

              <label
                htmlFor="featured"
                className="text-sm font-medium text-[#111827]"
              >
                Feature this vehicle
              </label>
            </div>

            {/* Vehicle photo upload */}
            <div className="sm:col-span-2">
              <label
                htmlFor="images"
                className="mb-2 block text-sm font-medium text-[#111827]"
              >
                Vehicle Photos
              </label>

              <input
                id="images"
                name="images"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="w-full rounded-lg border border-[#E8E8E2] bg-white px-4 py-3 text-sm text-[#111827] file:mr-4 file:rounded-md file:border-0 file:bg-[#F7F7F3] file:px-3 file:py-2 file:text-sm file:font-semibold"
              />

              <p className="mt-2 text-xs text-[#6B7280]">
                Select up to 10 photos. JPEG, PNG, or WebP;
                maximum 5 MB per photo.
              </p>
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
                placeholder="Describe the vehicle..."
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
              Create Vehicle
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
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
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
        placeholder={placeholder}
        required={required}
        min={type === "number" ? "0" : undefined}
        className="w-full rounded-lg border border-[#E8E8E2] bg-white px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#C9A227]"
      />
    </div>
  );
}
