import { PrismaClient, Locale } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting ProcessStep seeding...\n");

  const adminUser = await prisma.adminUser.findFirst();

  if (!adminUser) {
    console.error("❌ Error: No admin user found. Please run seed-admin first.");
    process.exit(1);
  }

  // Create process steps
  const steps = [
    {
      stepCode: "STEP_REGISTER",
      displayOrder: 1,
      translations: {
        id: {
          title: "Daftar & Pilih Paket",
          description: "Pilih paket yang sesuai dengan kebutuhan bisnis Anda dan lakukan pendaftaran dalam hitungan menit."
        },
        en: {
          title: "Register & Choose Plan",
          description: "Select the plan that suits your business needs and complete registration in minutes."
        }
      }
    },
    {
      stepCode: "STEP_SETUP",
      displayOrder: 2,
      translations: {
        id: {
          title: "Setup Sistem",
          description: "Konfigurasikan pengaturan awal seperti data perusahaan, produk, dan kategori dengan mudah."
        },
        en: {
          title: "Setup System",
          description: "Easily configure initial settings such as company data, products, and categories."
        }
      }
    },
    {
      stepCode: "STEP_MANAGE",
      displayOrder: 3,
      translations: {
        id: {
          title: "Kelola Bisnis",
          description: "Mulai kelola penjualan, stok, pelanggan, dan laporan keuangan dari satu dashboard."
        },
        en: {
          title: "Manage Business",
          description: "Start managing sales, inventory, customers, and financial reports from one dashboard."
        }
      }
    },
    {
      stepCode: "STEP_GROW",
      displayOrder: 4,
      translations: {
        id: {
          title: "Kembangkan Usaha",
          description: "Gunakan data dan insights untuk mengembangkan bisnis Anda ke level berikutnya."
        },
        en: {
          title: "Grow Your Business",
          description: "Use data and insights to grow your business to the next level."
        }
      }
    }
  ];

  for (const step of steps) {
    const created = await prisma.processStep.create({
      data: {
        stepCode: step.stepCode,
        displayOrder: step.displayOrder,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: Locale.id,
              title: step.translations.id.title,
              description: step.translations.id.description
            },
            {
              locale: Locale.en,
              title: step.translations.en.title,
              description: step.translations.en.description
            }
          ]
        }
      },
      include: {
        translations: true
      }
    });

    console.log(`✅ Step created: ${step.translations.id.title} (ID: ${created.stepId})`);
  }

  console.log(`\n✨ Seeding completed! Total steps: ${steps.length}`);
}

main()
  .catch(e => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
