
"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  uploadVehicleImages,
  deleteUploadedVehicleImages,
} from "@/lib/vehicle-images";
import { processPendingCloudinaryDeletions } from "@/lib/cloudinary-cleanup";

const MAX_IMAGES = 10;

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

  revalidatePath("/");
  revalidatePath("/inventory");
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
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!vehicle) {
    throw new Error("Vehicle not found.");
  }

  // Read the photo-removal selections from the edit form.
  const requestedRemovalIds = [
    ...new Set(
      formData
        .getAll("removeImageIds")
        .map((value) => String(value).trim())
        .filter(Boolean),
    ),
  ];

  const removalIdSet = new Set(requestedRemovalIds);

  const imagesToRemove = vehicle.images.filter((image) =>
    removalIdSet.has(image.id),
  );

  // Do not accept image IDs belonging to another vehicle.
  if (imagesToRemove.length !== requestedRemovalIds.length) {
    throw new Error("Invalid photo selection. Please refresh and try again.");
  }

  const remainingImages = vehicle.images.filter(
    (image) => !removalIdSet.has(image.id),
  );

  const newFiles = formData
    .getAll("images")
    .filter(
      (item): item is File =>
        item instanceof File && item.size > 0,
    );

  // Validate the final gallery size before uploading anything.
  if (remainingImages.length + newFiles.length > MAX_IMAGES) {
    throw new Error(
      `A vehicle can have a maximum of ${MAX_IMAGES} photos. Remove existing photos or select fewer new photos.`,
    );
  }

  const uploadedImages = await uploadVehicleImages(formData);

  // Place new photos after the photos that will remain.
  const nextSortOrder =
    remainingImages.reduce(
      (highest, image) => Math.max(highest, image.sortOrder),
      -1,
    ) + 1;

  try {
    // Keep the vehicle changes and gallery changes in one DB transaction.
    await prisma.$transaction(async (tx) => {
      await tx.vehicle.update({
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

      if (requestedRemovalIds.length > 0) {
        await tx.vehicleImage.deleteMany({
          where: {
            vehicleId: id,
            id: { in: requestedRemovalIds },
          },
        });
      }

      if (uploadedImages.length > 0) {
        await tx.vehicleImage.createMany({
          data: uploadedImages.map((image, index) => ({
            vehicleId: id,
            url: image.url,
            publicId: image.publicId,
            sortOrder: nextSortOrder + index,
          })),
        });
      }
    });
  } catch (error) {
    // If the database update fails, remove the newly uploaded files.
    await deleteUploadedVehicleImages(uploadedImages);
    console.error("Vehicle update failed:", error);

    throw new Error(
      "Could not update the vehicle. Your existing photos have been preserved. Please try again.",
    );
  }

  // The database has committed. Now remove deleted photos from Cloudinary.
  // Images without a Cloudinary public ID are simply removed from the DB.
  await deleteUploadedVehicleImages(
    imagesToRemove
      .filter(
        (image): image is typeof image & { publicId: string } =>
          Boolean(image.publicId),
      )
      .map((image) => ({ publicId: image.publicId })),
  );

  revalidatePath("/");
  revalidatePath("/inventory");
  revalidatePath(`/inventory/${vehicle.slug}`);
  revalidatePath("/admin/vehicles");
  revalidatePath(`/admin/vehicles/${id}/edit`);

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

  await prisma.$transaction(async (tx) => {
    const vehicle = await tx.vehicle.findUnique({
      where: { id },
      include: {
        images: {
          select: {
            publicId: true,
          },
        },
      },
    });

    if (!vehicle) {
      throw new Error("Vehicle not found.");
    }

    const publicIds = [
      ...new Set(
        vehicle.images
          .map((image) => image.publicId)
          .filter((publicId): publicId is string => Boolean(publicId)),
      ),
    ];

    if (publicIds.length > 0) {
      await tx.pendingCloudinaryDeletion.createMany({
        data: publicIds.map((publicId) => ({ publicId })),
        skipDuplicates: true,
      });
    }

    await tx.vehicle.delete({
      where: { id },
    });
  });

  // Cloudinary failures are recorded for a later retry.
  await processPendingCloudinaryDeletions();

  revalidatePath("/");
  revalidatePath("/inventory");
  revalidatePath("/admin/vehicles");

  redirect("/admin/vehicles");
}
