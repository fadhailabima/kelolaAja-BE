import { PrismaClient, Locale } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting ProcessStep seeding...\n");

  const adminUser = await prisma.adminUser.findFirst();

  if (!adminUser) {
    console.error("❌ Error: No admin user found. Please run seed-admin first.");
    process.exit(1);
  }

  // Create process steps from frontend data
  const steps = [
    { code: 'analysis', title: { id: 'Analisa Proses Bisnis', en: 'Business Process Analysis' }, desc: { id: 'Tim konsultan kami akan mengidentifikasi masalah dan kebutuhan bisnismu', en: 'Our consultant team will identify problems and your business needs' } },
    { code: 'planning', title: { id: 'Perencanaan', en: 'Planning' }, desc: { id: 'Kami pastikan sistem bekerja sesuai dengan proses bisnismu.', en: 'We ensure the system works according to your business processes.' } },
    { code: 'training', title: { id: 'Pelatihan', en: 'Training' }, desc: { id: 'Membantu user lewat pelatihan khusus untuk setiap divisi.', en: 'Help users through special training for each division.' } },
    { code: 'goingLive', title: { id: 'Going Live', en: 'Going Live' }, desc: { id: 'Memastikan semua proses berjalan baik setelah going live.', en: 'Ensuring all processes run smoothly after going live.' } },
  ];

  for (const [index, step] of steps.entries()) {
    const existing = await prisma.processStep.findUnique({ where: { stepCode: step.code } });

    if (existing) {
      console.log(`⏭️  Step ${step.code} already exists`);
      continue;
    }

    await prisma.processStep.create({
      data: {
        stepCode: step.code,
        displayOrder: index + 1,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: Locale.id,
              title: step.title.id,
              description: step.desc.id
            },
            {
              locale: Locale.en,
              title: step.title.en,
              description: step.desc.en
            }
          ]
        }
      },
      include: {
        translations: true
      }
    });

    console.log(`✅ Step created: ${step.title.id}`);
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
