import { prisma } from "@/lib/prisma";

export async function getFeaturedVehicles() {
  return prisma.vehicle.findMany({
    where: {
      featured: true,
      status: "AVAILABLE",
    },
    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAvailableVehicles() {
  return prisma.vehicle.findMany({
    where: {
      status: "AVAILABLE",
    },
    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getVehicleBySlug(slug: string) {
  return prisma.vehicle.findUnique({
    where: {
      slug,
    },
    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
}