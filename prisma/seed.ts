import "dotenv/config";

import bcrypt from "bcryptjs";
import {
  PrismaClient,
  UserRole,
  VehicleCondition,
  VehicleStatus,
} from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in your environment.");
}

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminEmail || !adminPassword) {
  throw new Error(
    "ADMIN_EMAIL and ADMIN_PASSWORD must be defined in your environment.",
  );
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Starting database seed...");

  // --------------------------------------------------
  // Admin user
  // --------------------------------------------------

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: {
      email: adminEmail.toLowerCase(),
    },
    update: {
      name: "Doctor's Autos Admin",
      passwordHash,
      role: UserRole.ADMIN,
    },
    create: {
      name: "Doctor's Autos Admin",
      email: adminEmail.toLowerCase(),
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  console.log(`✅ Admin user ready: ${admin.email}`);

  // --------------------------------------------------
  // Vehicles
  // --------------------------------------------------

  await prisma.vehicle.deleteMany();

  const vehicles = await prisma.vehicle.createMany({
    data: [
      {
        slug: "toyota-camry-2023",
        make: "Toyota",
        model: "Camry",
        year: 2023,
        price: 28500000,
        mileage: 32000,
        condition: VehicleCondition.USED,
        bodyType: "Sedan",
        fuelType: "Petrol",
        transmission: "Automatic",
        driveType: "FWD",
        color: "White",
        description:
          "A clean and well-maintained Toyota Camry with a comfortable interior and reliable performance.",
        featured: true,
        status: VehicleStatus.AVAILABLE,
      },
      {
        slug: "lexus-rx-350-2022",
        make: "Lexus",
        model: "RX 350",
        year: 2022,
        price: 42000000,
        mileage: 41000,
        condition: VehicleCondition.USED,
        bodyType: "SUV",
        fuelType: "Petrol",
        transmission: "Automatic",
        driveType: "AWD",
        color: "Black",
        description:
          "A premium Lexus RX 350 offering comfort, performance, and a refined driving experience.",
        featured: true,
        status: VehicleStatus.AVAILABLE,
      },
      {
        slug: "mercedes-benz-c300-2021",
        make: "Mercedes-Benz",
        model: "C300",
        year: 2021,
        price: 35000000,
        mileage: 38000,
        condition: VehicleCondition.USED,
        bodyType: "Sedan",
        fuelType: "Petrol",
        transmission: "Automatic",
        driveType: "RWD",
        color: "Silver",
        description:
          "A stylish Mercedes-Benz C300 combining luxury, technology, and everyday performance.",
        featured: true,
        status: VehicleStatus.AVAILABLE,
      },
    ],
  });

  console.log(`✅ Created ${vehicles.count} vehicles`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });