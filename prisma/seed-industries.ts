import { Locale, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedIndustries() {
  console.log("🏭 Seeding industries...");

  const admin = await prisma.adminUser.findFirst();
  if (!admin) {
    console.log("⚠️  Admin user not found. Run base seed first.");
    return;
  }

  const industries = [
    {
      slug: 'fnb',
      iconName: '🍽️',
      name: { id: 'Food & Beverage', en: 'Food & Beverage' },
      description: { id: 'Solusi lengkap untuk mengelola restoran, kafe, dan bisnis kuliner Anda. Kelola menu, pesanan, inventory, dan laporan keuangan dengan mudah.', en: 'Complete solution for managing your restaurant, cafe, and culinary business. Manage menus, orders, inventory, and financial reports easily.' },
      displayOrder: 1
    },
    {
      slug: 'contractor',
      iconName: '🏗️',
      name: { id: 'Kontraktor', en: 'Contractor' },
      description: { id: 'Sistem manajemen proyek konstruksi yang terintegrasi. Kelola proyek, material, tenaga kerja, dan progress dengan efisien.', en: 'Integrated construction project management system. Manage projects, materials, labor, and progress efficiently.' },
      displayOrder: 2
    },
    {
      slug: 'manufacturing',
      iconName: '🏭',
      name: { id: 'Manufaktur', en: 'Manufacturing' },
      description: { id: 'Sistem manufaktur terintegrasi untuk mengelola produksi, quality control, supply chain, dan inventory management.', en: 'Integrated manufacturing system to manage production, quality control, supply chain, and inventory management.' },
      displayOrder: 3
    },
    {
      slug: 'retail',
      iconName: '🛍️',
      name: { id: 'Retail', en: 'Retail' },
      description: { id: 'Solusi lengkap untuk mengelola toko retail dan e-commerce. Kelola produk, penjualan, inventory, dan customer dengan mudah.', en: 'Complete solution for managing retail stores and e-commerce. Manage products, sales, inventory, and customers easily.' },
      displayOrder: 4
    }
  ];

  for (const industryData of industries) {
    // Generate code
    const code = 'IND_' + industryData.slug.toUpperCase().replace('-', '_');

    const existing = await prisma.industry.findUnique({
      where: { industryCode: code }
    });

    if (existing) {
      console.log(`  ⏭️  Industry ${code} already exists, skipping...`);
      continue;
    }

    await prisma.industry.create({
      data: {
        industryCode: code,
        slug: industryData.slug,
        displayOrder: industryData.displayOrder,
        isActive: true,
        createdBy: admin.userId,
        updatedBy: admin.userId,
        translations: {
          create: [
            {
              locale: Locale.id,
              title: industryData.name.id,
              description: industryData.description.id,
              introText: industryData.description.id // Use description as intro fallback if not separate
            },
            {
              locale: Locale.en,
              title: industryData.name.en,
              description: industryData.description.en,
              introText: industryData.description.en
            }
          ]
        },
        // For simplicity, we are not seeding specific problems/solutions if they weren't in the frontend object
        // The original seeder had them, but the frontend only had Name/Desc/Icon.
        // We stick to what the frontend provided to "match frontend data"
      }
    });

    console.log(`  ✅ Industry ${code} created`);
  }

  console.log("🏁 Industry seeding completed.");
}

seedIndustries()
  .catch(error => {
    console.error("❌ Failed to seed industries:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
