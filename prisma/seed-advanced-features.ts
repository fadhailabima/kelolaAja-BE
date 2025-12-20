import { PrismaClient, Locale } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting AdvancedFeature seeding...\n");

    const adminUser = await prisma.adminUser.findFirst();

    if (!adminUser) {
        console.error("❌ Error: No admin user found. Please run seed-admin first.");
        process.exit(1);
    }

    // Create Advanced features from frontend data
    const advFeaturesData = [
        { code: 'finance', title: { id: 'Keuangan & Akuntansi', en: 'Finance & Accounting' }, desc: { id: 'Buat laporan keuangan seperti laba rugi, neraca, dan arus kas secara real-time. Pemantauan buku besar, serta utang dan piutang, menjadi lebih sederhana.', en: 'Create financial reports such as profit and loss, balance sheet, and cash flow in real-time. Monitoring general ledger, as well as receivables and payables, becomes simpler.' }, link: '/features/finance', img: '/images/finance/feature-finance.jpg' },
        { code: 'manufacturing', title: { id: 'Manufaktur', en: 'Manufacturing' }, desc: { id: 'KelolaAja proses manufaktur dengan mudah, hitung Harga Pokok Penjualan produk secara otomatis. Rencanakan produksi, Bill of Material.', en: 'Manage the manufacturing process easily, automatically calculate the Cost of Goods Sold for products. Plan production, Bill of Material.' }, link: '/features/manufacturing', img: '/images/manufacturing/feature-manufacturing.jpg' },
        { code: 'project', title: { id: 'Manajement Proyek', en: 'Project Management' }, desc: { id: 'KelolaAja dirancang untuk semua jenis & skala bisnis. Sekalipun Anda tidak memahami secara mendalam, Anda akan dengan mudah beradaptasi dengan KelolaAja.', en: 'KelolaAja is designed for all types & scales of business. Even if you do not understand in depth, you will easily adapt to KelolaAja.' }, link: '/features/project', img: '/images/project/feature-project.jpg' },
        { code: 'sales', title: { id: 'Pembelian & Penjualan', en: 'Purchasing & Sales' }, desc: { id: 'Proses jual-beli yang lebih fleksibel, bisa pilih jual putus atau konsinyasi. Dilengkapi fitur DP dan diskon bertingkat.', en: 'More flexible buying and selling processes, you can choose cash sales or consignment. Equipped with DP features and tiered discounts.' }, link: '/features/sales', img: '/images/sales/feature-sales.jpg' },
        { code: 'inventory', title: { id: 'Produk & Inventory', en: 'Products & Inventory' }, desc: { id: 'KelolaAja produk dan inventory dengan efisien, mulai dari pengadaan hingga pengiriman. Pantau stok secara real-time, atur harga.', en: 'Manage products and inventory efficiently, from procurement to delivery. Monitor stock in real-time, set prices.' }, link: '/features/inventory', img: '/images/inventory/feature-inventory.jpg' },
        { code: 'hr', title: { id: 'HR & Payroll', en: 'HR & Payroll' }, desc: { id: 'KelolaAja HR dan payroll dengan mudah, mulai dari pengelolaan data karyawan, absensi, hingga perhitungan gaji.', en: 'Manage HR and payroll easily, from employee data management, attendance, to salary calculation.' }, link: '#', img: '/images/hr/feature-hr.jpg' },
    ];

    for (const [index, f] of advFeaturesData.entries()) {
        const existing = await prisma.advancedFeature.findUnique({ where: { featureCode: f.code } });

        if (existing) {
            console.log(`⏭️  Feature ${f.code} already exists`);
            continue;
        }

        // Create MediaFile for image
        const mediaFile = await prisma.mediaFile.create({
            data: {
                fileName: `adv-${f.code}.jpg`,
                filePath: `/seeds/adv/adv-${f.code}.jpg`,
                mimeType: 'image/jpeg',
                fileSize: 2048,
                storageUrl: f.img,
                uploadedBy: adminUser.userId,
            }
        });

        await prisma.advancedFeature.create({
            data: {
                featureCode: f.code,
                linkUrl: f.link,
                displayOrder: index + 1,
                isActive: true,
                imageFileId: mediaFile.fileId,
                createdBy: adminUser.userId,
                updatedBy: adminUser.userId,
                translations: {
                    create: [
                        {
                            locale: Locale.id,
                            title: f.title.id,
                            description: f.desc.id
                        },
                        {
                            locale: Locale.en,
                            title: f.title.en,
                            description: f.desc.en
                        }
                    ]
                }
            },
            include: {
                translations: true
            }
        });

        console.log(`✅ Feature created: ${f.title.id}`);
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
