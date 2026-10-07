import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#F7F7F3] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-[#E8E8E2] bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C9A227]">
            Doctor&apos;s Autos
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#111827]">
            Admin Dashboard
          </h1>

          <p className="mt-3 text-[#6B7280]">
            Welcome back, {session.user.name ?? session.user.email}.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-[#E8E8E2] bg-[#F7F7F3] p-5">
              <p className="text-sm text-[#6B7280]">Vehicles</p>
              <p className="mt-2 text-2xl font-bold text-[#111827]">—</p>
            </div>

            <div className="rounded-xl border border-[#E8E8E2] bg-[#F7F7F3] p-5">
              <p className="text-sm text-[#6B7280]">Reviews</p>
              <p className="mt-2 text-2xl font-bold text-[#111827]">—</p>
            </div>

            <div className="rounded-xl border border-[#E8E8E2] bg-[#F7F7F3] p-5">
              <p className="text-sm text-[#6B7280]">Blog Posts</p>
              <p className="mt-2 text-2xl font-bold text-[#111827]">—</p>
            </div>

            <div className="rounded-xl border border-[#E8E8E2] bg-[#F7F7F3] p-5">
              <p className="text-sm text-[#6B7280]">Status</p>
              <p className="mt-2 text-2xl font-bold text-[#111827]">
                Active
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}