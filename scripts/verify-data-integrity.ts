
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
    console.log('🔍 Verifying Data Integrity...');

    const counts = {
        partners: await prisma.partner.count(),
        partnersWithLogo: await prisma.partner.count({ where: { logoFileId: { not: null } } }),

        testimonials: await prisma.testimonial.count(),
        testimonialsWithPhoto: await prisma.testimonial.count({ where: { photoFileId: { not: null } } }),

        erpBenefits: await prisma.eRPBenefit.count(),
        erpBenefitsWithImage: await prisma.eRPBenefit.count({ where: { imageFileId: { not: null } } }),

        advFeatures: await prisma.advancedFeature.count(),
        advFeaturesWithImage: await prisma.advancedFeature.count({ where: { imageFileId: { not: null } } }),

        kelolaFeatures: await prisma.kelolaAjaFeature.count(),

        processSteps: await prisma.processStep.count(),

        industries: await prisma.industry.count(),

        mediaFiles: await prisma.mediaFile.count(),

        coreValues: await prisma.coreValue.count(), // EXPECT 5 (AGILE)
        ourPhilosophy: await prisma.ourPhilosophy.count(), // EXPECT 6 (IMPACT)
        pricingPlans: await prisma.pricingPlan.count(), // EXPECT 3

        aboutCards: await prisma.aboutCard.count(), // EXPECT 3
        faqs: await prisma.fAQ.count(), // EXPECT 4
    };

    console.table(counts);

    // Specific Checks
    console.log('\n--- Detail Checks ---');

    // Check Testimonial "Ayu" has photo
    const ayu = await prisma.testimonial.findFirst({ where: { name: { contains: 'Ayu' } } });
    console.log(`Testimonial 'Ayu' has photoFileId: ${ayu?.photoFileId} (Expected: Number)`);

    // Check Core Value 'Growth'
    const growth = await prisma.coreValue.findUnique({ where: { valueCode: 'VAL_G' }, include: { translations: true } });
    console.log(`Core Value 'Growth' Found: ${!!growth}`);
    console.log(`Core Value 'Growth' Icon: ${growth?.iconName} (Expected: growth)`);

    // Check Industry 'Fnb'
    const fnb = await prisma.industry.findUnique({ where: { industryCode: 'IND_FNB' } });
    console.log(`Industry 'FnB' Icon: ${fnb?.iconName} (Expected: 🍽️)`);

    // Check Process Step 'analysis'
    const analysis = await prisma.processStep.findUnique({ where: { stepCode: 'analysis' } });
    console.log(`Process Step 'analysis' Icon: ${analysis?.iconName} (Expected: analysis)`);

    // Check Pricing Plan 'STARTER'
    const starter = await prisma.pricingPlan.findUnique({ where: { planCode: 'STARTER' }, include: { translations: true } });
    console.log(`Pricing 'STARTER' Price: ${starter?.pricePerUserMonth} (Expected: 50000)`);

    // Check FAQ
    const faq = await prisma.fAQ.findFirst({ include: { translations: true, category: true } });
    console.log(`FAQ Found: ${!!faq}`);
    if (faq && faq.translations.length > 0) {
        console.log(`FAQ Question (ID): ${faq.translations[0].question}`);
        console.log(`FAQ Category: ${faq.category.categoryCode}`);
    }

    // Check About Card
    const card = await prisma.aboutCard.findFirst({ include: { translations: true } });
    console.log(`About Card Found: ${!!card}`);
    if (card && card.translations.length > 0) {
        console.log(`About Card Title (ID): ${card.translations[0].title}`);
    }
}

verify()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
