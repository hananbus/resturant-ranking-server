-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "userName" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resturants" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "resturants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ranking" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "resturantId" INTEGER NOT NULL,

    CONSTRAINT "ranking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ranking" ADD CONSTRAINT "ranking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ranking" ADD CONSTRAINT "ranking_resturantId_fkey" FOREIGN KEY ("resturantId") REFERENCES "resturants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
