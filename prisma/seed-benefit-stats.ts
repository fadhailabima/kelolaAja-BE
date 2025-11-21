import { PrismaClient, Locale } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting BenefitStat seeding...\n");

  const adminUser = await prisma.adminUser.findFirst();

  if (!adminUser) {
    console.error("❌ Error: No admin user found. Please run seed-admin first.");
    process.exit(1);
  }

  // Create benefit stats
  const stats = [
    {
      statCode: "BUSINESSES_SERVED",
      statValue: "1,000+",
      displayOrder: 1,
      translations: {
        id: { label: "Bisnis Terlayani" },
        en: { label: "Businesses Served" }
      }
    },
    {
      statCode: "INVOICES_PROCESSED",
      statValue: "10,000+",
      displayOrder: 2,
      translations: {
        id: { label: "Invoice Diproses" },
        en: { label: "Invoices Processed" }
      }
    },
    {
      statCode: "CUSTOMER_SATISFACTION",
      statValue: "98%",
      displayOrder: 3,
      translations: {
        id: { label: "Kepuasan Pelanggan" },
        en: { label: "Customer Satisfaction" }
      }
    },
    {
      statCode: "YEARS_EXPERIENCE",
      statValue: "5+",
      displayOrder: 4,
      translations: {
        id: { label: "Tahun Pengalaman" },
        en: { label: "Years Experience" }
      }
    }
  ];

  for (const stat of stats) {
    const created = await prisma.benefitStat.create({
      data: {
        statCode: stat.statCode,
        statValue: stat.statValue,
        displayOrder: stat.displayOrder,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: Locale.id,
              label: stat.translations.id.label
            },
            {
              locale: Locale.en,
              label: stat.translations.en.label
            }
          ]
        }
      },
      include: {
        translations: true
      }
    });

    console.log(`✅ Stat created: ${stat.translations.id.label} (ID: ${created.statId})`);
  }

  console.log(`\n✨ Seeding completed! Total stats: ${stats.length}`);
}

main()
  .catch(e => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
