
import Link from "next/link";
import { requireAdmin } from "@/lib/require-admin";
import { getOrCreateSiteSettings, saveSiteSettings } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await requireAdmin();

  const settings = await getOrCreateSiteSettings();

  return (
    <main className="min-h-screen bg-[#F7F7F3] px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/dashboard"
          className="text-sm font-semibold text-[#6B7280] hover:text-[#111827]"
        >
          ← Back to Dashboard
        </Link>

        <header className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9A7B19]">
            Doctor&apos;s Autos
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#111827]">
            Settings
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#6B7280]">
            Manage your dealership information and website preferences.
          </p>
        </header>

        <form
          action={saveSiteSettings}
          className="mt-8 space-y-8 rounded-2xl border border-[#E8E8E2] bg-white p-6 sm:p-8"
        >
          <section>
            <h2 className="text-lg font-bold text-[#111827]">
              Business Information
            </h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              These details identify your dealership and help customers contact
              you.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field
                label="Business name"
                name="businessName"
                defaultValue={settings.businessName}
                required
              />
              <Field
                label="Tagline"
                name="tagline"
                defaultValue={settings.tagline ?? ""}
                placeholder="Your dealership tagline"
              />
              <Field
                label="Phone number"
                name="phone"
                defaultValue={settings.phone ?? ""}
                placeholder="08113545998"
              />
              <Field
                label="WhatsApp number"
                name="whatsapp"
                defaultValue={settings.whatsapp ?? ""}
                placeholder="08113545998"
              />
              <Field
                label="Business email"
                name="email"
                inputType="email"
                defaultValue={settings.email ?? ""}
                placeholder="you@example.com"
              />
              <Field
                label="Business address"
                name="address"
                defaultValue={settings.address ?? ""}
                placeholder="City, State"
              />
            </div>
          </section>

          <div className="border-t border-[#E8E8E2]" />

          <section>
            <h2 className="text-lg font-bold text-[#111827]">
              Website Branding
            </h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              Add your social media links and logo URL.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field
                label="Instagram URL"
                name="instagram"
                inputType="url"
                defaultValue={settings.instagram ?? ""}
                placeholder="https://instagram.com/your-account"
              />
              <Field
                label="Facebook URL"
                name="facebook"
                inputType="url"
                defaultValue={settings.facebook ?? ""}
                placeholder="https://facebook.com/your-page"
              />
              <div className="sm:col-span-2">
                <Field
                  label="Logo image URL"
                  name="logo"
                  inputType="url"
                  defaultValue={settings.logo ?? ""}
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#E8E8E2] pt-6">
            <p className="text-sm text-[#6B7280]">
              Changes are saved to your dealership database.
            </p>
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#0B1220] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1B2A42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B19] focus-visible:ring-offset-2"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  inputType = "text",
  required = false,
}: {
  label: string;
  name: string;
  defaultValue: string;
  placeholder?: string;
  inputType?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-[#111827]"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={inputType}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        maxLength={name === "businessName" ? 100 : 200}
        className="min-h-11 w-full rounded-lg border border-[#D1D5DB] bg-white px-4 py-2.5 text-sm text-[#111827] outline-none transition focus:border-[#9A7B19] focus:ring-2 focus:ring-[#9A7B19]/20"
      />
    </div>
  );
}
