-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "action" TEXT NOT NULL,
    "issue" JSONB NOT NULL,
    "repository" JSONB NOT NULL,
    "sender" JSONB NOT NULL,
    "external_id" BIGINT NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "events_external_id_key" ON "events"("external_id");
