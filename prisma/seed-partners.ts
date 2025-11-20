import { PrismaClient, Locale } from "@prisma/client";

const prisma = new PrismaClient();

async function seedPartners() {
  console.log("🤝 Seeding partners...");

  const admin = await prisma.adminUser.findFirst({
    where: { role: "Admin" }
  });

  if (!admin) {
    console.log("⚠️  No admin user found. Please run main seed first.");
    return;
  }

  // Define partners with translations
  const partners = [
    {
      partnerName: "PT Mitra Teknologi Indonesia",
      websiteUrl: "https://mitratekno.id",
      displayOrder: 1,
      translations: {
        id: {
          description: "Partner strategis dalam solusi teknologi bisnis"
        },
        en: {
          description: "Strategic partner in business technology solutions"
        }
      }
    },
    {
      partnerName: "CV Digital Nusantara",
      websiteUrl: "https://digitalnusantara.co.id",
      displayOrder: 2,
      translations: {
        id: {
          description: "Penyedia layanan transformasi digital terpercaya"
        },
        en: {
          description: "Trusted digital transformation service provider"
        }
      }
    },
    {
      partnerName: "PT Solusi Bisnis Modern",
      websiteUrl: "https://solusimodern.com",
      displayOrder: 3,
      translations: {
        id: {
          description: "Konsultan ERP dan sistem manajemen bisnis"
        },
        en: {
          description: "ERP and business management system consultant"
        }
      }
    },
    {
      partnerName: "Koperasi Sejahtera Bersama",
      websiteUrl: null,
      displayOrder: 4,
      translations: {
        id: {
          description: "Klien terpercaya sejak 2020"
        },
        en: {
          description: "Trusted client since 2020"
        }
      }
    },
    {
      partnerName: "PT Retail Indonesia Jaya",
      websiteUrl: "https://retailjaya.id",
      displayOrder: 5,
      translations: {
        id: {
          description: "Perusahaan retail terkemuka di Indonesia"
        },
        en: {
          description: "Leading retail company in Indonesia"
        }
      }
    },
    {
      partnerName: "UD Makmur Sentosa",
      websiteUrl: null,
      displayOrder: 6,
      translations: {
        id: {
          description: "UMKM yang berkembang dengan KelolaAja"
        },
        en: {
          description: "Growing SME with KelolaAja"
        }
      }
    }
  ];

  for (const partnerData of partners) {
    const { translations, ...partnerFields } = partnerData;

    const existingPartner = await prisma.partner.findUnique({
      where: { partnerName: partnerFields.partnerName }
    });

    if (existingPartner) {
      console.log(`  ⏭️  Partner ${partnerFields.partnerName} already exists, skipping...`);
      continue;
    }

    const partner = await prisma.partner.create({
      data: {
        ...partnerFields,
        logoFileId: null, // Will be updated later when MediaFile is implemented
        createdBy: admin.userId,
        updatedBy: admin.userId,
        translations: {
          create: [
            {
              locale: Locale.id,
              description: translations.id.description
            },
            {
              locale: Locale.en,
              description: translations.en.description
            }
          ]
        }
      },
      include: {
        translations: true
      }
    });

    console.log(`  ✅ Partner created: ${partner.partnerName} (ID: ${partner.partnerId})`);
  }

  console.log("✅ Partners seeding completed!");
}

async function main() {
  try {
    await seedPartners();
  } catch (error) {
    console.error("❌ Error during partners seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
