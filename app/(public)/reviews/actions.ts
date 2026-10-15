
"use server";

import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export type ReviewFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

const successMessage =
  "Thanks for sharing your experience. Your review will be checked before it appears on our website.";

const reviewSchema = z.object({
  customerName: z.string().trim().min(2).max(80),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(10).max(2000),
});

export async function submitReview(
  _previousState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  // Honeypot: silently accept bot submissions without saving them.
  if (String(formData.get("website") ?? "").trim()) {
    return { status: "success", message: successMessage };
  }

  const parsed = reviewSchema.safeParse({
    customerName: formData.get("customerName"),
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message:
        parsed.error.issues[0]?.message ??
        "Please check your review and try again.",
    };
  }

  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    console.error("[Review Submission] AUTH_SECRET is missing.");

    return {
      status: "error",
      message:
        "We couldn't process your review right now. Please try again later.",
    };
  }

  let ipHash: string;

  try {
    const requestHeaders = await headers();
    const forwardedFor = requestHeaders.get("x-forwarded-for");

    const ip =
      requestHeaders.get("x-real-ip") ??
      forwardedFor?.split(",")[0]?.trim() ??
      (process.env.NODE_ENV === "development"
        ? "local-development"
        : null);

    if (!ip) {
      console.error("[Review Submission] Client IP could not be determined.");

      return {
        status: "error",
        message: "We couldn't verify your submission. Please try again later.",
      };
    }

    ipHash = createHmac("sha256", secret).update(ip).digest("hex");
  } catch (error) {
    console.error("[Review Submission] Request identification failed:", {
      errorName: error instanceof Error ? error.name : "UnknownError",
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });

    return {
      status: "error",
      message: "We couldn't process your review right now. Please try again later.",
    };
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  try {
    console.error("[Review Submission] Starting database transaction.");

    await prisma.$transaction(async (tx) => {
      console.error("[Review Submission] Transaction started.");

      console.error("[Review Submission] Acquiring advisory lock.");

      await tx.$queryRaw`
        SELECT 1
        FROM (
          SELECT pg_advisory_xact_lock(
            hashtextextended(${ipHash}, 0)
          )
        ) AS lock_result
      `;

      console.error("[Review Submission] Advisory lock acquired.");

      const recentSubmissions = await tx.reviewSubmissionAttempt.count({
        where: {
          ipHash,
          createdAt: {
            gte: oneHourAgo,
          },
        },
      });

      console.error("[Review Submission] Rate-limit count completed.");

      if (recentSubmissions >= 3) {
        throw new Error("REVIEW_RATE_LIMIT");
      }

      await tx.review.create({
        data: {
          customerName: parsed.data.customerName,
          rating: parsed.data.rating,
          comment: parsed.data.comment,
          published: false,
        },
      });

      console.error("[Review Submission] Review inserted.");

      await tx.reviewSubmissionAttempt.create({
        data: { ipHash },
      });

      console.error("[Review Submission] Rate-limit record inserted.");
    });

    console.error("[Review Submission] Database transaction committed.");

    revalidatePath("/");
    revalidatePath("/reviews");
    revalidatePath("/admin/reviews");
    revalidatePath("/admin/dashboard");

    console.error("[Review Submission] Paths revalidated.");

    return {
      status: "success",
      message: successMessage,
    };
  } catch (error) {
    if (error instanceof Error && error.message === "REVIEW_RATE_LIMIT") {
      return {
        status: "error",
        message:
          "You've reached the review submission limit. Please try again later.",
      };
    }

    console.error("[Review Submission] Failed:", {
      errorName: error instanceof Error ? error.name : "UnknownError",
      errorMessage:
        error instanceof Error ? error.message : "Unknown error",
      errorCode:
        typeof error === "object" &&
        error !== null &&
        "code" in error
          ? String(error.code)
          : undefined,
    });

    return {
      status: "error",
      message: "We couldn't save your review right now. Please try again later.",
    };
  }
}
