
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  if (session.user.role !== "ADMIN") {
    throw new Error("Forbidden: administrator access required.");
  }

  return session.user;
}
