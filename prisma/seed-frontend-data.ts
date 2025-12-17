
import { PrismaClient, UserRole, Locale } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting frontend data migration...');

    // 1. Ensure Admin User exists (for createdBy fields)
    let adminUser = await prisma.adminUser.findFirst({
        where: { email: 'admin@kelolaaja.com' },
    });

    if (!adminUser) {
        console.log('Creating default admin user...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        adminUser = await prisma.adminUser.create({
            data: {
                username: 'superadmin',
                email: 'admin@kelolaaja.com',
                passwordHash: hashedPassword,
                fullName: 'Super Administrator',
                role: UserRole.Admin,
                isActive: true,
            },
        });
    }

    const adminId = adminUser.userId;

    // 2. Seed Partners
    console.log('Seeding Partners...');
    const partnersData = [
        { name: 'Sri', image: '/images/partners/sri.png' },
        { name: 'Sriendo Foods', image: '/images/partners/sriendofoods.png' },
        { name: 'Aura Food', image: '/images/partners/aurafood.png' },
        { name: 'Damika', image: '/images/partners/logo-damika.png' },
        { name: 'KAS', image: '/images/partners/logo-kas.png' },
        { name: 'MB Furnistore', image: '/images/partners/logo-mb-furnistore.jpg' },
        { name: 'MML', image: '/images/partners/logo-mml.jpg' },
        { name: 'SBS', image: '/images/partners/logo-sbs.jpg' },
    ];

    for (const [index, p] of partnersData.entries()) {
        const existing = await prisma.partner.findFirst({ where: { partnerName: p.name } });
        if (!existing) {
            // Create a dummy media file for the logo if needed, or just skip file linkage for now and rely on future upload
            // Since schema uses MediaFile relation for logo, we technically should create MediaFile records.
            // However, for simplicity in this "quick migration", we might skip the MediaFile strict relation if possible?
            // Wait, schema says `logoFileId Int?` and `logoFile MediaFile?`. It's optional.
            // But the Frontend `Partner` component uses `logoUrl` from API.
            // The API likely resolves `logoFile` to a URL.
            // If we want the *exact* URL to pass through, we might need to adjust the API or insert a MediaFile with that URL.
            // Let's create a MediaFile placeholder for these.

            const mediaFile = await prisma.mediaFile.create({
                data: {
                    fileName: p.name.toLowerCase().replace(/\s/g, '-') + '.png',
                    filePath: '/seeds/partners/' + p.name.toLowerCase().replace(/\s/g, '-') + '.png',
                    mimeType: 'image/png',
                    fileSize: 1024,
                    storageUrl: p.image,
                    uploadedBy: adminId,
                }
            });

            await prisma.partner.create({
                data: {
                    partnerName: p.name,
                    displayOrder: index + 1,
                    isActive: true,
                    logoFileId: mediaFile.fileId,
                    createdBy: adminId,
                    updatedBy: adminId,
                    translations: {
                        create: [
                            { locale: Locale.id, description: `Partner ${p.name}` },
                            { locale: Locale.en, description: `Partner ${p.name}` }
                        ]
                    }
                },
            });
        }
    }

    // 3. Seed Testimonials
    console.log('Seeding Testimonials...');
    const testimonialsData = [
        {
            name: 'Puji Waluyo',
            title: 'Manager',
            company: 'Sriendo Food Prima',
            quote: 'Mengguanakan software ERP KelolaAja yang simpel, praktis, dan mudah digunakan, menjadikan pengelolaan lebih cepat dan efisien.',
        },
        {
            name: 'Angga Yudhitama Putra',
            title: 'CEO',
            company: 'Sriendo Food Prima',
            quote: 'KelolaAja yang simpel, praktis, dan mudah digunakan, menjadikan pengelolaan lebih cepat dan efisien serta dapat di akses dimana saja.',
        },
        {
            name: 'Ayu Panduwinata',
            title: 'Manager Finance',
            company: '',
            quote: 'Pengelolaan keuangan yang lebih efisien, laporan real-time, dan pengambilan keputusan yang lebih cepat dan akurat.',
        }
    ];

    for (const [index, t] of testimonialsData.entries()) {
        const existing = await prisma.testimonial.findFirst({ where: { name: t.name } });
        if (!existing) {
            await prisma.testimonial.create({
                data: {
                    name: t.name,
                    title: t.title,
                    company: t.company,
                    displayOrder: index + 1,
                    isActive: true,
                    createdBy: adminId,
                    updatedBy: adminId,
                    translations: {
                        create: [
                            { locale: Locale.id, quote: t.quote },
                            { locale: Locale.en, quote: t.quote } // Duplicate for EN for now
                        ]
                    }
                }
            });
        }
    }

    // 4. Seed Process Steps
    console.log('Seeding Process Steps...');
    const stepsData = [
        { code: 'analysis', title: 'Analisa Proses Bisnis', desc: 'Tim konsultan kami akan mengidentifikasi masalah dan kebutuhan bisnismu' },
        { code: 'planning', title: 'Perencanaan', desc: 'Kami pastikan sistem bekerja sesuai dengan proses bisnismu.' },
        { code: 'training', title: 'Pelatihan', desc: 'Membantu user lewat pelatihan khusus untuk setiap divisi.' },
        { code: 'goingLive', title: 'Going Live', desc: 'Memastikan semua proses berjalan baik setelah going live.' },
    ];

    for (const [index, s] of stepsData.entries()) {
        const existing = await prisma.processStep.findUnique({ where: { stepCode: s.code } });
        if (!existing) {
            // Note: ProcessStep component has hardcoded SVG icons based on stepCode/iconName.
            // We don't strictly need imageFileId here if the frontend maps by code.
            await prisma.processStep.create({
                data: {
                    stepCode: s.code,
                    displayOrder: index + 1,
                    isActive: true,
                    createdBy: adminId,
                    updatedBy: adminId,
                    translations: {
                        create: [
                            { locale: Locale.id, title: s.title, description: s.desc },
                            { locale: Locale.en, title: s.title, description: s.desc }
                        ]
                    }
                }
            });
        }
    }

    // 5. Seed ERP Benefits
    console.log('Seeding ERP Benefits...');
    const erpBenefitsData = [
        { code: 'purchasing', title: 'Purchasing', desc: 'Buat purchase order dan faktur dalam satu langkah mudah.', img: '/images/home/purchasing.jpg' },
        { code: 'multiWarehouse', title: 'Multi Gudang', desc: 'KelolaAja stok produkmu dibanyak tempat dengan mudah dan pantau stok pergudang secara realtime.', img: '/images/home/multi-gudang.jpg' },
        { code: 'importExcel', title: 'Import dari Excel', desc: 'Tidak perlu lagi repot memasukkan data produk dan stok secara manual, cukup ketik di Excel dan unggah.', img: '/images/inventory/import-excel.jpg' },
    ];

    for (const [index, b] of erpBenefitsData.entries()) {
        const existing = await prisma.eRPBenefit.findUnique({ where: { benefitCode: b.code } });
        if (!existing) {
            const mediaFile = await prisma.mediaFile.create({
                data: {
                    fileName: `erp-${b.code}.jpg`,
                    filePath: `/seeds/erp/erp-${b.code}.jpg`,
                    mimeType: 'image/jpeg',
                    fileSize: 2048,
                    storageUrl: b.img,
                    uploadedBy: adminId,
                }
            });

            await prisma.eRPBenefit.create({
                data: {
                    benefitCode: b.code,
                    displayOrder: index + 1,
                    isActive: true,
                    imageFileId: mediaFile.fileId,
                    createdBy: adminId,
                    updatedBy: adminId,
                    translations: {
                        create: [
                            { locale: Locale.id, title: b.title, description: b.desc },
                            { locale: Locale.en, title: b.title, description: b.desc }
                        ]
                    }
                }
            });
        }
    }

    // 6. Seed Benefit Stats
    console.log('Seeding Benefit Stats...');
    const statsData = [
        { code: 'reduceErrors', value: '90%', label: 'Kurangi kesalahan hingga 90%' },
        { code: 'cutManualProcess', value: '80%', label: 'Pangkas Proses Manual 80%' },
        { code: 'accessReports', value: '100%', label: 'Akses Laporan Real-time 100%' },
        { code: 'customerSupport', value: '100%', label: 'Kepuasan Customer Support 100%' },
    ];

    for (const [index, s] of statsData.entries()) {
        const existing = await prisma.benefitStat.findUnique({ where: { statCode: s.code } });
        if (!existing) {
            await prisma.benefitStat.create({
                data: {
                    statCode: s.code,
                    statValue: s.value,
                    displayOrder: index + 1,
                    isActive: true,
                    createdBy: adminId,
                    updatedBy: adminId,
                    translations: {
                        create: [
                            { locale: Locale.id, label: s.label },
                            { locale: Locale.en, label: s.label }
                        ]
                    }
                }
            });
        }
    }

    // 7. Seed Advanced Features (Carousel)
    console.log('Seeding Advanced Features...');
    const advFeaturesData = [
        { code: 'finance', title: 'Keuangan & Akuntansi', desc: 'Buat laporan keuangan seperti laba rugi, neraca, dan arus kas secara real-time.', link: '/features/finance', img: '/images/finance/feature-finance.jpg' },
        { code: 'manufacturing', title: 'Manufaktur', desc: 'KelolaAja proses manufaktur dengan mudah, hitung Harga Pokok Penjualan produk secara otomatis.', link: '/features/manufacturing', img: '/images/manufacturing/feature-manufacturing.jpg' },
        { code: 'project', title: 'Manajement Proyek', desc: 'KelolaAja dirancang untuk semua jenis & skala bisnis.', link: '/features/project', img: '/images/project/feature-project.jpg' },
        { code: 'sales', title: 'Pembelian & Penjualan', desc: 'Proses jual-beli yang lebih fleksibel, bisa pilih jual putus atau konsinyasi.', link: '/features/sales', img: '/images/sales/feature-sales.jpg' },
        { code: 'inventory', title: 'Produk & Inventory', desc: 'KelolaAja produk dan inventory dengan efisien, mulai dari pengadaan hingga pengiriman.', link: '/features/inventory', img: '/images/inventory/feature-inventory.jpg' },
        { code: 'hr', title: 'HR & Payroll', desc: 'KelolaAja HR dan payroll dengan mudah, mulai dari pengelolaan data karyawan.', link: '#', img: '/images/hr/feature-hr.jpg' },
    ];

    for (const [index, f] of advFeaturesData.entries()) {
        const existing = await prisma.advancedFeature.findUnique({ where: { featureCode: f.code } });
        if (!existing) {
            const mediaFile = await prisma.mediaFile.create({
                data: {
                    fileName: `adv-${f.code}.jpg`,
                    filePath: `/seeds/adv/adv-${f.code}.jpg`,
                    mimeType: 'image/jpeg',
                    fileSize: 2048,
                    storageUrl: f.img,
                    uploadedBy: adminId,
                }
            });

            await prisma.advancedFeature.create({
                data: {
                    featureCode: f.code,
                    linkUrl: f.link,
                    displayOrder: index + 1,
                    isActive: true,
                    imageFileId: mediaFile.fileId,
                    createdBy: adminId,
                    updatedBy: adminId,
                    translations: {
                        create: [
                            { locale: Locale.id, title: f.title, description: f.desc },
                            { locale: Locale.en, title: f.title, description: f.desc }
                        ]
                    }
                }
            });
        }
    }

    console.log('Frontend data migration completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
