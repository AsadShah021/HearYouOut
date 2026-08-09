-- Replace the nullable `emailVerifiedAt` timestamp with a plain 0/1 flag.
--
-- Done in three steps rather than the one ALTER Prisma generates. Dropping and
-- adding in a single statement would leave every row at the DEFAULT of 0 —
-- which, with verification as a hard gate, means every existing account is
-- locked out of the site the moment this deploys.

-- 1. Add the flag, everyone starting unverified.
ALTER TABLE `users` ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false;

-- 2. Carry the old value across: anyone with a verification timestamp had
--    proven their address, so they stay verified.
UPDATE `users` SET `isVerified` = 1 WHERE `emailVerifiedAt` IS NOT NULL;

-- 3. Only now is the timestamp safe to drop.
ALTER TABLE `users` DROP COLUMN `emailVerifiedAt`;
