"use server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export async function setReviewPublished(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }
  const id = String(formData.get("id") ?? "").trim();
  const publishedValue = String(formData.get("published") ?? "");
  if (!id || !["true", "false"].includes(publishedValue)) {
    throw new Error("Invalid review update request.");
  }
  await prisma.review.update({
    where: { id },
    data: { published: publishedValue === "true" },
  });
  revalidatePath("/");
  revalidatePath("/reviews");
  revalidatePath("/admin/reviews");
  revalidatePath("/admin/dashboard");
}

