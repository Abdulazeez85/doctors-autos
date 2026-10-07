import { prisma } from "@/lib/prisma";

export async function getAdminDashboardStats() {
  const [
    totalVehicles,
    availableVehicles,
    reservedVehicles,
    soldVehicles,
    totalReviews,
    publishedReviews,
    totalBlogPosts,
    publishedBlogPosts,
  ] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.count({
      where: { status: "AVAILABLE" },
    }),
    prisma.vehicle.count({
      where: { status: "RESERVED" },
    }),
    prisma.vehicle.count({
      where: { status: "SOLD" },
    }),
    prisma.review.count(),
    prisma.review.count({
      where: { published: true },
    }),
    prisma.blogPost.count(),
    prisma.blogPost.count({
      where: { published: true },
    }),
  ]);

  return {
    vehicles: {
      total: totalVehicles,
      available: availableVehicles,
      reserved: reservedVehicles,
      sold: soldVehicles,
    },
    reviews: {
      total: totalReviews,
      published: publishedReviews,
    },
    blogPosts: {
      total: totalBlogPosts,
      published: publishedBlogPosts,
    },
  };
}