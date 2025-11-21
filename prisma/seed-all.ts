#!/usr/bin/env ts-node

/**
 * Run All Seeders
 *
 * This script runs all essential seeders in the correct order:
 * 1. Admin Users (from seed.ts)
 * 2. Site Config
 * 3. Pricing & Features
 * 4. Content (FAQ, Testimonials, Partners)
 * 5. Homepage Sections (Stats, Steps, Benefits, Features)
 *
 * Usage: npm run seed:all
 */

import { exec } from "child_process";
import { promisify } from "util";
import * as path from "path";

const execAsync = promisify(exec);

const PRISMA_DIR = path.join(__dirname);

const seeders = [
  { name: "Admin Users", file: "seed.ts", required: true },
  { name: "Site Config", file: "seed-site-configs.ts", required: true },
  { name: "Pricing Plans", file: "seed-pricing.ts", required: true },
  { name: "Features", file: "seed-features.ts", required: true },
  { name: "Industries", file: "seed-industries.ts", required: false },
  { name: "Feature Pages", file: "seed-feature-pages.ts", required: false },
  { name: "FAQ", file: "seed-faqs.ts", required: false },
  { name: "Testimonials", file: "seed-testimonials.ts", required: false },
  { name: "Partners", file: "seed-partners.ts", required: false },
  { name: "Benefit Stats", file: "seed-benefit-stats.ts", required: false },
  { name: "Process Steps", file: "seed-process-steps.ts", required: false },
  { name: "ERP Benefits", file: "seed-erp-benefits.ts", required: false },
  { name: "KelolaAja Features", file: "seed-kelolaaja-features.ts", required: false }
];

async function runSeeder(name: string, file: string, required: boolean) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🌱 Running: ${name}`);
  console.log(`${"=".repeat(60)}\n`);

  try {
    const { stdout, stderr } = await execAsync(`npx ts-node ${path.join(PRISMA_DIR, file)}`, { cwd: path.dirname(PRISMA_DIR) });

    // Filter out experimental warnings
    if (stderr && !stderr.includes("ExperimentalWarning") && !stderr.includes("deprecated")) {
      console.error(`⚠️  Warnings: ${stderr}`);
    }

    console.log(stdout);
    console.log(`\n✅ ${name} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ ${name} failed:`, error instanceof Error ? error.message : String(error));
    if (required) {
      throw new Error(`Required seeder "${name}" failed. Stopping execution.`);
    }
    console.log(`⚠️  Skipping optional seeder "${name}"`);
    return false;
  }
}

async function main() {
  console.log("\n");
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║         🚀 KELOLAAJA DATABASE SEEDER                       ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log("\n");

  const startTime = Date.now();
  let successCount = 0;
  let failedCount = 0;

  for (const seeder of seeders) {
    try {
      const success = await runSeeder(seeder.name, seeder.file, seeder.required);
      if (success) {
        successCount++;
      } else {
        failedCount++;
      }
    } catch (error) {
      console.error("\n❌ Fatal error:", error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log("\n");
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║                  ✨ SEEDING SUMMARY                         ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log(`\n⏱️  Duration: ${duration}s`);
  console.log(`✅ Success: ${successCount}/${seeders.length}`);
  if (failedCount > 0) {
    console.log(`⚠️  Failed (optional): ${failedCount}`);
  }
  console.log("\n💡 Your database is now ready!\n");
  console.log("📝 Default Admin Credentials:");
  console.log("   Email: admin@kelolaaja.com");
  console.log("   Password: admin123\n");
}

main().catch(error => {
  console.error("\n❌ Seeding process failed:", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
