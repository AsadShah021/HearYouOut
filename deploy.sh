#!/usr/bin/env bash
#
# Deploy the current main branch to this server.
#
#   cd /var/www/snugtalk && ./deploy.sh
#
# Safe to run repeatedly. It never touches .env files — those live only on the
# server and are not in git, so a pull can't overwrite your secrets.

set -euo pipefail   # stop on the first failure rather than half-deploying

cd "$(dirname "$0")"

echo "==> Pulling latest code"
git pull --ff-only

echo
echo "==> Backend: install, migrate, build"
cd backend
npm ci
npx prisma generate
# `migrate deploy` applies committed migrations only. It never creates a shadow
# database and never prompts, which is what makes it safe to run unattended.
npm run db:deploy
npm run build

echo
echo "==> Frontend: install, build"
cd ../HearYouOut
npm ci
npm run build

echo
echo "==> Restarting"
cd ..
pm2 restart ecosystem.config.cjs --update-env
pm2 save

echo
pm2 status
echo
echo "==> Health check"
curl -s localhost:4000/health && echo
curl -s -o /dev/null -w "web: %{http_code}\n" localhost:3000
echo
echo "Deployed."
