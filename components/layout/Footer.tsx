
import Link from "next/link";
import { MessageCircle } from "lucide-react";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Inventory", href: "/inventory" },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/reviews" },
  { label: "Blog", href: "/blog" },
];

type FooterProps = {
  businessName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  logo: string;
};

export function Footer({
  businessName,
  tagline,
  phone,
  whatsapp,
  email,
  address,
  instagram,
  facebook,
  logo,
}: FooterProps) {
  const whatsappDigits = whatsapp.replace(/\D/g, "");
  const whatsappNumber = whatsappDigits.startsWith("0")
    ? `234${whatsappDigits.slice(1)}`
    : whatsappDigits;

  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : undefined;

  const phoneHref = phone
    ? `tel:${phone.replace(/[^\d+]/g, "")}`
    : undefined;

  const socialLinkClass =
    "flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all hover:border-secondary/50 hover:bg-secondary hover:text-secondary-foreground";

  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo}
                  alt={`${businessName} logo`}
                  className="h-10 w-10 rounded-full bg-white object-contain"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                  DA
                </div>
              )}

              <div>
                <p className="font-bold">{businessName}</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                  {address || "Nigeria"}
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-sm text-sm leading-6 text-white/55">
              {tagline ||
                "Quality vehicles, dependable service, and a buying experience built around confidence."}
            </p>

            {/* Social Media */}
            <div className="mt-7 flex items-center gap-3">
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className={socialLinkClass}
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              )}

              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className={socialLinkClass}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle
                      cx="17.5"
                      cy="6.5"
                      r=".5"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              )}

              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className={socialLinkClass}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M14 8h3V4h-3c-3.31 0-5 1.69-5 5v3H6v4h3v8h4v-8h3.5l.5-4H13V9c0-.67.33-1 1-1Z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              Explore
            </h3>

            <nav className="mt-5 flex flex-col gap-3">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-white/60 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              Contact
            </h3>

            <div className="mt-5 space-y-3 text-sm text-white/60">
              {phone && phoneHref && (
                <a
                  href={phoneHref}
                  className="block transition-colors hover:text-white"
                >
                  {phone}
                </a>
              )}

              {email && (
                <a
                  href={`mailto:${email}`}
                  className="block break-all transition-colors hover:text-white"
                >
                  {email}
                </a>
              )}

              {address && <p>{address}</p>}
            </div>

            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                WhatsApp Us
              </a>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-3 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {businessName}. All rights reserved.
            </p>

            <p>{tagline || "Quality vehicles. Confident journeys."}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
