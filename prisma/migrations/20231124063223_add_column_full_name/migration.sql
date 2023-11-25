-- CreateTable
CREATE TABLE "users" (
    "user_id" UUID NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "verified" BOOLEAN DEFAULT false,
    "full_name" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "verification" (
    "verification_id" UUID NOT NULL,
    "verification_code" INTEGER NOT NULL,
    "status" BOOLEAN DEFAULT false,
    "user_id" UUID,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("verification_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "verification" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
