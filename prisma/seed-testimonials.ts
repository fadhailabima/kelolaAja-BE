import { PrismaClient, Locale } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('💬 Seeding testimonials...');

  const testimonials = [
    {
      name: 'Budi Santoso',
      title: 'CEO',
      company: 'PT Maju Bersama',
      rating: 5,
      isFeatured: true,
      displayOrder: 1,
      translations: {
        id: {
          quote:
            'KelolaAja sangat membantu kami dalam mengelola keuangan perusahaan. Fiturnya lengkap dan mudah digunakan!',
        },
        en: {
          quote:
            'KelolaAja really helps us manage our company finances. The features are complete and easy to use!',
        },
      },
    },
    {
      name: 'Siti Nurhaliza',
      title: 'Finance Manager',
      company: 'CV Digital Nusantara',
      rating: 5,
      isFeatured: true,
      displayOrder: 2,
      translations: {
        id: {
          quote:
            'Sistem ERP terbaik untuk UMKM! Harga terjangkau dengan fitur yang powerful. Tim support juga sangat responsif.',
        },
        en: {
          quote:
            'Best ERP system for SMEs! Affordable price with powerful features. The support team is also very responsive.',
        },
      },
    },
    {
      name: 'Ahmad Fauzi',
      title: 'Owner',
      company: 'Toko Elektronik Jaya',
      rating: 4,
      isFeatured: false,
      displayOrder: 3,
      translations: {
        id: {
          quote:
            'Proses inventory management jadi lebih mudah. Laporan real-time sangat membantu dalam pengambilan keputusan bisnis.',
        },
        en: {
          quote:
            'Inventory management process becomes easier. Real-time reports are very helpful in making business decisions.',
        },
      },
    },
    {
      name: 'Diana Putri',
      title: 'Accountant',
      company: 'Koperasi Sejahtera',
      rating: 5,
      isFeatured: true,
      displayOrder: 4,
      translations: {
        id: {
          quote:
            'Fitur accounting-nya sangat lengkap. Dari jurnal umum sampai laporan keuangan, semua ada. Recommended!',
        },
        en: {
          quote:
            'The accounting features are very complete. From general ledger to financial statements, everything is there. Recommended!',
        },
      },
    },
    {
      name: 'Eko Prasetyo',
      title: 'Operations Manager',
      company: 'PT Logistik Indonesia',
      rating: 4,
      isFeatured: false,
      displayOrder: 5,
      translations: {
        id: {
          quote:
            'Dashboard analytics sangat informatif. Memudahkan kami dalam monitoring operasional harian perusahaan.',
        },
        en: {
          quote:
            'The analytics dashboard is very informative. Makes it easier for us to monitor daily company operations.',
        },
      },
    },
    {
      name: 'Rina Wijaya',
      title: 'HR Director',
      company: 'CV Sukses Makmur',
      rating: 5,
      isFeatured: false,
      displayOrder: 6,
      translations: {
        id: {
          quote:
            'Modul HR dan payroll sangat membantu. Proses penggajian karyawan jadi otomatis dan akurat.',
        },
        en: {
          quote:
            'The HR and payroll module is very helpful. The employee payroll process becomes automatic and accurate.',
        },
      },
    },
  ];

  for (const testimonialData of testimonials) {
    const { translations, ...data } = testimonialData;

    const testimonial = await prisma.testimonial.create({
      data: {
        ...data,
        createdBy: 1, // Admin user
        updatedBy: 1,
        translations: {
          create: [
            {
              locale: Locale.id,
              quote: translations.id.quote,
            },
            {
              locale: Locale.en,
              quote: translations.en.quote,
            },
          ],
        },
      },
      include: {
        translations: true,
      },
    });

    console.log(
      `✅ Testimonial created: ${testimonial.name} from ${testimonial.company} (ID: ${testimonial.testimonialId})`
    );
  }

  console.log(`\n✨ Seeding completed! Created ${testimonials.length} testimonials.`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding testimonials:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
