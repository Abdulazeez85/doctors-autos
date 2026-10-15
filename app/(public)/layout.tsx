
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "main" },
  });

  const businessName = settings?.businessName ?? "Doctor's Autos";
  const address = settings?.address ?? "Ilorin, Kwara State, Nigeria";

  return (
    <>
      <Navbar businessName={businessName} address={address} />

      {children}

      <Footer
        businessName={businessName}
        tagline={settings?.tagline ?? ""}
        phone={settings?.phone ?? ""}
        whatsapp={settings?.whatsapp ?? ""}
        email={settings?.email ?? ""}
        address={address}
        instagram={settings?.instagram ?? ""}
        facebook={settings?.facebook ?? ""}
        logo={settings?.logo ?? ""}
      />
    </>
  );
}
