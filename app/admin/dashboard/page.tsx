import { auth } from "@/lib/auth";
import { getAdminDashboardStats } from "@/lib/data/admin";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const stats = await getAdminDashboardStats();

  return (
    <main className="min-h-screen bg-[#F7F7F3] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C9A227]">
            Doctor&apos;s Autos
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#111827]">
            Admin Dashboard
          </h1>

          <p className="mt-3 text-[#6B7280]">
            Welcome back, {session.user.name ?? session.user.email}.
          </p>
        </div>

        {/* Vehicles */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-[#111827]">
            Inventory
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Vehicles"
              value={stats.vehicles.total}
            />

            <StatCard
              label="Available"
              value={stats.vehicles.available}
            />

            <StatCard
              label="Reserved"
              value={stats.vehicles.reserved}
            />

            <StatCard
              label="Sold"
              value={stats.vehicles.sold}
            />
          </div>
        </section>

        {/* Content */}
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-[#111827]">
            Content
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Reviews"
              value={stats.reviews.total}
            />

            <StatCard
              label="Published Reviews"
              value={stats.reviews.published}
            />

            <StatCard
              label="Total Blog Posts"
              value={stats.blogPosts.total}
            />

            <StatCard
              label="Published Posts"
              value={stats.blogPosts.published}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-[#E8E8E2] bg-white p-5 shadow-sm">
      <p className="text-sm text-[#6B7280]">{label}</p>

      <p className="mt-2 text-3xl font-bold text-[#111827]">
        {value}
      </p>
    </div>
  );
}