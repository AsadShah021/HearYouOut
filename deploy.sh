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
cd ../frontend
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

# Both processes need a few seconds to bind their ports after a restart, so
# poll rather than checking once — otherwise a normal slow start reads as a
# failed deploy.
wait_for() {
  local name="$1" url="$2" code=""
  for _ in $(seq 1 30); do
    code=$(curl -s -o /dev/null -w "%{http_code}" "$url" || true)
    if [ "$code" = "200" ]; then
      echo "  $name: 200"
      return 0
    fi
    sleep 1
  done
  echo "  $name: FAILED (last status: ${code:-no response})"
  echo "  investigate with: pm2 logs --lines 50"
  return 1
}

wait_for "api" "http://localhost:4000/health"
wait_for "web" "http://localhost:3000"

echo
echo "Deployed."
