import { PrismaClient, Locale } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting BenefitStat seeding...\n");

  const adminUser = await prisma.adminUser.findFirst();

  if (!adminUser) {
    console.error("❌ Error: No admin user found. Please run seed-admin first.");
    process.exit(1);
  }

  // Create benefit stats from frontend data
  const stats = [
    { code: 'reduceErrors', value: '90%', label: { id: 'Kurangi kesalahan hingga 90%', en: 'Reduce errors by up to 90%' } },
    { code: 'cutManualProcess', value: '80%', label: { id: 'Pangkas Proses Manual 80%', en: 'Cut Manual Processes by 80%' } },
    { code: 'accessReports', value: '100%', label: { id: 'Akses Laporan Real-time 100%', en: 'Access Reports Anytime Anywhere 100%' } },
    { code: 'customerSupport', value: '100%', label: { id: 'Kepuasan Customer Support 100%', en: '24/7 Customer Support' } },
  ];

  for (const [index, stat] of stats.entries()) {
    const existing = await prisma.benefitStat.findUnique({ where: { statCode: stat.code } });

    if (existing) {
      console.log(`⏭️  Stat ${stat.code} already exists`);
      continue;
    }

    await prisma.benefitStat.create({
      data: {
        statCode: stat.code,
        statValue: stat.value,
        displayOrder: index + 1,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: Locale.id,
              label: stat.label.id
            },
            {
              locale: Locale.en,
              label: stat.label.en
            }
          ]
        }
      },
      include: {
        translations: true
      }
    });

    console.log(`✅ Stat created: ${stat.code}`);
  }

  console.log(`\n✨ Seeding completed!`);
}

main()
  .catch(e => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
