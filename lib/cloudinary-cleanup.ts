
import "server-only";

import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

const MAX_JOBS_PER_RUN = 20;

export async function processPendingCloudinaryDeletions(): Promise<void> {
  let jobs;

  try {
    jobs = await prisma.pendingCloudinaryDeletion.findMany({
      orderBy: { createdAt: "asc" },
      take: MAX_JOBS_PER_RUN,
    });
  } catch (error) {
    console.error("Could not load Cloudinary cleanup queue:", error);
    return;
  }

  for (const job of jobs) {
    try {
      const result = await cloudinary.uploader.destroy(job.publicId, {
        resource_type: "image",
      });

      // "not found" is also success: the asset is already gone.
      if (result.result !== "ok" && result.result !== "not found") {
        throw new Error(`Cloudinary returned: ${result.result}`);
      }

      await prisma.pendingCloudinaryDeletion.deleteMany({
        where: { id: job.id },
      });

      console.info("Cloudinary cleanup completed:", job.publicId);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message.slice(0, 1000)
          : "Unknown Cloudinary deletion error";

      console.error(
        `Cloudinary cleanup failed for ${job.publicId}:`,
        message,
      );

      try {
        await prisma.pendingCloudinaryDeletion.updateMany({
          where: { id: job.id },
          data: {
            attempts: { increment: 1 },
            lastAttemptAt: new Date(),
            lastError: message,
          },
        });
      } catch (queueError) {
        console.error(
          "Could not update Cloudinary cleanup queue:",
          queueError,
        );
      }
    }
  }
}
