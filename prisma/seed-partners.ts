import { PrismaClient, Locale } from "@prisma/client";

const prisma = new PrismaClient();

async function seedPartners() {
  console.log("🤝 Seeding partners...");

  const admin = await prisma.adminUser.findFirst();
  if (!admin) {
    console.log("⚠️  No admin user found. Please run main seed first.");
    return;
  }

  const partners = [
    { name: 'Sri', image: '/images/partners/sri.png' },
    { name: 'Sriendo Foods', image: '/images/partners/sriendofoods.png' },
    { name: 'Aura Food', image: '/images/partners/aurafood.png' },
    { name: 'Damika', image: '/images/partners/logo-damika.png' },
    { name: 'KAS', image: '/images/partners/logo-kas.png' },
    { name: 'MB Furnistore', image: '/images/partners/logo-mb-furnistore.jpg' },
    { name: 'MML', image: '/images/partners/logo-mml.jpg' },
    { name: 'SBS', image: '/images/partners/logo-sbs.jpg' },
  ];

  for (const [index, p] of partners.entries()) {
    const existing = await prisma.partner.findFirst({ where: { partnerName: p.name } });

    if (existing) {
      console.log(`  ⏭️  Partner ${p.name} already exists, skipping...`);
      continue;
    }

    // Create media file
    const mediaFile = await prisma.mediaFile.create({
      data: {
        fileName: p.name.toLowerCase().replace(/\s/g, '-') + '.png',
        filePath: '/seeds/partners/' + p.name.toLowerCase().replace(/\s/g, '-') + '.png',
        mimeType: 'image/png',
        fileSize: 1024,
        storageUrl: p.image,
        uploadedBy: admin.userId,
      }
    });

    const partner = await prisma.partner.create({
      data: {
        partnerName: p.name,
        displayOrder: index + 1,
        isActive: true,
        logoFileId: mediaFile.fileId,
        createdBy: admin.userId,
        updatedBy: admin.userId,
        translations: {
          create: [
            { locale: Locale.id, description: `Partner ${p.name}` },
            { locale: Locale.en, description: `Partner ${p.name}` }
          ]
        }
      }
    });

    console.log(`  ✅ Partner created: ${partner.partnerName}`);
  }

  console.log("✅ Partners seeding completed!");
}

async function main() {
  try {
    await seedPartners();
  } catch (error) {
    console.error("❌ Error during partners seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
