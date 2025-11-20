import { PrismaClient, Locale } from "@prisma/client";

const prisma = new PrismaClient();

async function seedFeatures() {
  console.log("🎯 Seeding features...");

  const admin = await prisma.adminUser.findFirst({
    where: { role: "Admin" }
  });

  if (!admin) {
    console.log("⚠️  No admin user found. Please run main seed first.");
    return;
  }

  // Define features with translations
  const features = [
    {
      featureCode: "USER_MANAGEMENT",
      category: "Core",
      displayOrder: 1,
      translations: {
        id: {
          featureName: "Manajemen Pengguna",
          description: "Kelola akun pengguna, role, dan permissions"
        },
        en: {
          featureName: "User Management",
          description: "Manage user accounts, roles, and permissions"
        }
      }
    },
    {
      featureCode: "MULTI_COMPANY",
      category: "Core",
      displayOrder: 2,
      translations: {
        id: {
          featureName: "Multi Perusahaan",
          description: "Kelola beberapa perusahaan dalam satu sistem"
        },
        en: {
          featureName: "Multi Company",
          description: "Manage multiple companies in one system"
        }
      }
    },
    {
      featureCode: "INVENTORY_MANAGEMENT",
      category: "Inventory",
      displayOrder: 3,
      translations: {
        id: {
          featureName: "Manajemen Stok",
          description: "Kelola stok barang, warehouse, dan transfer barang"
        },
        en: {
          featureName: "Inventory Management",
          description: "Manage stock items, warehouses, and transfers"
        }
      }
    },
    {
      featureCode: "SALES_ORDER",
      category: "Sales",
      displayOrder: 4,
      translations: {
        id: {
          featureName: "Pesanan Penjualan",
          description: "Buat dan kelola pesanan penjualan"
        },
        en: {
          featureName: "Sales Order",
          description: "Create and manage sales orders"
        }
      }
    },
    {
      featureCode: "PURCHASE_ORDER",
      category: "Purchase",
      displayOrder: 5,
      translations: {
        id: {
          featureName: "Pesanan Pembelian",
          description: "Buat dan kelola pesanan pembelian"
        },
        en: {
          featureName: "Purchase Order",
          description: "Create and manage purchase orders"
        }
      }
    },
    {
      featureCode: "INVOICING",
      category: "Finance",
      displayOrder: 6,
      translations: {
        id: {
          featureName: "Faktur & Tagihan",
          description: "Buat dan kelola faktur penjualan dan pembelian"
        },
        en: {
          featureName: "Invoicing",
          description: "Create and manage sales and purchase invoices"
        }
      }
    },
    {
      featureCode: "ACCOUNTING",
      category: "Finance",
      displayOrder: 7,
      translations: {
        id: {
          featureName: "Akuntansi",
          description: "Pencatatan jurnal, buku besar, dan laporan keuangan"
        },
        en: {
          featureName: "Accounting",
          description: "Journal entries, general ledger, and financial reports"
        }
      }
    },
    {
      featureCode: "REPORTING",
      category: "Analytics",
      displayOrder: 8,
      translations: {
        id: {
          featureName: "Laporan & Analytics",
          description: "Dashboard dan laporan bisnis lengkap"
        },
        en: {
          featureName: "Reporting & Analytics",
          description: "Comprehensive dashboards and business reports"
        }
      }
    },
    {
      featureCode: "MOBILE_APP",
      category: "Platform",
      displayOrder: 9,
      translations: {
        id: {
          featureName: "Aplikasi Mobile",
          description: "Akses sistem melalui aplikasi mobile iOS & Android"
        },
        en: {
          featureName: "Mobile App",
          description: "Access system via iOS & Android mobile apps"
        }
      }
    },
    {
      featureCode: "API_ACCESS",
      category: "Integration",
      displayOrder: 10,
      translations: {
        id: {
          featureName: "Akses API",
          description: "Integrasi dengan sistem eksternal via REST API"
        },
        en: {
          featureName: "API Access",
          description: "Integration with external systems via REST API"
        }
      }
    },
    {
      featureCode: "CUSTOM_FIELDS",
      category: "Customization",
      displayOrder: 11,
      translations: {
        id: {
          featureName: "Custom Fields",
          description: "Tambahkan field khusus sesuai kebutuhan bisnis"
        },
        en: {
          featureName: "Custom Fields",
          description: "Add custom fields based on business needs"
        }
      }
    },
    {
      featureCode: "PRIORITY_SUPPORT",
      category: "Support",
      displayOrder: 12,
      translations: {
        id: {
          featureName: "Priority Support",
          description: "Dukungan teknis prioritas 24/7"
        },
        en: {
          featureName: "Priority Support",
          description: "24/7 priority technical support"
        }
      }
    }
  ];

  for (const featureData of features) {
    const { translations, ...featureFields } = featureData;

    const existingFeature = await prisma.featureMaster.findUnique({
      where: { featureCode: featureFields.featureCode }
    });

    if (existingFeature) {
      console.log(`  ⏭️  Feature ${featureFields.featureCode} already exists, skipping...`);
      continue;
    }

    const feature = await prisma.featureMaster.create({
      data: {
        ...featureFields,
        createdBy: admin.userId,
        updatedBy: admin.userId,
        translations: {
          create: [
            {
              locale: Locale.id,
              featureName: translations.id.featureName,
              description: translations.id.description
            },
            {
              locale: Locale.en,
              featureName: translations.en.featureName,
              description: translations.en.description
            }
          ]
        }
      },
      include: {
        translations: true
      }
    });

    console.log(`  ✅ Feature created: ${feature.featureCode} (ID: ${feature.featureId})`);
  }

  console.log("✅ Features seeding completed!");
}

async function seedPlanFeatures() {
  console.log("🔗 Seeding plan features...");

  // Get plans
  const starter = await prisma.pricingPlan.findUnique({
    where: { planCode: "STARTER" }
  });
  const professional = await prisma.pricingPlan.findUnique({
    where: { planCode: "PROFESSIONAL" }
  });
  const enterprise = await prisma.pricingPlan.findUnique({
    where: { planCode: "ENTERPRISE" }
  });

  if (!starter || !professional || !enterprise) {
    console.log("⚠️  Pricing plans not found. Please run pricing seed first.");
    return;
  }

  // Get features
  const features = await prisma.featureMaster.findMany({
    where: { isActive: true, deletedAt: null }
  });

  // Define plan-feature mappings
  const planFeatureMappings = {
    STARTER: ["USER_MANAGEMENT", "INVENTORY_MANAGEMENT", "SALES_ORDER", "INVOICING", "REPORTING"],
    PROFESSIONAL: [
      "USER_MANAGEMENT",
      "MULTI_COMPANY",
      "INVENTORY_MANAGEMENT",
      "SALES_ORDER",
      "PURCHASE_ORDER",
      "INVOICING",
      "ACCOUNTING",
      "REPORTING",
      "MOBILE_APP"
    ],
    ENTERPRISE: [
      "USER_MANAGEMENT",
      "MULTI_COMPANY",
      "INVENTORY_MANAGEMENT",
      "SALES_ORDER",
      "PURCHASE_ORDER",
      "INVOICING",
      "ACCOUNTING",
      "REPORTING",
      "MOBILE_APP",
      "API_ACCESS",
      "CUSTOM_FIELDS",
      "PRIORITY_SUPPORT"
    ]
  };

  // Add features to plans
  for (const [planCode, featureCodes] of Object.entries(planFeatureMappings)) {
    const plan = planCode === "STARTER" ? starter : planCode === "PROFESSIONAL" ? professional : enterprise;

    for (let i = 0; i < featureCodes.length; i++) {
      const featureCode = featureCodes[i];
      const feature = features.find(f => f.featureCode === featureCode);

      if (!feature) {
        console.log(`  ⚠️  Feature ${featureCode} not found, skipping...`);
        continue;
      }

      const existing = await prisma.planFeatureList.findFirst({
        where: {
          planId: plan.planId,
          featureId: feature.featureId
        }
      });

      if (existing) {
        console.log(`  ⏭️  ${planCode} already has ${featureCode}, skipping...`);
        continue;
      }

      await prisma.planFeatureList.create({
        data: {
          planId: plan.planId,
          featureId: feature.featureId,
          isIncluded: true,
          displayOrder: i
        }
      });

      console.log(`  ✅ Added ${featureCode} to ${planCode}`);
    }
  }

  console.log("✅ Plan features seeding completed!");
}

async function main() {
  try {
    await seedFeatures();
    await seedPlanFeatures();
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
