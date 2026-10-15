"use server";

import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const defaultSettings = {
  businessName: "Doctor's Autos",
  tagline: "",
  phone: "08113545998",
  whatsapp: "08113545998",
  email: "thequantumdeveloper1@gmail.com",
  address: "Ilorin, Kwara State",
  instagram: "",
  facebook: "",
  logo: "",
};

export async function getOrCreateSiteSettings() {
  await requireAdmin();

  return prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      ...defaultSettings,
    },
  });
}

export async function saveSiteSettings(formData: FormData) {
  await requireAdmin();

  const businessName = String(
    formData.get("businessName") ?? "",
  ).trim();
  const tagline = String(formData.get("tagline") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const instagram = String(formData.get("instagram") ?? "").trim();
  const facebook = String(formData.get("facebook") ?? "").trim();
  const logo = String(formData.get("logo") ?? "").trim();

  if (!businessName) {
    throw new Error("Business name is required.");
  }

  if (businessName.length > 100) {
    throw new Error("Business name must be 100 characters or fewer.");
  }

  if (tagline.length > 200) {
    throw new Error("Tagline must be 200 characters or fewer.");
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email address.");
  }

  const settingsData = {
    businessName,
    tagline: tagline || null,
    phone: phone || null,
    whatsapp: whatsapp || null,
    email: email || null,
    address: address || null,
    instagram: instagram || null,
    facebook: facebook || null,
    logo: logo || null,
  };

  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: settingsData,
    create: {
      id: "main",
      ...settingsData,
    },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/blog");
  revalidatePath("/inventory");
  revalidatePath("/reviews");
}
