import { PrismaClient, Locale } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting ERPBenefit seeding...\n");

  const adminUser = await prisma.adminUser.findFirst();

  if (!adminUser) {
    console.error("❌ Error: No admin user found. Please run seed-admin first.");
    process.exit(1);
  }

  // Create ERP benefits
  const benefits = [
    {
      benefitCode: "BENEFIT_INVENTORY",
      displayOrder: 1,
      translations: {
        id: {
          title: "Manajemen Stok Otomatis",
          description:
            "Kelola stok barang secara real-time dengan sistem yang terintegrasi. Hindari kelebihan atau kekurangan stok dengan fitur notifikasi otomatis."
        },
        en: {
          title: "Automated Inventory Management",
          description:
            "Manage inventory in real-time with an integrated system. Avoid overstocking or stock-outs with automatic notification features."
        }
      }
    },
    {
      benefitCode: "BENEFIT_INVOICING",
      displayOrder: 2,
      translations: {
        id: {
          title: "Invoicing Cepat & Akurat",
          description:
            "Buat invoice profesional dalam hitungan detik. Kirim langsung ke pelanggan via email atau WhatsApp dengan template yang dapat disesuaikan."
        },
        en: {
          title: "Fast & Accurate Invoicing",
          description:
            "Create professional invoices in seconds. Send directly to customers via email or WhatsApp with customizable templates."
        }
      }
    },
    {
      benefitCode: "BENEFIT_REPORTING",
      displayOrder: 3,
      translations: {
        id: {
          title: "Laporan Keuangan Lengkap",
          description:
            "Dapatkan insight bisnis dengan laporan keuangan yang komprehensif. Lihat profit, loss, cash flow, dan metrics lainnya dalam satu dashboard."
        },
        en: {
          title: "Comprehensive Financial Reports",
          description:
            "Get business insights with comprehensive financial reports. View profit, loss, cash flow, and other metrics in one dashboard."
        }
      }
    },
    {
      benefitCode: "BENEFIT_CUSTOMER",
      displayOrder: 4,
      translations: {
        id: {
          title: "Customer Relationship Management",
          description:
            "Kelola database pelanggan dengan mudah. Track riwayat transaksi, kelola piutang, dan bangun loyalitas pelanggan."
        },
        en: {
          title: "Customer Relationship Management",
          description:
            "Easily manage customer database. Track transaction history, manage receivables, and build customer loyalty."
        }
      }
    },
    {
      benefitCode: "BENEFIT_MULTI_LOCATION",
      displayOrder: 5,
      translations: {
        id: {
          title: "Multi-Lokasi & Multi-Gudang",
          description:
            "Kelola beberapa toko atau gudang dalam satu sistem. Monitor performa setiap lokasi dan transfer stok antar cabang dengan mudah."
        },
        en: {
          title: "Multi-Location & Multi-Warehouse",
          description:
            "Manage multiple stores or warehouses in one system. Monitor each location's performance and easily transfer stock between branches."
        }
      }
    },
    {
      benefitCode: "BENEFIT_INTEGRATION",
      displayOrder: 6,
      translations: {
        id: {
          title: "Integrasi Marketplace & Payment",
          description:
            "Sinkronkan dengan marketplace favorit Anda dan terima pembayaran dari berbagai metode. Otomasi operasional untuk hemat waktu."
        },
        en: {
          title: "Marketplace & Payment Integration",
          description:
            "Sync with your favorite marketplaces and accept payments from various methods. Automate operations to save time."
        }
      }
    }
  ];

  for (const benefit of benefits) {
    const created = await prisma.eRPBenefit.create({
      data: {
        benefitCode: benefit.benefitCode,
        displayOrder: benefit.displayOrder,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: Locale.id,
              title: benefit.translations.id.title,
              description: benefit.translations.id.description
            },
            {
              locale: Locale.en,
              title: benefit.translations.en.title,
              description: benefit.translations.en.description
            }
          ]
        }
      },
      include: {
        translations: true
      }
    });

    console.log(`✅ Benefit created: ${benefit.translations.id.title} (ID: ${created.benefitId})`);
  }

  console.log(`\n✨ Seeding completed! Total benefits: ${benefits.length}`);
}

main()
  .catch(e => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
