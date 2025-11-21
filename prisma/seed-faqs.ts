import { PrismaClient, Locale } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("❓ Seeding FAQ data...");

  // Create FAQ Categories
  const categories = [
    {
      categoryCode: "GENERAL",
      displayOrder: 1,
      translations: {
        id: { categoryName: "Umum" },
        en: { categoryName: "General" }
      }
    },
    {
      categoryCode: "PRICING",
      displayOrder: 2,
      translations: {
        id: { categoryName: "Harga & Paket" },
        en: { categoryName: "Pricing & Plans" }
      }
    },
    {
      categoryCode: "FEATURES",
      displayOrder: 3,
      translations: {
        id: { categoryName: "Fitur" },
        en: { categoryName: "Features" }
      }
    },
    {
      categoryCode: "SUPPORT",
      displayOrder: 4,
      translations: {
        id: { categoryName: "Dukungan & Bantuan" },
        en: { categoryName: "Support & Help" }
      }
    }
  ];

  const createdCategories: any = {};

  for (const categoryData of categories) {
    const { translations, ...data } = categoryData;

    const category = await prisma.fAQCategory.create({
      data: {
        ...data,
        createdBy: 1,
        updatedBy: 1,
        translations: {
          create: [
            {
              locale: Locale.id,
              categoryName: translations.id.categoryName
            },
            {
              locale: Locale.en,
              categoryName: translations.en.categoryName
            }
          ]
        }
      }
    });

    createdCategories[categoryData.categoryCode] = category.categoryId;
    console.log(`✅ Category created: ${categoryData.categoryCode} (ID: ${category.categoryId})`);
  }

  // Create FAQs
  const faqs = [
    // GENERAL
    {
      categoryCode: "GENERAL",
      displayOrder: 1,
      translations: {
        id: {
          question: "Apa itu KelolaAja?",
          answer:
            "KelolaAja adalah platform ERP (Enterprise Resource Planning) berbasis cloud yang dirancang khusus untuk UMKM di Indonesia. Kami menyediakan solusi lengkap untuk mengelola keuangan, inventori, penjualan, dan operasional bisnis Anda dalam satu sistem terintegrasi."
        },
        en: {
          question: "What is KelolaAja?",
          answer:
            "KelolaAja is a cloud-based ERP (Enterprise Resource Planning) platform specifically designed for SMEs in Indonesia. We provide comprehensive solutions to manage your finances, inventory, sales, and business operations in one integrated system."
        }
      }
    },
    {
      categoryCode: "GENERAL",
      displayOrder: 2,
      translations: {
        id: {
          question: "Apakah data saya aman?",
          answer:
            "Ya, keamanan data Anda adalah prioritas utama kami. Kami menggunakan enkripsi SSL/TLS untuk semua transfer data, backup otomatis harian, dan server yang tersertifikasi internasional. Data Anda disimpan di data center yang aman dan terpercaya."
        },
        en: {
          question: "Is my data secure?",
          answer:
            "Yes, your data security is our top priority. We use SSL/TLS encryption for all data transfers, daily automatic backups, and internationally certified servers. Your data is stored in secure and trusted data centers."
        }
      }
    },
    // PRICING
    {
      categoryCode: "PRICING",
      displayOrder: 1,
      translations: {
        id: {
          question: "Berapa biaya berlangganan KelolaAja?",
          answer:
            "Kami menawarkan berbagai paket berlangganan mulai dari Rp 50.000/bulan untuk paket Starter hingga paket Enterprise dengan harga yang dapat disesuaikan. Semua paket dihitung per pengguna per bulan. Silakan lihat halaman Pricing untuk detail lengkap."
        },
        en: {
          question: "How much does KelolaAja subscription cost?",
          answer:
            "We offer various subscription packages starting from Rp 50,000/month for the Starter package to Enterprise packages with customizable pricing. All packages are calculated per user per month. Please see our Pricing page for complete details."
        }
      }
    },
    {
      categoryCode: "PRICING",
      displayOrder: 2,
      translations: {
        id: {
          question: "Apakah ada periode trial gratis?",
          answer:
            "Ya! Kami menyediakan free trial selama 14 hari tanpa perlu kartu kredit. Anda bisa mencoba semua fitur di paket Professional untuk merasakan manfaat KelolaAja sebelum berlangganan."
        },
        en: {
          question: "Is there a free trial period?",
          answer:
            "Yes! We provide a 14-day free trial with no credit card required. You can try all features in the Professional package to experience the benefits of KelolaAja before subscribing."
        }
      }
    },
    {
      categoryCode: "PRICING",
      displayOrder: 3,
      translations: {
        id: {
          question: "Bisakah saya upgrade atau downgrade paket?",
          answer:
            "Tentu! Anda dapat mengubah paket berlangganan kapan saja. Untuk upgrade, fitur baru akan langsung aktif dan selisih biaya akan diproporsionalkan. Untuk downgrade, perubahan akan berlaku di periode berikutnya."
        },
        en: {
          question: "Can I upgrade or downgrade my plan?",
          answer:
            "Of course! You can change your subscription plan anytime. For upgrades, new features will be activated immediately and the price difference will be prorated. For downgrades, changes will take effect in the next period."
        }
      }
    },
    // FEATURES
    {
      categoryCode: "FEATURES",
      displayOrder: 1,
      translations: {
        id: {
          question: "Apa saja fitur utama KelolaAja?",
          answer:
            "Fitur utama KelolaAja meliputi: Manajemen Keuangan (jurnal, laporan keuangan), Inventory Management, Point of Sale (POS), Manajemen Penjualan & Pembelian, HR & Payroll, Multi-cabang, dan Dashboard Analytics real-time."
        },
        en: {
          question: "What are the main features of KelolaAja?",
          answer:
            "Main features of KelolaAja include: Financial Management (journal, financial reports), Inventory Management, Point of Sale (POS), Sales & Purchase Management, HR & Payroll, Multi-branch, and real-time Analytics Dashboard."
        }
      }
    },
    {
      categoryCode: "FEATURES",
      displayOrder: 2,
      translations: {
        id: {
          question: "Apakah bisa diakses dari smartphone?",
          answer:
            "Ya, KelolaAja dapat diakses dari berbagai perangkat termasuk smartphone, tablet, dan komputer. Interface kami responsive dan mobile-friendly sehingga Anda bisa mengelola bisnis dari mana saja."
        },
        en: {
          question: "Can it be accessed from smartphones?",
          answer:
            "Yes, KelolaAja can be accessed from various devices including smartphones, tablets, and computers. Our interface is responsive and mobile-friendly so you can manage your business from anywhere."
        }
      }
    },
    // SUPPORT
    {
      categoryCode: "SUPPORT",
      displayOrder: 1,
      translations: {
        id: {
          question: "Bagaimana cara mendapatkan bantuan?",
          answer:
            "Kami menyediakan berbagai channel support: Email support (support@kelolaaja.com), Live chat di website (Senin-Jumat 09:00-17:00 WIB), Knowledge base lengkap, dan Tutorial video. Tim support kami siap membantu Anda!"
        },
        en: {
          question: "How do I get help?",
          answer:
            "We provide various support channels: Email support (support@kelolaaja.com), Live chat on website (Monday-Friday 09:00-17:00 WIB), Comprehensive knowledge base, and Video tutorials. Our support team is ready to help you!"
        }
      }
    },
    {
      categoryCode: "SUPPORT",
      displayOrder: 2,
      translations: {
        id: {
          question: "Apakah ada pelatihan untuk pengguna baru?",
          answer:
            "Ya! Kami menyediakan onboarding session gratis untuk semua pelanggan baru, dokumentasi lengkap, video tutorial, dan webinar rutin. Untuk paket Enterprise, tersedia juga dedicated account manager dan training khusus."
        },
        en: {
          question: "Is there training for new users?",
          answer:
            "Yes! We provide free onboarding sessions for all new customers, complete documentation, video tutorials, and regular webinars. For Enterprise packages, there is also a dedicated account manager and specialized training."
        }
      }
    }
  ];

  for (const faqData of faqs) {
    const { categoryCode, translations, ...data } = faqData;

    const faq = await prisma.fAQ.create({
      data: {
        ...data,
        categoryId: createdCategories[categoryCode],
        createdBy: 1,
        updatedBy: 1,
        translations: {
          create: [
            {
              locale: Locale.id,
              question: translations.id.question,
              answer: translations.id.answer
            },
            {
              locale: Locale.en,
              question: translations.en.question,
              answer: translations.en.answer
            }
          ]
        }
      }
    });

    console.log(`✅ FAQ created: ${translations.id.question.substring(0, 50)}... (ID: ${faq.faqId})`);
  }

  console.log(`\n✨ Seeding completed!`);
  console.log(`   - Categories: ${categories.length}`);
  console.log(`   - FAQs: ${faqs.length}`);
}

main()
  .catch(e => {
    console.error("❌ Error seeding FAQ data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
