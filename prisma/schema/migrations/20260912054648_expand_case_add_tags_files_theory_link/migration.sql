/*
  Warnings:

  - Added the required column `category` to the `cases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `caseId` to the `theories` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CaseCategory" AS ENUM ('COLD_CASE', 'MISSING_PERSON', 'UNSOLVED_MURDER', 'UNIDENTIFIED_REMAINS', 'OTHER');

-- CreateEnum
CREATE TYPE "PublishState" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "InvestigationStatus" AS ENUM ('OPEN', 'CLOSED', 'COLD', 'SOLVED');

-- AlterTable
ALTER TABLE "cases" ADD COLUMN     "category" "CaseCategory" NOT NULL,
ADD COLUMN     "investigationStatus" "InvestigationStatus" NOT NULL DEFAULT 'OPEN',
ADD COLUMN     "publishState" "PublishState" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "publishedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "theories" ADD COLUMN     "caseId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "case_files" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "case_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CaseTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CaseTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE INDEX "_CaseTags_B_index" ON "_CaseTags"("B");

-- AddForeignKey
ALTER TABLE "case_files" ADD CONSTRAINT "case_files_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theories" ADD CONSTRAINT "theories_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaseTags" ADD CONSTRAINT "_CaseTags_A_fkey" FOREIGN KEY ("A") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaseTags" ADD CONSTRAINT "_CaseTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
