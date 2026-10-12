
"use server";

import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
    return {
      status: "error",
      message: "We couldn't process your review right now. Please try again later.",
    };
  }

  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  const ip =
    requestHeaders.get("x-real-ip") ??
    forwardedFor?.split(",")[0]?.trim() ??
    (process.env.NODE_ENV === "development" ? "local-development" : null);

  if (!ip) {
    return {
      status: "error",
      message: "We couldn't verify your submission. Please try again later.",
    };
  }

  const ipHash = createHmac("sha256", secret).update(ip).digest("hex");
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  try {
    await prisma.$transaction(async (tx) => {
      // Serialize submissions sharing this IP hash across server instances.
      // PostgreSQL advisory locks are scoped to this transaction.
      
await tx.$queryRaw`
  SELECT 1
  FROM (
    SELECT pg_advisory_xact_lock(
      hashtextextended(${ipHash}, 0)
    )
  ) AS lock_result
`; 



      const recentSubmissions = await tx.reviewSubmissionAttempt.count({
        where: {
          ipHash,
          createdAt: { gte: oneHourAgo },
        },
      });

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

      await tx.reviewSubmissionAttempt.create({
        data: { ipHash },
      });
    });

    revalidatePath("/");
    revalidatePath("/reviews");
    revalidatePath("/admin/reviews");

    return { status: "success", message: successMessage };
 
  } catch (error) {
    if (error instanceof Error && error.message === "REVIEW_RATE_LIMIT") {
      return {
        status: "error",
        message: "You've reached the review submission limit. Please try again later.",
      };
    }

    console.error("[Review Submission] Failed:", {
      errorName: error instanceof Error ? error.name : "UnknownError",
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      errorCode:
        typeof error === "object" &&
        error !== null &&
        "code" in error
          ? error.code
          : undefined,
    });

    return {
      status: "error",
      message: "We couldn't save your review right now. Please try again later.",
    };
  }
}


