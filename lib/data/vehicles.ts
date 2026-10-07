import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

type InventoryFilters = {
  search?: string;
  make?: string;
  condition?: "NEW" | "USED";
  bodyType?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price-asc" | "price-desc";
};

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

export async function getInventoryVehicles(filters: InventoryFilters = {}) {
  const {
    search,
    make,
    condition,
    bodyType,
    minPrice,
    maxPrice,
    sort = "newest",
  } = filters;

  const where: Prisma.VehicleWhereInput = {
    status: "AVAILABLE",
  };

  if (search) {
    where.OR = [
      {
        make: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        model: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (make) {
    where.make = {
      equals: make,
      mode: "insensitive",
    };
  }

  if (condition) {
    where.condition = condition;
  }

  if (bodyType) {
    where.bodyType = {
      equals: bodyType,
      mode: "insensitive",
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};

    if (minPrice !== undefined) {
      where.price.gte = minPrice;
    }

    if (maxPrice !== undefined) {
      where.price.lte = maxPrice;
    }
  }

  let orderBy: Prisma.VehicleOrderByWithRelationInput = {
    createdAt: "desc",
  };

  if (sort === "price-asc") {
    orderBy = {
      price: "asc",
    };
  }

  if (sort === "price-desc") {
    orderBy = {
      price: "desc",
    };
  }

  return prisma.vehicle.findMany({
    where,
    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
        take: 1,
      },
    },
    orderBy,
  });
}
export async function getInventoryFilterOptions() {
  const [makes, bodyTypes] = await Promise.all([
    prisma.vehicle.findMany({
      where: {
        status: "AVAILABLE",
      },
      select: {
        make: true,
      },
      distinct: ["make"],
      orderBy: {
        make: "asc",
      },
    }),

    prisma.vehicle.findMany({
      where: {
        status: "AVAILABLE",
        bodyType: {
          not: null,
        },
      },
      select: {
        bodyType: true,
      },
      distinct: ["bodyType"],
      orderBy: {
        bodyType: "asc",
      },
    }),
  ]);

  return {
    makes: makes.map((vehicle) => vehicle.make),
    bodyTypes: bodyTypes
      .map((vehicle) => vehicle.bodyType)
      .filter((bodyType): bodyType is string => bodyType !== null),
  };
}