import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding gass...\n");

  // ============================================
  // 1. CREATE ADMIN USER
  // ============================================
  console.log("👤 Seeding Admin User...");
  const hashedPassword = await bcrypt.hash("admin123", 10); // TODO: Change password!

  const adminUser = await prisma.adminUser.upsert({
    where: { email: "admin@kelolaaja.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@kelolaaja.com",
      passwordHash: hashedPassword,
      fullName: "Admin KelolaAja",
      role: "Admin",
      isActive: true,
    },
  });
  console.log(
    "✅ Admin User created (email: admin@kelolaaja.com, password: admin123)\n"
  );

  // ============================================
  // 2. SEED PRICING PLANS
  // ============================================
  console.log("💰 Seeding Pricing Plans...");

  // Check if pricing plans already exist
  const existingPlansCount = await prisma.pricingPlan.count();
  if (existingPlansCount > 0) {
    console.log("⏭️  Pricing Plans already exist, skipping...\n");
  } else {
    const pricingPlansData = [
      {
        planCode: "SMALL",
        pricePerUserMonth: 250000,
        minUsers: 5,
        displayOrder: 1,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              planName: "Small",
              description:
                "Alur Bisnis Lengkap, Manajemen Stok, Aset Tetap, Inventori Multi Gudang, Laporan Keuangan & Bisnis, Multi Cabang/Divisi/Outlet/Proyek, Pembatasan Hak Akses, File Attachment, Auto Backup, Free Support",
              userRange: "5-10 User",
            },
            {
              locale: "en" as const,
              planName: "Small",
              description:
                "Complete Business Flow, Stock Management, Fixed Assets, Multi-Warehouse Inventory, Financial & Business Reports, Multi Branch/Division/Outlet/Project, Access Control, File Attachment, Auto Backup, Free Support",
              userRange: "5-10 Users",
            },
          ],
        },
      },
      {
        planCode: "MEDIUM",
        pricePerUserMonth: 225000,
        minUsers: 11,
        displayOrder: 2,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              planName: "Medium",
              description:
                "Alur Bisnis Lengkap, Manajemen Stok, Aset Tetap, Inventori Multi Gudang, Laporan Keuangan & Bisnis, Multi Cabang/Divisi/Outlet/Proyek, Pembatasan Hak Akses, File Attachment, Auto Backup, Free Support",
              userRange: "11-15 User",
            },
            {
              locale: "en" as const,
              planName: "Medium",
              description:
                "Complete Business Flow, Stock Management, Fixed Assets, Multi-Warehouse Inventory, Financial & Business Reports, Multi Branch/Division/Outlet/Project, Access Control, File Attachment, Auto Backup, Free Support",
              userRange: "11-15 Users",
            },
          ],
        },
      },
      {
        planCode: "LARGE",
        pricePerUserMonth: 210000,
        minUsers: 16,
        displayOrder: 3,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              planName: "Large",
              description:
                "Alur Bisnis Lengkap, Manajemen Stok, Aset Tetap, Inventori Multi Gudang, Laporan Keuangan & Bisnis, Multi Cabang/Divisi/Outlet/Proyek, Pembatasan Hak Akses, File Attachment, Auto Backup, Free Support",
              userRange: "Up 16 User",
            },
            {
              locale: "en" as const,
              planName: "Large",
              description:
                "Complete Business Flow, Stock Management, Fixed Assets, Multi-Warehouse Inventory, Financial & Business Reports, Multi Branch/Division/Outlet/Project, Access Control, File Attachment, Auto Backup, Free Support",
              userRange: "16+ Users",
            },
          ],
        },
      },
    ];

    for (const plan of pricingPlansData) {
      await prisma.pricingPlan.upsert({
        where: { planCode: plan.planCode },
        update: {
          pricePerUserMonth: plan.pricePerUserMonth,
          minUsers: plan.minUsers,
          displayOrder: plan.displayOrder,
          isActive: plan.isActive,
          updatedBy: plan.updatedBy,
        },
        create: plan,
      });
    }
    console.log("✅ Pricing Plans seeded (3 plans)\n");
  }

  // ============================================
  // 3. SEED TESTIMONIALS
  // ============================================
  console.log("💬 Seeding Testimonials...");

  const existingTestimonialsCount = await prisma.testimonial.count();
  if (existingTestimonialsCount > 0) {
    console.log("⏭️  Testimonials already exist, skipping...\n");
  } else {
    const testimonialsData = [
      {
        name: "Puji Waluyo",
        title: "Manager",
        company: "Sriendo Food Prima",
        rating: 5,
        isFeatured: true,
        isActive: true,
        displayOrder: 1,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              quote:
                "Mengguanakan software ERP KelolaAja yang simpel, praktis, dan mudah digunakan, menjadikan pengelolaan lebih cepat dan efisien.",
            },
            {
              locale: "en" as const,
              quote:
                "Using KelolaAja ERP software that is simple, practical, and easy to use makes management faster and more efficient.",
            },
          ],
        },
      },
      {
        name: "Angga Yudhitama Putra",
        title: "CEO",
        company: "Sriendo Food Prima",
        rating: 5,
        isFeatured: true,
        isActive: true,
        displayOrder: 2,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              quote:
                "KelolaAja yang simpel, praktis, dan mudah digunakan, menjadikan pengelolaan lebih cepat dan efisien serta dapat di akses dimana saja.",
            },
            {
              locale: "en" as const,
              quote:
                "KelolaAja is simple, practical, and easy to use, making management faster and more efficient and can be accessed anywhere.",
            },
          ],
        },
      },
      {
        name: "Ayu Panduwinata",
        title: "Manager Finance",
        company: "",
        rating: 5,
        isFeatured: false,
        isActive: true,
        displayOrder: 3,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              quote:
                "Pengelolaan keuangan yang lebih efisien, laporan real-time, dan pengambilan keputusan yang lebih cepat dan akurat.",
            },
            {
              locale: "en" as const,
              quote:
                "More efficient financial management, real-time reports, and faster and more accurate decision making.",
            },
          ],
        },
      },
    ];

    for (const testimonial of testimonialsData) {
      await prisma.testimonial.create({ data: testimonial });
    }
    console.log("✅ Testimonials seeded (3 testimonials)\n");
  }

  // ============================================
  // 4. SEED PARTNERS
  // ============================================
  console.log("🤝 Seeding Partners...");

  const existingPartnersCount = await prisma.partner.count();
  if (existingPartnersCount > 0) {
    console.log("⏭️  Partners already exist, skipping...\n");
  } else {
    const partnersData = [
      { name: "Sri", order: 1 },
      { name: "Sriendo Foods", order: 2 },
      { name: "Aura Food", order: 3 },
      { name: "Damika", order: 4 },
      { name: "KAS", order: 5 },
      { name: "MB Furnistore", order: 6 },
      { name: "MML", order: 7 },
      { name: "SBS", order: 8 },
    ];

    for (const partner of partnersData) {
      await prisma.partner.create({
        data: {
          partnerName: partner.name,
          websiteUrl: "",
          logoFileId: null, // TODO: Upload logo images and link them
          displayOrder: partner.order,
          isActive: true,
          createdBy: adminUser.userId,
          updatedBy: adminUser.userId,
          translations: {
            create: [
              { locale: "id" as const, description: "" },
              { locale: "en" as const, description: "" },
            ],
          },
        },
      });
    }
    console.log(
      "✅ Partners seeded (8 partners - logos need to be uploaded separately)\n"
    );
  }

  // ============================================
  // 5. SEED PROCESS STEPS
  // ============================================
  console.log("📋 Seeding Process Steps...");

  const existingProcessStepsCount = await prisma.processStep.count();
  if (existingProcessStepsCount > 0) {
    console.log("⏭️  Process Steps already exist, skipping...\n");
  } else {
    const processStepsData = [
      {
        stepCode: "ANALYSIS",
        iconName: "analysis",
        displayOrder: 1,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              title: "Analisa Proses Bisnis",
              description:
                "Tim konsultan kami akan mengidentifikasi masalah dan kebutuhan bisnismu",
            },
            {
              locale: "en" as const,
              title: "Business Process Analysis",
              description:
                "Our consultant team will identify your business problems and needs",
            },
          ],
        },
      },
      {
        stepCode: "PLANNING",
        iconName: "planning",
        displayOrder: 2,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              title: "Perencanaan",
              description:
                "Kami pastikan sistem bekerja sesuai dengan proses bisnismu.",
            },
            {
              locale: "en" as const,
              title: "Planning",
              description:
                "We ensure the system works according to your business process.",
            },
          ],
        },
      },
      {
        stepCode: "TRAINING",
        iconName: "training",
        displayOrder: 3,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              title: "Pelatihan",
              description:
                "Membantu user lewat pelatihan khusus untuk setiap divisi.",
            },
            {
              locale: "en" as const,
              title: "Training",
              description:
                "Helping users through specialized training for each division.",
            },
          ],
        },
      },
      {
        stepCode: "GOLIVE",
        iconName: "goingLive",
        displayOrder: 4,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              title: "Going Live",
              description:
                "Memastikan semua proses berjalan baik setelah going live.",
            },
            {
              locale: "en" as const,
              title: "Going Live",
              description:
                "Ensuring all processes run smoothly after going live.",
            },
          ],
        },
      },
    ];

    for (const step of processStepsData) {
      await prisma.processStep.create({ data: step });
    }
    console.log("✅ Process Steps seeded (4 steps)\n");
  }

  // ============================================
  // 6. SEED ERP BENEFITS
  // ============================================
  console.log("🎯 Seeding ERP Benefits...");

  const existingERPBenefitsCount = await prisma.eRPBenefit.count();
  if (existingERPBenefitsCount > 0) {
    console.log("⏭️  ERP Benefits already exist, skipping...\n");
  } else {
    const erpBenefitsData = [
      {
        benefitCode: "SALES",
        imageFileId: null,
        displayOrder: 1,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              title: "Penjualan",
              description:
                "Kelola seluruh proses penjualan secara terintegrasi, mulai dari penawaran, pesanan pelanggan, pengiriman, hingga penagihan dan penerimaan pembayaran.",
            },
            {
              locale: "en" as const,
              title: "Sales",
              description:
                "Manage the entire sales process in an integrated manner, from quotations, customer orders, delivery, to billing and payment receipts.",
            },
          ],
        },
      },
      {
        benefitCode: "MULTIWAREHOUSE",
        imageFileId: null,
        displayOrder: 2,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              title: "Multi Gudang",
              description:
                "Kelola stok dan pergerakan barang di berbagai lokasi gudang secara terpusat dan real-time.",
            },
            {
              locale: "en" as const,
              title: "Multi Warehouse",
              description:
                "Manage stock and goods movement across various warehouse locations centrally and in real-time.",
            },
          ],
        },
      },
      {
        benefitCode: "DARKMODE",
        imageFileId: null,
        displayOrder: 3,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              title: "Dark Mode",
              description:
                "Nikmati tampilan antarmuka yang lebih nyaman untuk penggunaan jangka panjang.",
            },
            {
              locale: "en" as const,
              title: "Dark Mode",
              description:
                "Enjoy a more comfortable interface display for long-term use.",
            },
          ],
        },
      },
      {
        benefitCode: "MULTIEXPORT",
        imageFileId: null,
        displayOrder: 4,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              title: "Multi Export Invoice",
              description:
                "Ekspor invoice penjualan ke berbagai format sesuai kebutuhan bisnis.",
            },
            {
              locale: "en" as const,
              title: "Multi Export Invoice",
              description:
                "Export sales invoices to various formats according to business needs.",
            },
          ],
        },
      },
      {
        benefitCode: "APPROVAL",
        imageFileId: null,
        displayOrder: 5,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              title: "Approval Dokumen",
              description:
                "Kelola proses persetujuan dokumen secara terkontrol sebelum transaksi diproses lebih lanjut.",
            },
            {
              locale: "en" as const,
              title: "Document Approval",
              description:
                "Manage document approval processes in a controlled manner before transactions are processed further.",
            },
          ],
        },
      },
    ];

    for (const benefit of erpBenefitsData) {
      await prisma.eRPBenefit.create({ data: benefit });
    }
    console.log("✅ ERP Benefits seeded (5 benefits)\n");
  }

  // ============================================
  // 7. SEED ADVANCED FEATURES
  // ============================================
  console.log("⚡ Seeding Advanced Features...");

  const existingAdvancedFeaturesCount = await prisma.advancedFeature.count();
  if (existingAdvancedFeaturesCount > 0) {
    console.log("⏭️  Advanced Features already exist, skipping...\n");
  } else {
    const advancedFeaturesData = [
      {
        featureCode: "FINANCE",
        imageFileId: null,
        displayOrder: 1,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              title: "Keuangan & Akuntansi",
              description:
                "Buat laporan keuangan seperti laba rugi, neraca, dan arus kas secara real-time. Pemantauan buku besar, serta utang dan piutang, menjadi lebih sederhana.",
            },
            {
              locale: "en" as const,
              title: "Finance & Accounting",
              description:
                "Create financial reports such as profit and loss, balance sheet, and cash flow in real-time. Monitoring general ledger, accounts payable and receivable becomes simpler.",
            },
          ],
        },
      },
      {
        featureCode: "MANUFACTURING",
        imageFileId: null,
        displayOrder: 2,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              title: "Manufaktur",
              description:
                "KelolaAja proses manufaktur dengan mudah, hitung Harga Pokok Penjualan produk secara otomatis. Rencanakan produksi, Bill of Material, serta hitung biaya bahan baku dan overhead produksi pabrik secara otomatis.",
            },
            {
              locale: "en" as const,
              title: "Manufacturing",
              description:
                "Manage manufacturing processes easily, calculate Cost of Goods Sold automatically. Plan production, Bill of Materials, and calculate raw material costs and factory overhead automatically.",
            },
          ],
        },
      },
      {
        featureCode: "PROJECT",
        imageFileId: null,
        displayOrder: 3,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              title: "Manajemen Proyek",
              description:
                "KelolaAja dirancang untuk semua jenis & skala bisnis. Sekalipun Anda tidak memahami secara mendalam, Anda akan dengan mudah beradaptasi dengan KelolaAja.",
            },
            {
              locale: "en" as const,
              title: "Project Management",
              description:
                "KelolaAja is designed for all types & scales of business. Even if you don't understand it deeply, you will easily adapt to KelolaAja.",
            },
          ],
        },
      },
      {
        featureCode: "SALES",
        imageFileId: null,
        displayOrder: 4,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              title: "Pembelian & Penjualan",
              description:
                "Proses jual-beli yang lebih fleksibel, bisa pilih jual putus atau konsinyasi. Dilengkapi fitur DP dan diskon bertingkat. Pantau pengiriman barang, buat tagihan, hingga dengan mudah dalam satu software.",
            },
            {
              locale: "en" as const,
              title: "Purchase & Sales",
              description:
                "More flexible buying and selling process, can choose outright sale or consignment. Equipped with down payment and tiered discount features. Monitor goods delivery, create invoices easily in one software.",
            },
          ],
        },
      },
      {
        featureCode: "INVENTORY",
        imageFileId: null,
        displayOrder: 5,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              title: "Produk & Inventory",
              description:
                "KelolaAja produk dan inventory dengan efisien, mulai dari pengadaan hingga pengiriman. Pantau stok secara real-time, atur harga, dan optimalkan alur distribusi menggunakan satu platform.",
            },
            {
              locale: "en" as const,
              title: "Product & Inventory",
              description:
                "Manage products and inventory efficiently, from procurement to delivery. Monitor stock in real-time, set prices, and optimize distribution flow using one platform.",
            },
          ],
        },
      },
      {
        featureCode: "HR",
        imageFileId: null,
        displayOrder: 6,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              title: "HR & Payroll",
              description:
                "KelolaAja HR dan payroll dengan mudah, mulai dari pengelolaan data karyawan, absensi, hingga perhitungan gaji. Semua proses otomatis, akurat, dan dapat diakses kapan saja.",
            },
            {
              locale: "en" as const,
              title: "HR & Payroll",
              description:
                "Manage HR and payroll easily, from employee data management, attendance, to salary calculation. All processes are automatic, accurate, and accessible anytime.",
            },
          ],
        },
      },
    ];

    for (const feature of advancedFeaturesData) {
      await prisma.advancedFeature.create({ data: feature });
    }
    console.log("✅ Advanced Features seeded (6 features)\n");
  }

  // ============================================
  // 8. SEED BENEFIT STATS
  // ============================================
  console.log("📊 Seeding Benefit Stats...");

  const existingBenefitStatsCount = await prisma.benefitStat.count();
  if (existingBenefitStatsCount > 0) {
    console.log("⏭️  Benefit Stats already exist, skipping...\n");
  } else {
    const benefitStatsData = [
      {
        statCode: "COMPANIES",
        statValue: "500",
        displayOrder: 1,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              label: "Perusahaan Terdaftar",
            },
            {
              locale: "en" as const,
              label: "Registered Companies",
            },
          ],
        },
      },
      {
        statCode: "EFFICIENCY",
        statValue: "70",
        displayOrder: 2,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              label: "Efisiensi Waktu",
            },
            {
              locale: "en" as const,
              label: "Time Efficiency",
            },
          ],
        },
      },
      {
        statCode: "ACCURACY",
        statValue: "99",
        displayOrder: 3,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              label: "Akurasi Data",
            },
            {
              locale: "en" as const,
              label: "Data Accuracy",
            },
          ],
        },
      },
      {
        statCode: "SUPPORT",
        statValue: "24",
        displayOrder: 4,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              label: "Dukungan",
            },
            {
              locale: "en" as const,
              label: "Support",
            },
          ],
        },
      },
    ];

    for (const stat of benefitStatsData) {
      await prisma.benefitStat.create({ data: stat });
    }
    console.log("✅ Benefit Stats seeded (4 stats)\n");
  }

  // ============================================
  // 9. SEED ABOUT CARDS
  // ============================================
  console.log("ℹ️  Seeding About Cards...");

  const existingAboutCardsCount = await prisma.aboutCard.count();
  if (existingAboutCardsCount > 0) {
    console.log("⏭️  About Cards already exist, skipping...\n");
  } else {
    const aboutCardsData = [
      {
        cardCode: "VISION",
        displayOrder: 1,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              title: "Visi Kami",
              description:
                "Menjadi solusi ERP terdepan yang memberdayakan bisnis di Indonesia untuk tumbuh dan berkembang dengan teknologi yang mudah digunakan.",
            },
            {
              locale: "en" as const,
              title: "Our Vision",
              description:
                "To become the leading ERP solution that empowers businesses in Indonesia to grow and develop with easy-to-use technology.",
            },
          ],
        },
      },
      {
        cardCode: "MISSION",
        displayOrder: 2,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              title: "Misi Kami",
              description:
                "Menyediakan sistem ERP yang komprehensif, terjangkau, dan mudah digunakan untuk semua skala bisnis.",
            },
            {
              locale: "en" as const,
              title: "Our Mission",
              description:
                "Providing comprehensive, affordable, and easy-to-use ERP systems for all business scales.",
            },
          ],
        },
      },
      {
        cardCode: "VALUES",
        displayOrder: 3,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              title: "Nilai Kami",
              description:
                "Inovasi, Integritas, dan Kepuasan Pelanggan adalah nilai utama yang kami pegang dalam setiap layanan.",
            },
            {
              locale: "en" as const,
              title: "Our Values",
              description:
                "Innovation, Integrity, and Customer Satisfaction are the core values we uphold in every service.",
            },
          ],
        },
      },
    ];

    for (const card of aboutCardsData) {
      await prisma.aboutCard.create({ data: card });
    }
    console.log("✅ About Cards seeded (3 cards)\n");
  }

  // ============================================
  // 10. SEED KELOLAAJA FEATURES
  // ============================================
  console.log("🎨 Seeding KelolaAja Features...");

  const existingKelolaAjaFeaturesCount = await prisma.kelolaAjaFeature.count();
  if (existingKelolaAjaFeaturesCount > 0) {
    console.log("⏭️  KelolaAja Features already exist, skipping...\n");
  } else {
    const kelolaAjaFeaturesData = [
      {
        featureCode: "EASY_TO_USE",
        iconName: "easy",
        displayOrder: 1,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              title: "Mudah Digunakan",
              description:
                "Interface yang intuitif dan user-friendly membuat siapa saja bisa menggunakan sistem dengan mudah.",
            },
            {
              locale: "en" as const,
              title: "Easy to Use",
              description:
                "Intuitive and user-friendly interface makes it easy for anyone to use the system.",
            },
          ],
        },
      },
      {
        featureCode: "REALTIME_DATA",
        iconName: "realtime",
        displayOrder: 2,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              title: "Data Real-time",
              description:
                "Pantau bisnis Anda secara real-time dengan data yang selalu update.",
            },
            {
              locale: "en" as const,
              title: "Real-time Data",
              description:
                "Monitor your business in real-time with always updated data.",
            },
          ],
        },
      },
      {
        featureCode: "CLOUD_BASED",
        iconName: "cloud",
        displayOrder: 3,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              title: "Cloud-Based",
              description:
                "Akses dari mana saja, kapan saja dengan sistem berbasis cloud yang aman.",
            },
            {
              locale: "en" as const,
              title: "Cloud-Based",
              description:
                "Access from anywhere, anytime with a secure cloud-based system.",
            },
          ],
        },
      },
      {
        featureCode: "MULTI_USER",
        iconName: "users",
        displayOrder: 4,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              title: "Multi User",
              description:
                "Kolaborasi tim dengan akses multi-user dan pengaturan hak akses yang fleksibel.",
            },
            {
              locale: "en" as const,
              title: "Multi User",
              description:
                "Team collaboration with multi-user access and flexible permission settings.",
            },
          ],
        },
      },
      {
        featureCode: "SECURE",
        iconName: "shield",
        displayOrder: 5,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              title: "Keamanan Terjamin",
              description:
                "Data bisnis Anda dilindungi dengan enkripsi dan backup otomatis.",
            },
            {
              locale: "en" as const,
              title: "Secure",
              description:
                "Your business data is protected with encryption and automatic backup.",
            },
          ],
        },
      },
    ];

    for (const feature of kelolaAjaFeaturesData) {
      await prisma.kelolaAjaFeature.create({ data: feature });
    }
    console.log("✅ KelolaAja Features seeded (5 features)\n");
  }

  // ============================================
  // 11. SEED INDUSTRIES
  // ============================================
  console.log("🏭 Seeding Industries...");

  const existingIndustriesCount = await prisma.industry.count();
  if (existingIndustriesCount > 0) {
    console.log("⏭️  Industries already exist, skipping...\n");
  } else {
    const industriesData = [
      {
        industryCode: "FNB",
        slug: "fnb",
        iconName: "🍽️",
        displayOrder: 1,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id",
              title: "F&B",
              description: "Solusi ERP untuk bisnis Food & Beverage",
            },
            {
              locale: "en",
              title: "F&B",
              description: "ERP solution for Food & Beverage business",
            },
          ],
        },
      },
      {
        industryCode: "RETAIL",
        slug: "retail",
        iconName: "🛍️",
        displayOrder: 2,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id",
              title: "Retail",
              description: "Solusi ERP untuk bisnis retail dan toko",
            },
            {
              locale: "en",
              title: "Retail",
              description: "ERP solution for retail and store business",
            },
          ],
        },
      },
      {
        industryCode: "MANUFACTURING",
        slug: "manufacturing",
        iconName: "�",
        displayOrder: 3,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id",
              title: "Manufaktur",
              description: "Solusi ERP untuk industri manufaktur",
            },
            {
              locale: "en",
              title: "Manufacturing",
              description: "ERP solution for manufacturing industry",
            },
          ],
        },
      },
      {
        industryCode: "TRADING",
        slug: "trading",
        iconName: "📦",
        displayOrder: 4,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id",
              title: "Trading",
              description: "Solusi ERP untuk bisnis trading dan distribusi",
            },
            {
              locale: "en",
              title: "Trading",
              description: "ERP solution for trading and distribution business",
            },
          ],
        },
      },
      {
        industryCode: "SERVICES",
        slug: "services",
        iconName: "💼",
        displayOrder: 5,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id",
              title: "Jasa",
              description: "Solusi ERP untuk bisnis jasa",
            },
            {
              locale: "en",
              title: "Services",
              description: "ERP solution for service business",
            },
          ],
        },
      },
    ];

    for (const industry of industriesData) {
      await prisma.industry.create({ data: industry });
    }
    console.log("✅ Industries seeded (5 industries)\n");
  }

  // ============================================
  // 12. SEED FAQ CATEGORIES & FAQS
  // ============================================
  console.log("❓ Seeding FAQs...");

  const existingFAQCategoriesCount = await prisma.fAQCategory.count();
  if (existingFAQCategoriesCount > 0) {
    console.log("⏭️  FAQs already exist, skipping...\n");
  } else {
    const generalCategory = await prisma.fAQCategory.create({
      data: {
        categoryCode: "GENERAL",
        displayOrder: 1,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              categoryName: "Umum",
            },
            {
              locale: "en" as const,
              categoryName: "General",
            },
          ],
        },
      },
    });

    const faqsData = [
      {
        categoryId: generalCategory.categoryId,
        displayOrder: 1,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              question:
                "Apa yang membedakan KelolaAja dari software ERP lain di pasaran?",
              answer:
                "KelolaAja menghadirkan keseimbangan antara kualitas sistem, kedalaman fitur, dan keterjangkauan biaya. Dibanding ERP lokal maupun global, KelolaAja menawarkan solusi yang komprehensif dan efisien secara biaya, tanpa mengorbankan fungsionalitas inti.",
            },
            {
              locale: "en" as const,
              question:
                "What differentiates KelolaAja from other ERP software in the market?",
              answer:
                "KelolaAja presents a balance between system quality, feature depth, and cost affordability. Compared to local and global ERPs, KelolaAja offers comprehensive and cost-efficient solutions without sacrificing core functionality.",
            },
          ],
        },
      },
      {
        categoryId: generalCategory.categoryId,
        displayOrder: 2,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              question:
                "Apakah pengguna perlu memiliki pengalaman teknis untuk menggunakan KelolaAja?",
              answer:
                "Tidak. KelolaAja dirancang dengan antarmuka yang intuitif dan alur kerja yang disederhanakan berdasarkan riset langsung terhadap kebutuhan pengguna bisnis di berbagai level. Sistem ini dapat digunakan tanpa pengalaman teknis sebelumnya.",
            },
            {
              locale: "en" as const,
              question:
                "Do users need to have technical experience to use KelolaAja?",
              answer:
                "No. KelolaAja is designed with an intuitive interface and simplified workflow based on direct research into business user needs at various levels. This system can be used without prior technical experience.",
            },
          ],
        },
      },
      {
        categoryId: generalCategory.categoryId,
        displayOrder: 3,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              question: "Berapa lama proses implementasi KelolaAja?",
              answer:
                "Proses implementasi KelolaAja umumnya memakan waktu antara 1 hingga 3 bulan, tergantung pada kompleksitas struktur bisnis, jumlah modul yang digunakan, dan kesiapan data internal perusahaan. Rentang waktu ini mencakup seluruh tahapan penting seperti analisis kebutuhan, konfigurasi sistem, migrasi data, pelatihan pengguna, hingga pendampingan saat go-live.",
            },
            {
              locale: "en" as const,
              question:
                "How long does the KelolaAja implementation process take?",
              answer:
                "The KelolaAja implementation process generally takes between 1 to 3 months, depending on business structure complexity, number of modules used, and company internal data readiness. This timeframe covers all important stages such as needs analysis, system configuration, data migration, user training, to go-live support.",
            },
          ],
        },
      },
      {
        categoryId: generalCategory.categoryId,
        displayOrder: 4,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              question:
                "Apakah KelolaAja bisa disesuaikan dengan kebutuhan bisnis saya?",
              answer:
                "KelolaAja telah dirancang untuk langsung mendukung proses bisnis umum tanpa perlu kustomisasi. Jika ada kebutuhan sangat spesifik, kustomisasi dimungkinkan dengan biaya tambahan sesuai kompleksitas. Namun, kami tidak merekomendasikan kustomisasi kecuali benar-benar diperlukan, agar sistem tetap efisien, stabil, dan scalable.",
            },
            {
              locale: "en" as const,
              question: "Can KelolaAja be customized to my business needs?",
              answer:
                "KelolaAja has been designed to directly support common business processes without customization. If there are very specific needs, customization is possible with additional costs according to complexity. However, we do not recommend customization unless absolutely necessary, to keep the system efficient, stable, and scalable.",
            },
          ],
        },
      },
      {
        categoryId: generalCategory.categoryId,
        displayOrder: 5,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              question: "Apakah ada pelatihan untuk menggunakan KelolaAja?",
              answer:
                "Ada, pelatihan baik secara online maupun langsung, termasuk tutorial, webinar, dan dukungan teknis, agar tim Anda dapat memanfaatkan software tersebut secara optimal.",
            },
            {
              locale: "en" as const,
              question: "Is there training for using KelolaAja?",
              answer:
                "Yes, training both online and in-person, including tutorials, webinars, and technical support, so your team can utilize the software optimally.",
            },
          ],
        },
      },
      {
        categoryId: generalCategory.categoryId,
        displayOrder: 6,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              question: "Apa yang dibutuhkan untuk menggunakan KelolaAja?",
              answer:
                "Tidak ada. Anda hanya memerlukan komputer beserta koneksi internet.",
            },
            {
              locale: "en" as const,
              question: "What is needed to use KelolaAja?",
              answer:
                "Nothing. You only need a computer and an internet connection.",
            },
          ],
        },
      },
      {
        categoryId: generalCategory.categoryId,
        displayOrder: 7,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              question: "Apa manfaat software ERP akuntansi untuk bisnis?",
              answer:
                "Akuntansi ERP KelolaAja mampu menghemat waktu pekerjaan perusahaan. Selain itu sistem akuntansi ini juga mampu menghindarkan perusahaan Anda dari kesalahan atau kekeliruan dalam perhitungan akuntansi, membuat laporan bisnis pun menjadi lebih aman, cepat dan mudah.",
            },
            {
              locale: "en" as const,
              question:
                "What are the benefits of ERP accounting software for business?",
              answer:
                "KelolaAja ERP accounting can save company work time. In addition, this accounting system can also prevent your company from errors or mistakes in accounting calculations, making business reports safer, faster and easier.",
            },
          ],
        },
      },
      {
        categoryId: generalCategory.categoryId,
        displayOrder: 8,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              question: "Apakah Aman Menggunakan KelolaAja?",
              answer:
                "KelolaAja bertanggung jawab secara serius atas keamanan yang diperoleh pelanggan. Selain itu, keunggulan dari software, sistem, dan data menjadi prioritas utama kami. Keamanan juga menjadi kunci dari penawaran yang kami berikan. Untuk itu semua informasi yang Anda berikan telah ter-encrypt dan terjaga dengan teknologi dan keamanan yang terkemuka.",
            },
            {
              locale: "en" as const,
              question: "Is it Safe to Use KelolaAja?",
              answer:
                "KelolaAja takes customer security seriously. In addition, the excellence of software, systems, and data is our top priority. Security is also the key to our offering. Therefore, all information you provide has been encrypted and secured with leading technology and security.",
            },
          ],
        },
      },
    ];

    for (const faq of faqsData) {
      await prisma.fAQ.create({ data: faq });
    }
    console.log("✅ FAQs seeded (1 category, 8 FAQs)\n");
  }

  // ============================================
  // 13. SEED FEATURES (FEATURE MASTER)
  // ============================================
  console.log("⭐ Seeding Features...");

  const existingFeaturesCount = await prisma.featureMaster.count();
  if (existingFeaturesCount > 0) {
    console.log("⏭️  Features already exist, skipping...\n");
  } else {
    const featuresData = [
      {
        featureCode: "ACCOUNTING",
        category: "finance",
        displayOrder: 1,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              featureName: "Akuntansi",
              description:
                "Sistem akuntansi lengkap dengan jurnal, buku besar, dan laporan keuangan",
            },
            {
              locale: "en" as const,
              featureName: "Accounting",
              description:
                "Complete accounting system with journal, general ledger, and financial reports",
            },
          ],
        },
      },
      {
        featureCode: "INVENTORY",
        category: "inventory",
        displayOrder: 2,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              featureName: "Inventory",
              description:
                "Manajemen stok barang dengan multi gudang dan tracking real-time",
            },
            {
              locale: "en" as const,
              featureName: "Inventory",
              description:
                "Stock management with multi-warehouse and real-time tracking",
            },
          ],
        },
      },
      {
        featureCode: "SALES",
        category: "sales",
        displayOrder: 3,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              featureName: "Penjualan",
              description:
                "Kelola proses penjualan dari quotation hingga invoice",
            },
            {
              locale: "en" as const,
              featureName: "Sales",
              description: "Manage sales process from quotation to invoice",
            },
          ],
        },
      },
      {
        featureCode: "PURCHASE",
        category: "purchase",
        displayOrder: 4,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              featureName: "Pembelian",
              description:
                "Manajemen pembelian dan vendor dengan PO dan invoice",
            },
            {
              locale: "en" as const,
              featureName: "Purchase",
              description: "Purchase and vendor management with PO and invoice",
            },
          ],
        },
      },
      {
        featureCode: "HR",
        category: "hr",
        displayOrder: 5,
        isActive: true,
        createdBy: adminUser.userId,
        updatedBy: adminUser.userId,
        translations: {
          create: [
            {
              locale: "id" as const,
              featureName: "HR & Payroll",
              description: "Manajemen karyawan, absensi, dan penggajian",
            },
            {
              locale: "en" as const,
              featureName: "HR & Payroll",
              description: "Employee management, attendance, and payroll",
            },
          ],
        },
      },
    ];

    for (const feature of featuresData) {
      await prisma.featureMaster.create({ data: feature });
    }
    console.log("✅ Features seeded (5 features)\n");
  }

  console.log("�🎉 Database seeding completed successfully!\n");
  // ============================================
  // 14. SEED MEDIA FILES (REAL DATA)
  // ============================================
  console.log("🖼️  Seeding Media Files...");

  let seededMediaFiles: any[] = [];
  const existingMediaFilesCount = await prisma.mediaFile.count();
  if (existingMediaFilesCount > 0) {
    console.log("⏭️  Media Files already exist, fetching existing files...\n");
    seededMediaFiles = await prisma.mediaFile.findMany();
  } else {
    const mediaFilesData = [
      // Home & General
      {
        fileName: "hero-image.jpg",
        filePath: "public/images/home/hero-image.jpg",
        storageUrl: "/images/home/hero-image.jpg",
        fileType: "image/jpeg",
        mimeType: "image/jpeg",
      },
      {
        fileName: "laptop-besar.png",
        filePath: "public/images/home/laptop-besar.png",
        storageUrl: "/images/home/laptop-besar.png",
        fileType: "image/png",
        mimeType: "image/png",
      },

      // About / Company Profile
      {
        fileName: "about-us.jpg",
        filePath: "public/images/company-profile/about-us.jpg",
        storageUrl: "/images/company-profile/about-us.jpg",
        fileType: "image/jpeg",
        mimeType: "image/jpeg",
      },
      {
        fileName: "vision.jpg",
        filePath: "public/images/company-profile/vision.jpg",
        storageUrl: "/images/company-profile/vision.jpg",
        fileType: "image/jpeg",
        mimeType: "image/jpeg",
      },
      {
        fileName: "mission.jpg",
        filePath: "public/images/company-profile/mission.jpg",
        storageUrl: "/images/company-profile/mission.jpg",
        fileType: "image/jpeg",
        mimeType: "image/jpeg",
      },

      // Sales
      {
        fileName: "sales.png",
        filePath: "public/images/sales/sales.png",
        storageUrl: "/images/sales/sales.png",
        fileType: "image/png",
        mimeType: "image/png",
      },
      {
        fileName: "sales2.png",
        filePath: "public/images/sales/sales2.png",
        storageUrl: "/images/sales/sales2.png",
        fileType: "image/png",
        mimeType: "image/png",
      },
      {
        fileName: "feature-sales.jpg",
        filePath: "public/images/sales/feature-sales.jpg",
        storageUrl: "/images/sales/feature-sales.jpg",
        fileType: "image/jpeg",
        mimeType: "image/jpeg",
      },

      // Industries
      {
        fileName: "retail.png",
        filePath: "public/images/industries/retail/retail.png",
        storageUrl: "/images/industries/retail/retail.png",
        fileType: "image/png",
        mimeType: "image/png",
      },
      {
        fileName: "kontraktor.png",
        filePath: "public/images/industries/contractor/kontraktor.png",
        storageUrl: "/images/industries/contractor/kontraktor.png",
        fileType: "image/png",
        mimeType: "image/png",
      },

      // Benefits
      {
        fileName: "multi-export.png",
        filePath: "public/images/benefits/multi-export.png",
        storageUrl: "/images/benefits/multi-export.png",
        fileType: "image/png",
        mimeType: "image/png",
      },
      {
        fileName: "multi-gudang.png",
        filePath: "public/images/benefits/multi-gudang.png",
        storageUrl: "/images/benefits/multi-gudang.png",
        fileType: "image/png",
        mimeType: "image/png",
      },
    ];

    for (const file of mediaFilesData) {
      const createdFile = await prisma.mediaFile.create({
        data: {
          fileName: file.fileName,
          filePath: file.filePath,
          fileType: file.fileType,
          mimeType: file.mimeType,
          storageType: "local",
          storageUrl: file.storageUrl,
          isPublic: true,
          uploadedBy: adminUser.userId,
        },
      });
      seededMediaFiles.push(createdFile);
    }
    console.log(`✅ Media Files seeded (${seededMediaFiles.length} files)\n`);
  }

  // ============================================
  // 15. SEED FEATURE PAGES
  // ============================================
  console.log("📄 Seeding Feature Pages...");

  const existingFeaturePagesCount = await prisma.featurePage.count();
  if (existingFeaturePagesCount > 0) {
    console.log("⏭️  Feature Pages already exist, skipping...\n");
  } else {
    // Helper to find media file ID by partial name
    const findImageId = (namePart: string) => {
      const found = seededMediaFiles.find((f) => f.fileName.includes(namePart));
      return found ? found.fileId : null;
    };

    const featurePagesData = [
      {
        featureCode: "ACCOUNTING", // Must match FeatureMaster
        pageCode: "PAGE_ACCOUNTING",
        slug: "accounting-software",
        heroImageFileId: findImageId("laptop-besar"),
        isActive: true,
        translations: {
          create: [
            {
              locale: "id" as const,
              heroTitle: "Sistem Akuntansi Terlengkap",
              heroSubtitle: "Kelola keuangan bisnis dengan mudah dan akurat",
              heroDescription:
                "Buat laporan keuangan seperti laba rugi, neraca, dan arus kas secara real-time. Pemantauan buku besar, serta utang dan piutang, menjadi lebih sederhana.",
              aboutTitle: "Kenapa Memilih Modul Akuntansi Kami?",
              aboutDescription1:
                "Kami menyediakan fitur akuntansi yang dirancang khusus untuk kebutuhan bisnis Indonesia, sesuai dengan standar PSAK namun tetap mudah digunakan oleh orang awam.",
            },
            {
              locale: "en" as const,
              heroTitle: "Complete Accounting System",
              heroSubtitle: "Manage business finances easily and accurately",
              heroDescription:
                "Create financial reports such as profit and loss, balance sheet, and cash flow in real-time. Monitoring general ledger, as well as accounts payable and receivable, becomes simpler.",
              aboutTitle: "Why Choose Our Accounting Module?",
              aboutDescription1:
                "We provide accounting features designed specifically for Indonesian business needs, compliant with PSAK standards but still easy to use for laypeople.",
            },
          ],
        },
      },
      {
        featureCode: "INVENTORY",
        pageCode: "PAGE_INVENTORY",
        slug: "inventory-management",
        heroImageFileId: findImageId("multi-gudang"),
        isActive: true,
        translations: {
          create: [
            {
              locale: "id" as const,
              heroTitle: "Manajemen Stok & Inventaris",
              heroSubtitle:
                "Pantau stok barang di berbagai gudang secara real-time",
              heroDescription:
                "Kelola produk dan inventory dengan efisien, mulai dari pengadaan hingga pengiriman. Pantau stok secara real-time, atur harga, dan optimalkan alur distribusi.",
              aboutTitle: "Kontrol Penuh Atas Produk Anda",
              aboutDescription1:
                "Hindari kehabisan stok atau penumpukan barang mati. Sistem kami membantu Anda merencanakan pengadaan dengan lebih cerdas.",
            },
            {
              locale: "en" as const,
              heroTitle: "Stock & Inventory Management",
              heroSubtitle:
                "Monitor stock across multiple warehouses in real-time",
              heroDescription:
                "Manage products and inventory efficiently, from procurement to delivery. Monitor stock in real-time, set prices, and optimize distribution flows.",
              aboutTitle: "Full Control Over Your Products",
              aboutDescription1:
                "Avoid stockouts or dead stock accumulation. Our system helps you plan procurement smarter.",
            },
          ],
        },
      },
      {
        featureCode: "SALES",
        pageCode: "PAGE_SALES",
        slug: "sales-system",
        heroImageFileId: findImageId("sales.png"),
        isActive: true,
        translations: {
          create: [
            {
              locale: "id" as const,
              heroTitle: "Aplikasi Penjualan & POS",
              heroSubtitle:
                "Tingkatkan omset dengan proses penjualan yang cepat",
              heroDescription:
                "Proses jual-beli yang lebih fleksibel, bisa pilih jual putus atau konsinyasi. Dilengkapi fitur DP dan diskon bertingkat. Pantau pengiriman barang dan buat tagihan dengan mudah.",
              aboutTitle: "Permudah Tim Sales Anda",
              aboutDescription1:
                "Berikan alat yang tepat bagi tim penjualan untuk mencatat pesanan, mengecek stok, dan menagih pembayaran dalam satu platform.",
            },
            {
              locale: "en" as const,
              heroTitle: "Sales App & POS",
              heroSubtitle: "Increase turnover with fast sales processes",
              heroDescription:
                "More flexible buying and selling processes, choose between direct sales or consignment. Equipped with DP and tiered discount features. Monitor shipments and create invoices easily.",
              aboutTitle: "Empower Your Sales Team",
              aboutDescription1:
                "Give your sales team the right tools to record orders, check stock, and collect payments in one platform.",
            },
          ],
        },
      },
      {
        featureCode: "PURCHASE",
        pageCode: "PAGE_PURCHASE",
        slug: "purchasing-system",
        heroImageFileId: findImageId("multi-export"), // Placeholder using available image
        isActive: true,
        translations: {
          create: [
            {
              locale: "id" as const,
              heroTitle: "Sistem Pembelian",
              heroSubtitle: "Kelola vendor dan pengadaan barang lebih efisien",
              heroDescription:
                "Otomatisasi proses pembelian dari PR (Purchase Request) hingga PO (Purchase Order). Bandingkan harga vendor dan dapatkan penawaran terbaik.",
              aboutTitle: "Efisiensi Biaya Pengadaan",
              aboutDescription1:
                "Kontrol pengeluaran perusahaan dengan sistem approval berjenjang untuk setiap pembelian.",
            },
            {
              locale: "en" as const,
              heroTitle: "Purchasing System",
              heroSubtitle: "Manage vendors and procurement more efficiently",
              heroDescription:
                "Automate purchasing processes from PR (Purchase Request) to PO (Purchase Order). Compare vendor prices and get the best deals.",
              aboutTitle: "Procurement Cost Efficiency",
              aboutDescription1:
                "Control company expenses with tiered approval systems for every purchase.",
            },
          ],
        },
      },
      {
        featureCode: "HR",
        pageCode: "PAGE_HR",
        slug: "hr-payroll",
        heroImageFileId: null, // No HR specific image seeded yet, keep null or add one
        isActive: true,
        translations: {
          create: [
            {
              locale: "id" as const,
              heroTitle: "HRIS & Payroll Otomatis",
              heroSubtitle: "Kelola karyawan dan penggajian tanpa ribet",
              heroDescription:
                "Kelola HR dan payroll dengan mudah, mulai dari pengelolaan data karyawan, absensi, hingga perhitungan gaji. Semua proses otomatis, akurat, dan aman.",
              aboutTitle: "Aset Terbesar Adalah Karyawan",
              aboutDescription1:
                "Pastikan hak karyawan terpenuhi tepat waktu dengan perhitungan gaji, PPh 21, dan BPJS yang akurat.",
            },
            {
              locale: "en" as const,
              heroTitle: "Automated HRIS & Payroll",
              heroSubtitle: "Manage employees and payroll without hassle",
              heroDescription:
                "Manage HR and payroll easily, from employee data management, attendance, to salary calculation. All processes are automatic, accurate, and secure.",
              aboutTitle: "Employees Are The Biggest Asset",
              aboutDescription1:
                "Ensure employee rights are met on time with accurate salary, PPh 21, and BPJS calculations.",
            },
          ],
        },
      },
    ];

    for (const page of featurePagesData) {
      // Need to get featureId first
      const feature = await prisma.featureMaster.findUnique({
        where: { featureCode: page.featureCode },
      });

      if (feature) {
        await prisma.featurePage.create({
          data: {
            featureId: feature.featureId,
            pageCode: page.pageCode,
            slug: page.slug,
            heroImageFileId: page.heroImageFileId,
            isActive: page.isActive,
            createdBy: adminUser.userId,
            updatedBy: adminUser.userId,
            translations: page.translations,
          },
        });
      }
    }
    console.log("✅ Feature Pages seeded (5 pages)\n");
  }

  console.log("🎉 Database seeding completed successfully!\n");
  console.log("📊 Summary:");
  console.log(
    "  - 1 Admin User (email: admin@kelolaaja.com, password: admin123)"
  );
  console.log("  - 3 Pricing Plans");
  console.log("  - 3 Testimonials");
  console.log("  - 8 Partners");
  console.log("  - 4 Process Steps");
  console.log("  - 5 ERP Benefits");
  console.log("  - 6 Advanced Features");
  console.log("  - 4 Benefit Stats");
  console.log("  - 3 About Cards");
  console.log("  - 5 KelolaAja Features");
  console.log("  - 5 Industries");
  console.log("  - 1 FAQ Category");
  console.log("  - 8 FAQs");
  console.log("  - 5 Features");
  console.log("  - 12 Media Files");
  console.log("  - 5 Feature Pages");
  console.log("\n✨ Total: 86 records created!\n");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
