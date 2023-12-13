-- CreateTable
CREATE TABLE "_UsersCommentsOnDrivers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UsersCommentsOnDrivers_AB_unique" ON "_UsersCommentsOnDrivers"("A", "B");

-- CreateIndex
CREATE INDEX "_UsersCommentsOnDrivers_B_index" ON "_UsersCommentsOnDrivers"("B");

-- AddForeignKey
ALTER TABLE "_UsersCommentsOnDrivers" ADD CONSTRAINT "_UsersCommentsOnDrivers_A_fkey" FOREIGN KEY ("A") REFERENCES "Driver"("licence_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsersCommentsOnDrivers" ADD CONSTRAINT "_UsersCommentsOnDrivers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
