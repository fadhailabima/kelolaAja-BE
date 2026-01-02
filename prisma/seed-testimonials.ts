import { PrismaClient, Locale } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("💬 Seeding testimonials...");

  // Ensure admin user exists for createdBy
  const adminUser = await prisma.adminUser.findFirst();
  if (!adminUser) {
    console.log("⚠️  No admin user found. Please run main seed first.");
    return;
  }

  const testimonials = [
    {
      name: 'Puji Waluyo',
      title: 'Manager',
      company: 'Sriendo Food Prima',
      rating: 5,
      isActive: true,
      displayOrder: 1,
      translations: {
        id: { quote: 'Mengguanakan software ERP KelolaAja yang simpel, praktis, dan mudah digunakan, menjadikan pengelolaan lebih cepat dan efisien.' },
        en: { quote: 'Using KelolaAja ERP software which is simple, practical, and easy to use, makes management faster and more efficient.' }
      }
    },
    {
      name: 'Angga Yudhitama Putra',
      title: 'CEO',
      company: 'Sriendo Food Prima',
      rating: 5,
      isActive: true,
      displayOrder: 2,
      translations: {
        id: { quote: 'KelolaAja yang simpel, praktis, dan mudah digunakan, menjadikan pengelolaan lebih cepat dan efisien serta dapat di akses dimana saja.' },
        en: { quote: 'KelolaAja which is simple, practical, and easy to use, makes management faster and more efficient and can be accessed anywhere.' }
      }
    },
    {
      name: 'Ayu Panduwinata',
      title: 'Manager Finance',
      company: '',
      rating: 5,
      isActive: true,
      displayOrder: 3,
      translations: {
        id: { quote: 'Pengelolaan keuangan yang lebih efisien, laporan real-time, dan pengambilan keputusan yang lebih cepat dan akurat.' },
        en: { quote: 'More efficient financial management, real-time reports, and faster and more accurate decision making.' }
      }
    }
  ];

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name } });
    if (!existing) {
      await prisma.testimonial.create({
        data: {
          name: t.name,
          title: t.title,
          company: t.company,
          rating: t.rating,
          isActive: t.isActive,
          displayOrder: t.displayOrder,
          createdBy: adminUser.userId,
          updatedBy: adminUser.userId,
          translations: {
            create: [
              { locale: Locale.id, quote: t.translations.id.quote },
              { locale: Locale.en, quote: t.translations.en.quote }
            ]
          }
        }
      });
      console.log(`✅ Testimonial created: ${t.name}`);
    } else {
      console.log(`⏭️  Testimonial ${t.name} already exists`);
    }
  }

  console.log(`\n✨ Seeding completed!`);
}

main()
  .catch(e => {
    console.error("❌ Error seeding testimonials:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
