import { Locale, PrismaClient } from "@prisma/client";

if (process.env.NODE_ENV === "production") {
  console.log("⏭️  Skipping industry seed because NODE_ENV=production");
  process.exit(0);
}

const prisma = new PrismaClient();

type IndustrySeed = {
  industryCode: string;
  slug: string;
  displayOrder: number;
  translations: {
    id: {
      title: string;
      description: string;
      introText: string;
    };
    en: {
      title: string;
      description: string;
      introText: string;
    };
  };
  problems: Array<{
    displayOrder: number;
    translations: {
      id: { title: string; description: string };
      en: { title: string; description: string };
    };
  }>;
  solutions: Array<{
    displayOrder: number;
    translations: {
      id: { title: string; description: string };
      en: { title: string; description: string };
    };
  }>;
};

const industries: IndustrySeed[] = [
  {
    industryCode: "IND_MANUFACTURING",
    slug: "industri-manufaktur",
    displayOrder: 1,
    translations: {
      id: {
        title: "Manufaktur",
        description: "Digitalisasi proses produksi hingga distribusi agar perusahaan manufaktur dapat bergerak cepat.",
        introText: "Pantau kapasitas produksi, permintaan, serta kebutuhan bahan baku dalam satu dashboard."
      },
      en: {
        title: "Manufacturing",
        description: "Digitize production-to-distribution workflows so factories stay agile.",
        introText: "Monitor production capacity, demand, and raw material needs from a single dashboard."
      }
    },
    problems: [
      {
        displayOrder: 1,
        translations: {
          id: { title: "Perencanaan produksi manual", description: "Spreadsheet berbeda-beda membuat kapasitas sulit diprediksi." },
          en: { title: "Manual production planning", description: "Fragmented spreadsheets make it hard to predict capacity." }
        }
      },
      {
        displayOrder: 2,
        translations: {
          id: { title: "Keterlambatan suplai", description: "Kurangnya visibilitas stok bahan baku memicu downtime produksi." },
          en: { title: "Supply delays", description: "Limited visibility on raw stock causes frequent downtime." }
        }
      }
    ],
    solutions: [
      {
        displayOrder: 1,
        translations: {
          id: {
            title: "MRP & BOM otomatis",
            description: "Kelola Bill of Material dan jadwal produksi otomatis dari forecast penjualan."
          },
          en: {
            title: "Automated MRP & BOM",
            description: "Manage Bills of Material and production schedules directly from sales forecasts."
          }
        }
      },
      {
        displayOrder: 2,
        translations: {
          id: {
            title: "Monitoring shopfloor real-time",
            description: "Gunakan dashboard OEE dan IoT counter untuk mengetahui performa mesin."
          },
          en: {
            title: "Real-time shopfloor monitoring",
            description: "Use OEE dashboards and IoT counters to understand machine performance."
          }
        }
      }
    ]
  },
  {
    industryCode: "IND_DISTRIBUTION",
    slug: "industri-distribusi",
    displayOrder: 2,
    translations: {
      id: {
        title: "Distribusi & Wholesale",
        description: "Satukan data inventori multi-gudang, sales order, dan armada pengiriman.",
        introText: "Minimalkan stok mati sekaligus akselerasi pengiriman ke seluruh channel."
      },
      en: {
        title: "Distribution & Wholesale",
        description: "Unify multi-warehouse inventory, sales orders, and delivery fleets.",
        introText: "Reduce dead stock while accelerating shipments across all channels."
      }
    },
    problems: [
      {
        displayOrder: 1,
        translations: {
          id: { title: "Stock out antar gudang", description: "Sulit menentukan transfer stok prioritas antar lokasi." },
          en: { title: "Stock-out between warehouses", description: "Hard to prioritize stock transfers between locations." }
        }
      },
      {
        displayOrder: 2,
        translations: {
          id: { title: "Order entry lambat", description: "Tim sales harus input manual dari email dan chat channel." },
          en: { title: "Slow order entry", description: "Sales teams retype orders manually from email and chat." }
        }
      }
    ],
    solutions: [
      {
        displayOrder: 1,
        translations: {
          id: {
            title: "WMS terintegrasi",
            description: "Sinkronisasi stok secara otomatis antar gudang dengan put-away dan picking plan."
          },
          en: {
            title: "Integrated WMS",
            description: "Sync stock automatically between warehouses with guided put-away and picking."
          }
        }
      },
      {
        displayOrder: 2,
        translations: {
          id: {
            title: "Portal sales & distributor",
            description: "Order dari channel manapun langsung masuk ERP dan siap diproses logistik."
          },
          en: {
            title: "Sales & distributor portal",
            description: "Orders from any channel flow directly to the ERP for fulfillment."
          }
        }
      }
    ]
  }
];

async function seedIndustries() {
  console.log("🏭 Seeding industries...");

  const admin = await prisma.adminUser.findFirst({
    where: { role: "Admin" }
  });

  if (!admin) {
    console.log("⚠️  Admin user not found. Run base seed first.");
    return;
  }

  for (const industryData of industries) {
    const existing = await prisma.industry.findUnique({
      where: { industryCode: industryData.industryCode }
    });

    if (existing) {
      console.log(`  ⏭️  Industry ${industryData.industryCode} already exists, skipping...`);
      continue;
    }

    await prisma.industry.create({
      data: {
        industryCode: industryData.industryCode,
        slug: industryData.slug,
        displayOrder: industryData.displayOrder,
        isActive: true,
        createdBy: admin.userId,
        updatedBy: admin.userId,
        translations: {
          create: [
            {
              locale: Locale.id,
              title: industryData.translations.id.title,
              description: industryData.translations.id.description,
              introText: industryData.translations.id.introText
            },
            {
              locale: Locale.en,
              title: industryData.translations.en.title,
              description: industryData.translations.en.description,
              introText: industryData.translations.en.introText
            }
          ]
        },
        problems: {
          create: industryData.problems.map(problem => ({
            displayOrder: problem.displayOrder,
            isActive: true,
            translations: {
              create: [
                {
                  locale: Locale.id,
                  title: problem.translations.id.title,
                  description: problem.translations.id.description
                },
                {
                  locale: Locale.en,
                  title: problem.translations.en.title,
                  description: problem.translations.en.description
                }
              ]
            }
          }))
        },
        solutions: {
          create: industryData.solutions.map(solution => ({
            displayOrder: solution.displayOrder,
            isActive: true,
            translations: {
              create: [
                {
                  locale: Locale.id,
                  title: solution.translations.id.title,
                  description: solution.translations.id.description
                },
                {
                  locale: Locale.en,
                  title: solution.translations.en.title,
                  description: solution.translations.en.description
                }
              ]
            }
          }))
        }
      }
    });

    console.log(`  ✅ Industry ${industryData.industryCode} created`);
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
