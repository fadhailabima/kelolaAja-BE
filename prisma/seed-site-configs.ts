import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting SiteConfig seeding...\n");

  const adminUser = await prisma.adminUser.findFirst();

  if (!adminUser) {
    console.error("❌ Error: No admin user found. Please run seed-admin first.");
    process.exit(1);
  }

  // Create site configurations
  const configs = [
    // General Settings
    {
      configKey: "site_name",
      configValue: "KelolaAja",
      valueType: "string",
      category: "general",
      description: "Website name"
    },
    {
      configKey: "site_tagline",
      configValue: "Sistem ERP Modern untuk UMKM Indonesia",
      valueType: "string",
      category: "general",
      description: "Website tagline"
    },
    {
      configKey: "site_description",
      configValue:
        "Platform ERP all-in-one yang membantu Anda mengelola inventory, penjualan, keuangan, dan operasional bisnis dalam satu sistem yang terintegrasi.",
      valueType: "string",
      category: "general",
      description: "Website meta description"
    },
    {
      configKey: "site_logo_url",
      configValue: "/images/logo.png",
      valueType: "string",
      category: "general",
      description: "Logo URL"
    },
    {
      configKey: "site_favicon_url",
      configValue: "/images/favicon.ico",
      valueType: "string",
      category: "general",
      description: "Favicon URL"
    },

    // Contact Information
    {
      configKey: "contact_email",
      configValue: "hello@kelolaaja.com",
      valueType: "string",
      category: "contact",
      description: "Primary contact email"
    },
    {
      configKey: "contact_phone",
      configValue: "+62 812-3456-7890",
      valueType: "string",
      category: "contact",
      description: "Primary contact phone"
    },
    {
      configKey: "contact_address",
      configValue: "Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10110",
      valueType: "string",
      category: "contact",
      description: "Office address"
    },
    {
      configKey: "support_email",
      configValue: "support@kelolaaja.com",
      valueType: "string",
      category: "contact",
      description: "Support email"
    },
    {
      configKey: "sales_email",
      configValue: "sales@kelolaaja.com",
      valueType: "string",
      category: "contact",
      description: "Sales email"
    },

    // Social Media
    {
      configKey: "social_facebook",
      configValue: "https://facebook.com/kelolaaja",
      valueType: "string",
      category: "social",
      description: "Facebook page URL"
    },
    {
      configKey: "social_twitter",
      configValue: "https://twitter.com/kelolaaja",
      valueType: "string",
      category: "social",
      description: "Twitter/X profile URL"
    },
    {
      configKey: "social_instagram",
      configValue: "https://instagram.com/kelolaaja",
      valueType: "string",
      category: "social",
      description: "Instagram profile URL"
    },
    {
      configKey: "social_linkedin",
      configValue: "https://linkedin.com/company/kelolaaja",
      valueType: "string",
      category: "social",
      description: "LinkedIn company page URL"
    },
    {
      configKey: "social_youtube",
      configValue: "https://youtube.com/@kelolaaja",
      valueType: "string",
      category: "social",
      description: "YouTube channel URL"
    },

    // SEO Settings
    {
      configKey: "seo_keywords",
      configValue: "ERP, UMKM, sistem manajemen bisnis, inventory, akuntansi, POS",
      valueType: "string",
      category: "seo",
      description: "Default meta keywords"
    },
    {
      configKey: "seo_og_image",
      configValue: "/images/og-image.jpg",
      valueType: "string",
      category: "seo",
      description: "Open Graph default image"
    },
    {
      configKey: "google_analytics_id",
      configValue: "G-XXXXXXXXXX",
      valueType: "string",
      category: "seo",
      description: "Google Analytics tracking ID"
    },

    // Business Settings
    {
      configKey: "business_hours",
      configValue: JSON.stringify({
        monday: "09:00-17:00",
        tuesday: "09:00-17:00",
        wednesday: "09:00-17:00",
        thursday: "09:00-17:00",
        friday: "09:00-17:00",
        saturday: "09:00-13:00",
        sunday: "Closed"
      }),
      valueType: "json",
      category: "general",
      description: "Business operating hours"
    },
    {
      configKey: "free_trial_days",
      configValue: "14",
      valueType: "number",
      category: "general",
      description: "Number of free trial days"
    },
    {
      configKey: "currency",
      configValue: "IDR",
      valueType: "string",
      category: "general",
      description: "Default currency"
    },
    {
      configKey: "timezone",
      configValue: "Asia/Jakarta",
      valueType: "string",
      category: "general",
      description: "Default timezone"
    },

    // Feature Flags
    {
      configKey: "feature_enable_chat",
      configValue: "true",
      valueType: "boolean",
      category: "features",
      description: "Enable live chat support"
    },
    {
      configKey: "feature_enable_newsletter",
      configValue: "true",
      valueType: "boolean",
      category: "features",
      description: "Enable newsletter subscription"
    },
    {
      configKey: "maintenance_mode",
      configValue: "false",
      valueType: "boolean",
      category: "general",
      description: "Enable maintenance mode"
    }
  ];

  for (const config of configs) {
    await prisma.siteConfig.upsert({
      where: { configKey: config.configKey },
      update: {
        configValue: config.configValue,
        valueType: config.valueType,
        category: config.category,
        description: config.description,
        updatedBy: adminUser.userId
      },
      create: {
        configKey: config.configKey,
        configValue: config.configValue,
        valueType: config.valueType,
        category: config.category,
        description: config.description,
        updatedBy: adminUser.userId
      }
    });

    console.log(
      `✅ Config created: ${config.configKey} = ${config.configValue.substring(0, 50)}${config.configValue.length > 50 ? "..." : ""
      }`
    );
  }

  console.log(`\n✨ Seeding completed! Total configs: ${configs.length}`);
}

main()
  .catch(e => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
