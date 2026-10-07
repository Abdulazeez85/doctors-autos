import Link from "next/link";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Inventory", href: "/inventory" },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/reviews" },
  { label: "Blog", href: "/blog" },
];
   
export function Navbar() { 
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
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

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
         <Link
  href="/inventory"
  className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold transition-all hover:bg-primary/90 hover:shadow-lg"
  style={{ color: "#ffffff" }}
>
  View Inventory
</Link>
      </div>
    </header>
  );
}