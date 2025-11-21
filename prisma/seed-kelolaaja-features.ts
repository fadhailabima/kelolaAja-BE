import { PrismaClient, Locale } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting KelolaAjaFeature seeding...\n");

  const adminUser = await prisma.adminUser.findFirst();

  if (!adminUser) {
    console.error("❌ Error: No admin user found. Please run seed-admin first.");
    process.exit(1);
  }

  // Create KelolaAja features
  const features = [
    {
      featureCode: "KELOLA_INVENTORY",
      displayOrder: 1,
      iconName: "inventory",
      translations: {
        id: {
          title: "Manajemen Stok Pintar",
          description: "Tracking stok real-time dengan multi-lokasi dan multi-gudang. Notifikasi otomatis saat stok menipis."
        },
        en: {
          title: "Smart Inventory Management",
          description:
            "Real-time stock tracking with multi-location and multi-warehouse. Automatic notifications when stock runs low."
        }
      }
    },
    {
      featureCode: "KELOLA_POS",
      displayOrder: 2,
      iconName: "point_of_sale",
      translations: {
        id: {
          title: "Point of Sale (POS)",
          description:
            "Sistem kasir modern dengan interface intuitif. Support barcode scanner, printer thermal, dan berbagai metode pembayaran."
        },
        en: {
          title: "Point of Sale (POS)",
          description:
            "Modern cashier system with intuitive interface. Supports barcode scanner, thermal printer, and various payment methods."
        }
      }
    },
    {
      featureCode: "KELOLA_ACCOUNTING",
      displayOrder: 3,
      iconName: "account_balance",
      translations: {
        id: {
          title: "Akuntansi Terintegrasi",
          description:
            "Pembukuan otomatis, laporan keuangan lengkap, dan rekonsiliasi bank yang terintegrasi dengan transaksi bisnis."
        },
        en: {
          title: "Integrated Accounting",
          description:
            "Automatic bookkeeping, complete financial reports, and bank reconciliation integrated with business transactions."
        }
      }
    },
    {
      featureCode: "KELOLA_CRM",
      displayOrder: 4,
      iconName: "groups",
      translations: {
        id: {
          title: "Customer Management",
          description:
            "Database pelanggan lengkap, program loyalitas, dan analisis perilaku pembelian untuk meningkatkan penjualan."
        },
        en: {
          title: "Customer Management",
          description: "Complete customer database, loyalty programs, and purchase behavior analysis to increase sales."
        }
      }
    },
    {
      featureCode: "KELOLA_PURCHASE",
      displayOrder: 5,
      iconName: "shopping_cart",
      translations: {
        id: {
          title: "Procurement & Supplier",
          description: "Kelola purchase order, vendor management, dan tracking pengiriman dengan sistem yang terorganisir."
        },
        en: {
          title: "Procurement & Supplier",
          description: "Manage purchase orders, vendor management, and delivery tracking with an organized system."
        }
      }
    },
    {
      featureCode: "KELOLA_REPORTING",
      displayOrder: 6,
      iconName: "assessment",
      translations: {
        id: {
          title: "Dashboard & Reporting",
          description: "Visualisasi data bisnis real-time dengan grafik interaktif. Export laporan dalam berbagai format."
        },
        en: {
          title: "Dashboard & Reporting",
          description: "Real-time business data visualization with interactive charts. Export reports in various formats."
        }
      }
    },
    {
      featureCode: "KELOLA_MOBILE",
      displayOrder: 7,
      iconName: "phone_iphone",
      translations: {
        id: {
          title: "Akses Mobile",
          description: "Kelola bisnis dari smartphone atau tablet. Aplikasi native iOS dan Android dengan full features."
        },
        en: {
          title: "Mobile Access",
          description: "Manage business from smartphone or tablet. Native iOS and Android apps with full features."
        }
      }
    },
    {
      featureCode: "KELOLA_CLOUD",
      displayOrder: 8,
      iconName: "cloud",
      translations: {
        id: {
          title: "Cloud-Based System",
          description: "Data tersimpan aman di cloud dengan backup otomatis. Akses dari mana saja tanpa instalasi software."
        },
        en: {
          title: "Cloud-Based System",
          description:
            "Data stored securely in the cloud with automatic backup. Access from anywhere without software installation."
        }
      }
    }
  ];

  for (const feature of features) {
    const created = await prisma.kelolaAjaFeature.create({
      data: {
        featureCode: feature.featureCode,
        displayOrder: feature.displayOrder,
        iconName: feature.iconName,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: Locale.id,
              title: feature.translations.id.title,
              description: feature.translations.id.description
            },
            {
              locale: Locale.en,
              title: feature.translations.en.title,
              description: feature.translations.en.description
            }
          ]
        }
      },
      include: {
        translations: true
      }
    });

    console.log(`✅ Feature created: ${feature.translations.id.title} (ID: ${created.featureId})`);
  }

  console.log(`\n✨ Seeding completed! Total features: ${features.length}`);
}

main()
  .catch(e => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
