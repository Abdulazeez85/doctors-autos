
import Image from "next/image";
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
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
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
            Update vehicle details and manage its photos.
          </p>
        </div>

        <form
          action={updateVehicle}
          encType="multipart/form-data"
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

            <SelectField
              label="Condition"
              name="condition"
              defaultValue={vehicle.condition}
              options={[
                { value: "USED", label: "Used" },
                { value: "NEW", label: "New" },
              ]}
            />

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

            <SelectField
              label="Status"
              name="status"
              defaultValue={vehicle.status}
              options={[
                { value: "AVAILABLE", label: "Available" },
                { value: "RESERVED", label: "Reserved" },
                { value: "SOLD", label: "Sold" },
              ]}
            />

            {/* Existing vehicle photos */}
            <div className="sm:col-span-2">
              <h2 className="text-base font-semibold text-[#111827]">
                Existing Photos ({vehicle.images.length})
              </h2>

              <p className="mt-1 text-sm text-[#6B7280]">
                Select the photos you want to remove.
              </p>

              {vehicle.images.length > 0 ? (
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {vehicle.images.map((image, index) => (
                    <div
                      key={image.id}
                      className="overflow-hidden rounded-xl border border-[#E8E8E2]"
                    >
                      <div className="relative aspect-[4/3] bg-[#F7F7F3]">
                        <Image
                          src={image.url}
                          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} photo ${index + 1}`}
                          fill
                          sizes="(max-width: 640px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>

                      <label className="flex items-center gap-2 p-3 text-sm text-[#111827]">
                        <input
                          type="checkbox"
                          name="removeImageIds"
                          value={image.id}
                          className="h-4 w-4 rounded border-[#E8E8E2]"
                        />
                        Remove photo
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 rounded-lg bg-[#F7F7F3] p-4 text-sm text-[#6B7280]">
                  No photos have been uploaded for this vehicle yet.
                </p>
              )}
            </div>

            {/* Add new photos */}
            <div className="sm:col-span-2">
              <label
                htmlFor="images"
                className="mb-2 block text-sm font-medium text-[#111827]"
              >
                Add New Photos
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
                JPEG, PNG, or WebP. Maximum 5 MB per photo.
                The gallery limit is 10 photos per vehicle.
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
                defaultValue={vehicle.description ?? ""}
                className="w-full resize-y rounded-lg border border-[#E8E8E2] bg-white px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#C9A227]"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-[#E8E8E2] pt-6 sm:flex-row sm:justify-between">
            <DeleteVehicleButton vehicleId={vehicle.id} />

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/admin/vehicles"
                className="inline-flex items-center justify-center rounded-lg border border-[#E8E8E2] px-5 py-3 text-sm font-semibold text-[#111827] hover:bg-[#F7F7F3]"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-[#0B1220] px-5 py-3 text-sm font-semibold text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-[#111827]"
      >
        {label}
      </label>

      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-[#E8E8E2] bg-white px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#C9A227]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
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
