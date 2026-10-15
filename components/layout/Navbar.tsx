
"use client";

import { useState } from "react";
import Link from "next/link";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Inventory", href: "/inventory" },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/reviews" },
  { label: "Blog", href: "/blog" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-bold tracking-wide text-white transition-transform group-hover:scale-105">
            DA
          </div>

          <div className="hidden sm:block">
            <p className="text-base font-bold tracking-tight text-primary">
              Doctor&apos;s Autos
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
              Ilorin, Nigeria
            </p>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Main navigation"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop View Inventory button */}
        <Link
          href="/inventory"
          className="hidden items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold !text-white shadow-md transition-all hover:bg-primary/90 hover:shadow-lg md:inline-flex"
        >
          View Inventory
        </Link>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-border/70 bg-background px-6 py-4 md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/20 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile View Inventory button */}
            <Link
              href="/inventory"
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold !text-white shadow-md transition-colors hover:bg-primary/90"
            >
              View Inventory
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
