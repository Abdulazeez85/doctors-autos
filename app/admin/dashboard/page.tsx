
import Link from "next/link";
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
    <main className="min-h-screen bg-[#F7F7F3] px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
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

          <Link
  href="/admin/vehicles"
  className="inline-flex items-center justify-center rounded-lg border-2 border-[#0B1220] bg-[#0B1220] px-5 py-3 text-sm font-bold text-white shadow-md transition-colors hover:border-[#C9A227] hover:bg-[#1B2A42]"
  style={{ color: "#FFFFFF" }}
>
  Manage Vehicles
</Link>
        </header>

        {/* Navigation */}
        <nav
          aria-label="Admin navigation"
          className="mt-8 flex flex-wrap gap-3 border-b border-[#E8E8E2] pb-6"
        >
          <Link
  href="/admin/dashboard"
  className="inline-flex items-center justify-center rounded-lg border-2 border-[#0B1220] bg-[#0B1220] px-4 py-2.5 text-sm font-bold shadow-sm"
  style={{ color: "#FFFFFF" }}
>
  Dashboard
</Link>

          <Link
            href="/admin/vehicles"
            className="rounded-lg border border-[#E8E8E2] bg-white px-4 py-2.5 text-sm font-semibold text-[#111827] hover:border-[#C9A227]"
          >
            Vehicles
          </Link>
        </nav>

        {/* Inventory statistics */}
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-[#111827]">
            Inventory
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Vehicles" value={stats.vehicles.total} />
            <StatCard label="Available" value={stats.vehicles.available} />
            <StatCard label="Reserved" value={stats.vehicles.reserved} />
            <StatCard label="Sold" value={stats.vehicles.sold} />
          </div>

          <Link
            href="/admin/vehicles"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#111827] hover:text-[#9A7715]"
          >
            View and manage inventory <span aria-hidden="true">→</span>
          </Link>
        </section>

        {/* Content statistics */}
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-[#111827]">
            Content overview
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Reviews" value={stats.reviews.total} />
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
      <p className="mt-2 text-3xl font-bold text-[#111827]">{value}</p>
    </div>
  );
}