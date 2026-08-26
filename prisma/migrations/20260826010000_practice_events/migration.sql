-- CreateTable
CREATE TABLE "PracticeEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "passed" BOOLEAN,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PracticeEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PracticeEvent_userId_createdAt_idx" ON "PracticeEvent"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "PracticeEvent_userId_kind_targetId_idx" ON "PracticeEvent"("userId", "kind", "targetId");

-- AddForeignKey
ALTER TABLE "PracticeEvent" ADD CONSTRAINT "PracticeEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
