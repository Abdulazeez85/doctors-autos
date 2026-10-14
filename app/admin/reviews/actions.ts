
"use server";

import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function revalidateReviewPages() {
  revalidatePath("/");
  revalidatePath("/reviews");
  revalidatePath("/admin/reviews");
  revalidatePath("/admin/dashboard");
}

export async function setReviewPublished(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const publishedValue = String(formData.get("published") ?? "");

  if (!id || !["true", "false"].includes(publishedValue)) {
    throw new Error("Invalid review update request.");
  }

  await prisma.review.update({
    where: { id },
    data: { published: publishedValue === "true" },
  });

  revalidateReviewPages();
}

export async function deleteReview(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    throw new Error("Invalid review deletion request.");
  }

  await prisma.review.delete({
    where: { id },
  });

  revalidateReviewPages();
}
