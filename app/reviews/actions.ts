
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

const initialMessage =
  "Thanks for sharing your experience. Your review will be checked before it appears on our website.";

const reviewSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Please enter a name with at least 2 characters.")
    .max(80, "Your name must be 80 characters or fewer."),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters.")
    .max(2000, "Your review must be 2,000 characters or fewer."),
});

export async function submitReview(
  _previousState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const website = String(formData.get("website") ?? "").trim();

  // Hidden honeypot field: quietly ignore likely automated spam.
  if (website) {
    return { status: "success", message: initialMessage };
  }

  const parsed = reviewSchema.safeParse({
    customerName: formData.get("customerName"),
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please check your review and try again.",
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
    const recentSubmissions = await prisma.review.count({
      where: {
        ipHash,
        createdAt: { gte: oneHourAgo },
      },
    });

    if (recentSubmissions >= 3) {
      return {
        status: "error",
        message: "You've reached the review submission limit. Please try again in an hour.",
      };
    }

    await prisma.review.create({
      data: {
        customerName: parsed.data.customerName,
        rating: parsed.data.rating,
        comment: parsed.data.comment,
        published: false,
        ipHash,
      },
    });

    revalidatePath("/admin/reviews");

    return {
      status: "success",
      message: initialMessage,
    };
  } catch {
    return {
      status: "error",
      message: "We couldn't save your review right now. Please try again later.",
    };
  }
}
