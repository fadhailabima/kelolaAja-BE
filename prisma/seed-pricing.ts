import { PrismaClient, Locale } from "@prisma/client";

const prisma = new PrismaClient();

async function seedPricingPlans() {
  console.log("🏷️  Seeding pricing plans...");

  // Get admin user for createdBy/updatedBy
  const admin = await prisma.adminUser.findFirst({
    where: { role: "Admin" }
  });

  if (!admin) {
    console.log("⚠️  No admin user found. Please run main seed first.");
    return;
  }

  // Create pricing plans with translations
  const plans = [
    {
      planCode: "STARTER",
      pricePerUserMonth: 50000,
      minUsers: 1,
      maxUsers: 10,
      displayOrder: 1,
      badgeColor: "#3B82F6",
      translations: {
        id: {
          planName: "Paket Starter",
          pricePeriod: "per pengguna/bulan",
          userRange: "1-10 pengguna",
          description: "Cocok untuk bisnis kecil yang baru memulai digitalisasi"
        },
        en: {
          planName: "Starter Plan",
          pricePeriod: "per user/month",
          userRange: "1-10 users",
          description: "Perfect for small businesses starting their digital journey"
        }
      }
    },
    {
      planCode: "PROFESSIONAL",
      pricePerUserMonth: 40000,
      minUsers: 11,
      maxUsers: 50,
      displayOrder: 2,
      badgeColor: "#10B981",
      translations: {
        id: {
          planName: "Paket Professional",
          pricePeriod: "per pengguna/bulan",
          userRange: "11-50 pengguna",
          description: "Ideal untuk bisnis menengah dengan tim yang berkembang"
        },
        en: {
          planName: "Professional Plan",
          pricePeriod: "per user/month",
          userRange: "11-50 users",
          description: "Ideal for growing medium-sized businesses"
        }
      }
    },
    {
      planCode: "ENTERPRISE",
      pricePerUserMonth: 30000,
      minUsers: 51,
      maxUsers: null,
      displayOrder: 3,
      badgeColor: "#8B5CF6",
      translations: {
        id: {
          planName: "Paket Enterprise",
          pricePeriod: "per pengguna/bulan",
          userRange: "51+ pengguna",
          description: "Solusi lengkap untuk perusahaan besar dengan kebutuhan kompleks"
        },
        en: {
          planName: "Enterprise Plan",
          pricePeriod: "per user/month",
          userRange: "51+ users",
          description: "Complete solution for large enterprises with complex needs"
        }
      }
    }
  ];

  for (const planData of plans) {
    const { translations, ...planFields } = planData;

    const existingPlan = await prisma.pricingPlan.findUnique({
      where: { planCode: planFields.planCode }
    });

    if (existingPlan) {
      console.log(`  ⏭️  Plan ${planFields.planCode} already exists, skipping...`);
      continue;
    }

    const plan = await prisma.pricingPlan.create({
      data: {
        ...planFields,
        createdBy: admin.userId,
        updatedBy: admin.userId,
        translations: {
          create: [
            {
              locale: Locale.id,
              planName: translations.id.planName,
              pricePeriod: translations.id.pricePeriod,
              userRange: translations.id.userRange,
              description: translations.id.description
            },
            {
              locale: Locale.en,
              planName: translations.en.planName,
              pricePeriod: translations.en.pricePeriod,
              userRange: translations.en.userRange,
              description: translations.en.description
            }
          ]
        }
      },
      include: {
        translations: true
      }
    });

    console.log(`  ✅ Plan created: ${plan.planCode} (ID: ${plan.planId})`);
  }

  console.log("✅ Pricing plans seeding completed!");
}

async function main() {
  try {
    await seedPricingPlans();
  } catch (error) {
    console.error("❌ Error during pricing plans seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
