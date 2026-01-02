import { PrismaClient, Locale } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting ERPBenefit seeding...\n");

  const adminUser = await prisma.adminUser.findFirst();

  if (!adminUser) {
    console.error("❌ Error: No admin user found. Please run seed-admin first.");
    process.exit(1);
  }

  // Create ERP benefits from frontend data
  const benefits = [
    { code: 'purchasing', title: { id: 'Purchasing', en: 'Purchasing' }, desc: { id: 'Buat purchase order dan faktur dalam satu langkah mudah.', en: 'Create purchase orders and invoices in one easy step.' }, img: '/images/home/purchasing.jpg' },
    { code: 'multiWarehouse', title: { id: 'Multi Gudang', en: 'Multi Warehouse' }, desc: { id: 'KelolaAja stok produkmu dibanyak tempat dengan mudah dan pantau stok pergudang secara realtime.', en: 'Manage your product stock in many places easily and monitor stock per warehouse in real-time.' }, img: '/images/home/multi-gudang.jpg' },
    { code: 'importExcel', title: { id: 'Import dari Excel', en: 'Import from Excel' }, desc: { id: 'Tidak perlu lagi repot memasukkan data produk dan stok secara manual, cukup ketik di Excel dan unggah.', en: 'No need to manually enter product and stock data, just type in Excel and upload.' }, img: '/images/inventory/import-excel.jpg' },
  ];

  for (const [index, b] of benefits.entries()) {
    const existing = await prisma.eRPBenefit.findUnique({ where: { benefitCode: b.code } });

    if (existing) {
      console.log(`⏭️  Benefit ${b.code} already exists`);
      continue;
    }

    // Create MediaFile for image
    const mediaFile = await prisma.mediaFile.create({
      data: {
        fileName: `erp-${b.code}.jpg`,
        filePath: `/seeds/erp/erp-${b.code}.jpg`,
        mimeType: 'image/jpeg',
        fileSize: 2048,
        storageUrl: b.img,
        uploadedBy: adminUser.userId,
      }
    });

    await prisma.eRPBenefit.create({
      data: {
        benefitCode: b.code,
        displayOrder: index + 1,
        isActive: true,
        imageFileId: mediaFile.fileId,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: Locale.id,
              title: b.title.id,
              description: b.desc.id
            },
            {
              locale: Locale.en,
              title: b.title.en,
              description: b.desc.en
            }
          ]
        }
      },
      include: {
        translations: true
      }
    });

    console.log(`✅ Benefit created: ${b.title.id}`);
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
