-- CreateTable
CREATE TABLE "PlatformApiKey" (
    "platform" TEXT NOT NULL,
    "hashedApiKey" TEXT NOT NULL,

    CONSTRAINT "PlatformApiKey_pkey" PRIMARY KEY ("platform")
);
