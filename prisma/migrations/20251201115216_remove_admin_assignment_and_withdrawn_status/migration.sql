-- AlterEnum
-- Remove 'withdrawn' value from ApplicationStatus enum
ALTER TYPE "ApplicationStatus" RENAME TO "ApplicationStatus_old";
CREATE TYPE "ApplicationStatus" AS ENUM ('pending', 'reviewed', 'shortlisted', 'interview', 'offered', 'rejected', 'accepted');

-- AlterTable
-- First drop the default, then alter column type, then set default again
ALTER TABLE "JOB_APPLICATION" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "JOB_APPLICATION" ALTER COLUMN "status" TYPE "ApplicationStatus" USING ("status"::text::"ApplicationStatus");
ALTER TABLE "JOB_APPLICATION" ALTER COLUMN "status" SET DEFAULT 'pending'::"ApplicationStatus";

-- Drop old enum
DROP TYPE "ApplicationStatus_old";

-- AlterTable
-- Remove assignedTo column from JOB_APPLICATION table
ALTER TABLE "JOB_APPLICATION" DROP COLUMN "assigned_to";
