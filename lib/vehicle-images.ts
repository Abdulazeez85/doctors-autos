
import "server-only";

import { auth } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGES = 10;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export type UploadedVehicleImage = {
  url: string;
  publicId: string;
};

export async function uploadVehicleImages(
  formData: FormData,
): Promise<UploadedVehicleImage[]> {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const files = formData
    .getAll("images")
    .filter(
      (item): item is File =>
        item instanceof File && item.size > 0,
    );

  if (files.length === 0) {
    return [];
  }

  if (files.length > MAX_IMAGES) {
    throw new Error(`You can upload a maximum of ${MAX_IMAGES} images.`);
  }

  for (const file of files) {
    if (!ALLOWED_TYPES.has(file.type)) {
      throw new Error("Only JPEG, PNG, and WebP images are allowed.");
    }

    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error("Each image must be 5 MB or smaller.");
    }
  }

  const uploaded: UploadedVehicleImage[] = [];

  try {
    for (const file of files) {
      const bytes = Buffer.from(await file.arrayBuffer());

      const result = await new Promise<{
        secure_url: string;
        public_id: string;
      }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "doctors-autos/vehicles",
            resource_type: "image",
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
          },
          (error, result) => {
            if (error || !result) {
              reject(error ?? new Error("Cloudinary upload failed."));
              return;
            }

            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          },
        );

        stream.end(bytes);
      });

      uploaded.push({
        url: result.secure_url,
        publicId: result.public_id,
      });
    }

    return uploaded;
  } catch (error) {
    await deleteUploadedVehicleImages(uploaded);

    console.error("Vehicle image upload failed:", error);

    throw new Error("Image upload failed. Please try again.");
  }
}

export async function deleteUploadedVehicleImages(
  images: Pick<UploadedVehicleImage, "publicId">[],
): Promise<void> {
  const results = await Promise.allSettled(
    images.map(async (image) => {
      const result = await cloudinary.uploader.destroy(
        image.publicId,
        { resource_type: "image" },
      );

      if (
        result.result !== "ok" &&
        result.result !== "not found"
      ) {
        throw new Error(`Cloudinary returned: ${result.result}`);
      }
    }),
  );

  const failedDeletions: {
    publicId: string;
    error: string;
  }[] = [];

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      failedDeletions.push({
        publicId: images[index].publicId,
        error:
          result.reason instanceof Error
            ? result.reason.message.slice(0, 1000)
            : "Unknown Cloudinary deletion error",
      });
    }
  });

  if (failedDeletions.length === 0) {
    return;
  }

  try {
    await prisma.pendingCloudinaryDeletion.createMany({
      data: failedDeletions.map((item) => ({
        publicId: item.publicId,
        attempts: 1,
        lastAttemptAt: new Date(),
        lastError: item.error,
      })),
      skipDuplicates: true,
    });
  } catch (error) {
    console.error(
      "Could not queue failed Cloudinary deletions:",
      error,
    );

    console.error(
      "Cloudinary assets may require manual cleanup:",
      failedDeletions.map((item) => item.publicId),
    );
  }
}
