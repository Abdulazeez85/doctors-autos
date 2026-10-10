"use server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  uploadVehicleImages,
  deleteUploadedVehicleImages,
} from "@/lib/vehicle-images";
function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
export async function createVehicle(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }
  const make = String(formData.get("make") ?? "").trim();
  const model = String(formData.get("model") ?? "").trim();
  const year = Number(formData.get("year"));
  const price = Number(formData.get("price"));
  const mileageValue = String(formData.get("mileage") ?? "").trim();
  const mileage = mileageValue ? Number(mileageValue) : null;
  const condition =
    formData.get("condition") === "NEW" ? "NEW" : "USED";
  const bodyType = String(formData.get("bodyType") ?? "").trim() || null;
  const fuelType = String(formData.get("fuelType") ?? "").trim() || null;
  const transmission =
    String(formData.get("transmission") ?? "").trim() || null;
  const driveType =
    String(formData.get("driveType") ?? "").trim() || null;
  const color = String(formData.get("color") ?? "").trim() || null;
  const description =
    String(formData.get("description") ?? "").trim() || null;
  const featured = formData.get("featured") === "on";
  if (!make || !model) {
    throw new Error("Make and model are required.");
  }
  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    throw new Error("Please enter a valid vehicle year.");
  }
  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Please enter a valid vehicle price.");
  }
  if (
    mileage !== null &&
    (!Number.isInteger(mileage) || mileage < 0)
  ) {
    throw new Error("Please enter a valid mileage.");
  }
  const baseSlug = slugify(`${make}-${model}-${year}`);
  let slug = baseSlug;
  const existingVehicle = await prisma.vehicle.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (existingVehicle) {
    slug = `${baseSlug}-${Date.now()}`;
  }
  const uploadedImages = await uploadVehicleImages(formData);
  try {
    await prisma.vehicle.create({
      data: {
        slug,
        make,
        model,
        year,
        price,
        mileage,
        condition,
        bodyType,
        fuelType,
        transmission,
        driveType,
        color,
        description,
        featured,
        status: "AVAILABLE",
        images: {
          create: uploadedImages.map((image, index) => ({
            url: image.url,
            publicId: image.publicId,
            sortOrder: index,
          })),
        },
      },
    });
  } catch (error) {
    await deleteUploadedVehicleImages(uploadedImages);
    console.error("Vehicle creation failed:", error);
    throw new Error(
      "Could not create the vehicle. Please check your details and try again.",
    );
  }
  redirect("/admin/vehicles");
}
export async function updateVehicle(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }
  const id = String(formData.get("id") ?? "").trim();
  const make = String(formData.get("make") ?? "").trim();
  const model = String(formData.get("model") ?? "").trim();
  const year = Number(formData.get("year"));
  const price = Number(formData.get("price"));
  const mileageValue = String(formData.get("mileage") ?? "").trim();
  const mileage = mileageValue ? Number(mileageValue) : null;
  const condition =
    formData.get("condition") === "NEW" ? "NEW" : "USED";
  const statusValue = String(formData.get("status") ?? "AVAILABLE");
  const status =
    statusValue === "SOLD"
      ? "SOLD"
      : statusValue === "RESERVED"
        ? "RESERVED"
        : "AVAILABLE";
  const bodyType = String(formData.get("bodyType") ?? "").trim() || null;
  const fuelType = String(formData.get("fuelType") ?? "").trim() || null;
  const transmission =
    String(formData.get("transmission") ?? "").trim() || null;
  const driveType =
    String(formData.get("driveType") ?? "").trim() || null;
  const color = String(formData.get("color") ?? "").trim() || null;
  const description =
    String(formData.get("description") ?? "").trim() || null;
  const featured = formData.get("featured") === "on";
  if (!id) {
    throw new Error("Vehicle ID is required.");
  }
  if (!make || !model) {
    throw new Error("Make and model are required.");
  }
  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    throw new Error("Please enter a valid vehicle year.");
  }
  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Please enter a valid vehicle price.");
  }
  if (
    mileage !== null &&
    (!Number.isInteger(mileage) || mileage < 0)
  ) {
    throw new Error("Please enter a valid mileage.");
  }
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!vehicle) {
    throw new Error("Vehicle not found.");
  }
  await prisma.vehicle.update({
    where: { id },
    data: {
      make,
      model,
      year,
      price,
      mileage,
      condition,
      bodyType,
      fuelType,
      transmission,
      driveType,
      color,
      description,
      featured,
      status,
    },
  });
  redirect("/admin/vehicles");
}
export async function deleteVehicle(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    throw new Error("Vehicle ID is required.");
  }
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!vehicle) {
    throw new Error("Vehicle not found.");
  }
  await prisma.vehicle.delete({
    where: { id },
  });
  redirect("/admin/vehicles");
}
