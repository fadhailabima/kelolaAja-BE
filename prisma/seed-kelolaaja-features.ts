import { PrismaClient, Locale } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting KelolaAjaFeature seeding...\n");

  const adminUser = await prisma.adminUser.findFirst();
  if (!adminUser) {
    console.error("❌ Error: No admin user found. Please run seed-admin first.");
    process.exit(1);
  }

  // Create KelolaAja features from frontend data
  const features = [
    {
      iconName: 'shield',
      title: { id: 'Keamanan', en: 'Security' },
      description: { id: 'Seluruh komunikasi dengan server dienkripsi dengan 256-bit SSL encryption.', en: 'All communication with the server is encrypted with 256-bit SSL encryption.' },
      displayOrder: 1
    },
    {
      iconName: 'lock',
      title: { id: 'Pembatasan Hak Akses', en: 'Access Rights Restriction' },
      description: { id: 'Atur hak akses untuk setiap karyawan atau akuntan di perusahaanmu. Pastikan hanya memberi hak akses sesuai kebutuhan.', en: 'Set access rights for every employee or accountant in your company. Ensure to only grant access rights as needed.' },
      displayOrder: 2
    },
    {
      iconName: 'chart',
      title: { id: 'Penyusutan Aset Otomatis', en: 'Automatic Asset Depreciation' },
      description: { id: 'Perhitungan penyusutan aset tetap akan dilakukan secara otomatis oleh KelolaAja.', en: 'Fixed asset depreciation calculation will be done automatically by KelolaAja.' },
      displayOrder: 3
    },
    {
      iconName: 'cloud',
      title: { id: 'Akses Dari Mana Saja', en: 'Access From Anywhere' },
      description: { id: 'iOs, Android, Windows, Mac semua bisa untuk mengakses KelolaAja. Tak perlu khawatir!', en: 'iOS, Android, Windows, Mac can all access KelolaAja. No need to worry!' },
      displayOrder: 4
    },
    {
      iconName: 'document',
      title: { id: 'Kustom Akun Akuntansi', en: 'Custom Accounting Accounts' },
      description: { id: 'Tambah ubah dan hapus akun akuntansi (Chart of Accounts) sesuai kebutuhan bisnismu.', en: 'Add, change, and delete accounting accounts (Chart of Accounts) according to your business needs.' },
      displayOrder: 5
    },
    {
      iconName: 'calculator',
      title: { id: 'Perhitungan Pajak', en: 'Tax Calculation' },
      description: { id: 'Pajakmu akan otomatis dikalkulasi secara realtime oleh KelolaAja. Tak perlu lagi ribet hitung-hitung pajak.', en: 'Your taxes will be automatically calculated in real-time by KelolaAja. No need to bother with tax calculations anymore.' },
      displayOrder: 6
    },
    {
      iconName: 'tax',
      title: { id: 'Kustomisasi Pajak', en: 'Tax Customization' },
      description: { id: 'Buat pajak sesuai kebutuhan, berapa persen potongannya dan sebagainya.', en: 'Create taxes as needed, including percentage deductions and so on.' },
      displayOrder: 7
    },
    {
      iconName: 'statistics',
      title: { id: 'Statistik Bisnis', en: 'Business Statistics' },
      description: { id: 'Dapatkan grafik statistik secara realtime untuk memantau performa bisnismu setiap saat.', en: 'Get real-time statistical graphs to monitor your business performance at all times.' },
      displayOrder: 8
    },
    {
      iconName: 'import',
      title: { id: 'Import Data Masal Excel', en: 'Bulk Excel Data Import' },
      description: { id: 'Import data invoice, purchase order, produk dan sebagainya dengan file excel, bisa ratusan data dalam satu waktu.', en: 'Import invoice data, purchase orders, products, and so on with an Excel file, hundreds of data at once.' },
      displayOrder: 9
    }
  ];

  for (const feature of features) {
    // Generate code from title (english) for uniqueness check
    const code = 'FEAT_' + feature.title.en.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');

    const existing = await prisma.kelolaAjaFeature.findFirst({ where: { featureCode: code } });

    if (!existing) {
      await prisma.kelolaAjaFeature.create({
        data: {
          featureCode: code,
          displayOrder: feature.displayOrder,
          iconName: feature.iconName,
          isActive: true,
          createdBy: adminUser.userId,
          updatedBy: adminUser.userId,
          translations: {
            create: [
              {
                locale: Locale.id,
                title: feature.title.id,
                description: feature.description.id
              },
              {
                locale: Locale.en,
                title: feature.title.en,
                description: feature.description.en
              }
            ]
          }
        }
      });
      console.log(`✅ Feature created: ${feature.title.id}`);
    } else {
      console.log(`⏭️  Feature ${feature.title.id} already exists`);
    }
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
