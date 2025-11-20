import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seeding...");

  // Hash password
  const hashedPassword = await bcrypt.hash("admin123", 10);

  // Create Super Admin
  const superAdmin = await prisma.adminUser.upsert({
    where: { email: "admin@kelolaaja.com" },
    update: {},
    create: {
      username: "superadmin",
      email: "admin@kelolaaja.com",
      passwordHash: hashedPassword,
      role: "Admin",
      fullName: "Super Administrator",
      isActive: true
    }
  });

  console.log("✅ Super Admin created:", {
    id: superAdmin.userId,
    username: superAdmin.username,
    email: superAdmin.email
  });

  // Create Editor Admin
  const editorAdmin = await prisma.adminUser.upsert({
    where: { email: "editor@kelolaaja.com" },
    update: {},
    create: {
      username: "editor",
      email: "editor@kelolaaja.com",
      passwordHash: hashedPassword,
      role: "Editor",
      fullName: "Content Editor",
      isActive: true,
      createdBy: superAdmin.userId
    }
  });

  console.log("✅ Editor Admin created:", {
    id: editorAdmin.userId,
    username: editorAdmin.username,
    email: editorAdmin.email
  });

  // Create Viewer Admin
  const viewerAdmin = await prisma.adminUser.upsert({
    where: { email: "viewer@kelolaaja.com" },
    update: {},
    create: {
      username: "viewer",
      email: "viewer@kelolaaja.com",
      passwordHash: hashedPassword,
      role: "Viewer",
      fullName: "Read Only Viewer",
      isActive: true,
      createdBy: superAdmin.userId
    }
  });

  console.log("✅ Viewer Admin created:", {
    id: viewerAdmin.userId,
    username: viewerAdmin.username,
    email: viewerAdmin.email
  });

  console.log("\n🎉 Seeding completed successfully!");
  console.log("\n📝 Login Credentials:");
  console.log("-----------------------------------");
  console.log("Super Admin:");
  console.log("  Email: admin@kelolaaja.com");
  console.log("  Password: admin123");
  console.log("\nEditor:");
  console.log("  Email: editor@kelolaaja.com");
  console.log("  Password: admin123");
  console.log("\nViewer:");
  console.log("  Email: viewer@kelolaaja.com");
  console.log("  Password: admin123");
  console.log("-----------------------------------\n");
}

main()
  .catch(e => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
