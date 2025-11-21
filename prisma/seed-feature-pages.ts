import { Locale, PrismaClient } from "@prisma/client";

if (process.env.NODE_ENV === "production") {
  console.log("⏭️  Skipping feature page seed because NODE_ENV=production");
  process.exit(0);
}

const prisma = new PrismaClient();

type PageSeed = {
  featureCode: string;
  pageCode: string;
  slug: string;
  translations: {
    id: {
      heroTitle: string;
      heroSubtitle: string;
      heroDescription: string;
      aboutTitle: string;
      aboutSubtitle: string;
      aboutDescription1: string;
      aboutDescription2: string;
      ctaTitle: string;
      ctaDescription: string;
      ctaButtonText: string;
    };
    en: {
      heroTitle: string;
      heroSubtitle: string;
      heroDescription: string;
      aboutTitle: string;
      aboutSubtitle: string;
      aboutDescription1: string;
      aboutDescription2: string;
      ctaTitle: string;
      ctaDescription: string;
      ctaButtonText: string;
    };
  };
  items: Array<{
    itemType: string;
    displayOrder: number;
    translations: {
      id: { title: string; description: string; shortDescription?: string };
      en: { title: string; description: string; shortDescription?: string };
    };
  }>;
};

const pages: PageSeed[] = [
  {
    featureCode: "USER_MANAGEMENT",
    pageCode: "PAGE_USER_MANAGEMENT",
    slug: "feature-user-management",
    translations: {
      id: {
        heroTitle: "Kelola seluruh tim dalam satu dashboard",
        heroSubtitle: "User Management",
        heroDescription: "Atur role, permission, serta akses modul agar operasi tetap aman dan terkontrol.",
        aboutTitle: "Kenapa User Management penting?",
        aboutSubtitle: "Satu akun untuk semua aplikasi",
        aboutDescription1: "Kelola struktur organisasi, departemen, hingga akses modul dengan drag & drop.",
        aboutDescription2: "Audit trail membantu tim keamanan menelusuri aktivitas penting secara real-time.",
        ctaTitle: "Siap mempermudah manajemen user?",
        ctaDescription: "Hubungi tim kami untuk demo selengkapnya.",
        ctaButtonText: "Jadwalkan Demo"
      },
      en: {
        heroTitle: "Manage every team member in one dashboard",
        heroSubtitle: "User Management",
        heroDescription: "Control roles, permissions, and module access to keep operations secure.",
        aboutTitle: "Why User Management matters",
        aboutSubtitle: "One account for every app",
        aboutDescription1: "Manage org structure, departments, and module access with intuitive tools.",
        aboutDescription2: "Audit trails help your security team trace critical actions in real time.",
        ctaTitle: "Ready to simplify user management?",
        ctaDescription: "Contact our team for a guided demo.",
        ctaButtonText: "Book Demo"
      }
    },
    items: [
      {
        itemType: "highlight",
        displayOrder: 1,
        translations: {
          id: {
            title: "Role & Permission Builder",
            description: "Buat role berbeda untuk tim back office, lapangan, hingga mitra dengan granular permission.",
            shortDescription: "Atur akses tanpa coding"
          },
          en: {
            title: "Role & Permission Builder",
            description: "Create tailored roles for back-office, field, and partner teams with granular permissions.",
            shortDescription: "Configure access without coding"
          }
        }
      },
      {
        itemType: "highlight",
        displayOrder: 2,
        translations: {
          id: {
            title: "Single Sign-On",
            description: "Integrasi SSO dengan Google Workspace atau Azure AD menjaga keamanan login.",
            shortDescription: "Keamanan enterprise"
          },
          en: {
            title: "Single Sign-On",
            description: "Integrate SSO via Google Workspace or Azure AD to secure logins.",
            shortDescription: "Enterprise security"
          }
        }
      }
    ]
  },
  {
    featureCode: "REPORTING",
    pageCode: "PAGE_REPORTING",
    slug: "feature-reporting",
    translations: {
      id: {
        heroTitle: "Business intelligence siap pakai",
        heroSubtitle: "Reporting & Analytics",
        heroDescription: "Sajikan KPI terlengkap mulai dari penjualan, keuangan, hingga operasional.",
        aboutTitle: "Semua data, satu layer analitik",
        aboutSubtitle: "Dashboard siap pakai",
        aboutDescription1: "Gunakan template dashboard untuk departemen finance, sales, marketing, dan warehouse.",
        aboutDescription2: "Drag and drop untuk membuat visualisasi baru tanpa bantuan data engineer.",
        ctaTitle: "Transformasi reporting Anda",
        ctaDescription: "Dapatkan insight dalam hitungan menit.",
        ctaButtonText: "Coba Demo"
      },
      en: {
        heroTitle: "Ready-to-use business intelligence",
        heroSubtitle: "Reporting & Analytics",
        heroDescription: "Deliver complete KPIs from sales, finance, to operations.",
        aboutTitle: "Every data point, single analytics layer",
        aboutSubtitle: "Ready-made dashboards",
        aboutDescription1: "Use dashboard templates for finance, sales, marketing, and warehouse teams.",
        aboutDescription2: "Drag and drop to create new visuals without relying on data engineers.",
        ctaTitle: "Transform your reporting",
        ctaDescription: "Gain insights within minutes.",
        ctaButtonText: "Try Demo"
      }
    },
    items: [
      {
        itemType: "benefit",
        displayOrder: 1,
        translations: {
          id: {
            title: "Data Warehouse terintegrasi",
            description: "Sinkronisasi data ERP, CRM, dan aplikasi lain secara otomatis tiap jam.",
            shortDescription: "Sinkronisasi otomatis"
          },
          en: {
            title: "Integrated data warehouse",
            description: "Sync your ERP, CRM, and other apps automatically every hour.",
            shortDescription: "Automated sync"
          }
        }
      },
      {
        itemType: "benefit",
        displayOrder: 2,
        translations: {
          id: {
            title: "Alert berbasis KPI",
            description: "Set threshold KPI agar tim segera menerima notifikasi ketika performa turun.",
            shortDescription: "Notifikasi proaktif"
          },
          en: {
            title: "KPI-based alerts",
            description: "Set KPI thresholds so teams get notified when performance drops.",
            shortDescription: "Proactive notifications"
          }
        }
      }
    ]
  }
];

async function seedFeaturePages() {
  console.log("🧩 Seeding feature pages...");

  const admin = await prisma.adminUser.findFirst({
    where: { role: "Admin" }
  });

  if (!admin) {
    console.log("⚠️  Admin user not found. Run base seed first.");
    return;
  }

  for (const pageData of pages) {
    const feature = await prisma.featureMaster.findUnique({
      where: { featureCode: pageData.featureCode }
    });

    if (!feature) {
      console.log(`  ⚠️  Feature ${pageData.featureCode} not found, skipping page ${pageData.pageCode}`);
      continue;
    }

    const existing = await prisma.featurePage.findUnique({
      where: { pageCode: pageData.pageCode }
    });

    if (existing) {
      console.log(`  ⏭️  Feature page ${pageData.pageCode} already exists, skipping...`);
      continue;
    }

    await prisma.featurePage.create({
      data: {
        featureId: feature.featureId,
        pageCode: pageData.pageCode,
        slug: pageData.slug,
        isActive: true,
        createdBy: admin.userId,
        updatedBy: admin.userId,
        translations: {
          create: [
            {
              locale: Locale.id,
              ...pageData.translations.id
            },
            {
              locale: Locale.en,
              ...pageData.translations.en
            }
          ]
        },
        items: {
          create: pageData.items.map(item => ({
            itemType: item.itemType,
            displayOrder: item.displayOrder,
            isActive: true,
            translations: {
              create: [
                {
                  locale: Locale.id,
                  title: item.translations.id.title,
                  description: item.translations.id.description,
                  shortDescription: item.translations.id.shortDescription || null
                },
                {
                  locale: Locale.en,
                  title: item.translations.en.title,
                  description: item.translations.en.description,
                  shortDescription: item.translations.en.shortDescription || null
                }
              ]
            }
          }))
        }
      }
    });

    console.log(`  ✅ Feature page ${pageData.pageCode} created`);
  }

  console.log("🏁 Feature page seeding completed.");
}

seedFeaturePages()
  .catch(error => {
    console.error("❌ Failed to seed feature pages:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
