# Deploying SnugTalk to Hostinger

**You need a VPS, not shared hosting.** Shared hosting is built for PHP; this
stack needs two persistent Node processes. Hostinger's VPS gives you root,
so the frontend, the API and MySQL can all live on one box.

Recommended: **KVM 2 (2 vCPU, 8 GB RAM), Ubuntu 24.04 LTS.** KVM 1 will run it,
but `next build` is memory-hungry and 8 GB saves you fighting it.

---

## Serve everything from one domain

This is the important decision, and it isn't just tidiness.

```
https://snugtalk.com/          →  nginx  →  Next.js  (127.0.0.1:3000)
https://snugtalk.com/api/...   →  nginx  →  Express  (127.0.0.1:4000)
```

**Do not put the API on `api.snugtalk.com`.** The session is an httpOnly
cookie set by the API. On a subdomain it becomes *host-only* — the browser
sends it to `api.snugtalk.com` and nowhere else. The Next.js middleware runs on
`snugtalk.com`, wouldn't see it, and would bounce every signed-in user back to
`/sign-in`. You'd then be reaching for `domain=.snugtalk.com` and
`SameSite=None`, which is more configuration and a weaker cookie.

Same-origin removes the problem entirely, and CORS stops mattering too.

---

## 1. Server setup

SSH in, then create a non-root user and lock the box down:

```bash
adduser deploy
usermod -aG sudo deploy
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

Install the runtime pieces:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs nginx mysql-server git
sudo npm install -g pm2
```

```bash
sudo mysql_secure_installation
```

## 2. Database

```sql
CREATE DATABASE hearmeout CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER 'hearmeout'@'localhost' IDENTIFIED BY 'A-LONG-RANDOM-PASSWORD';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, DROP, REFERENCES
  ON hearmeout.* TO 'hearmeout'@'localhost';
FLUSH PRIVILEGES;
```

Narrower than local on purpose. Production uses `prisma migrate deploy`, which
never creates a shadow database, so the user doesn't need rights outside its own
schema. MySQL is only listening on localhost — do **not** open 3306 in UFW.

## 3. Deploy the code

```bash
cd /var/www
git clone <your-repo> hearmeout
cd hearmeout
```

**Backend:**

```bash
cd backend
npm ci
npx prisma generate
npm run db:deploy      # prisma migrate deploy — applies migrations, no shadow DB
npm run build
```

**Frontend:**

```bash
cd ../HearYouOut
npm ci
npm run build
```

## 4. Environment

`backend/.env`:

```
DATABASE_URL="mysql://hearmeout:A-LONG-RANDOM-PASSWORD@localhost:3306/hearmeout"
JWT_SECRET="<64 hex chars — generate a NEW one, never reuse the dev value>"
JWT_EXPIRES_IN="7d"
PORT=4000
NODE_ENV=production
CORS_ORIGIN="https://snugtalk.com"
```

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

`NODE_ENV=production` is what flips the session cookie to `secure: true`, so it
only ever travels over HTTPS. It also switches `trust proxy` on so rate limiting
sees the real client IP through nginx instead of rate-limiting nginx itself.

`HearYouOut/.env.local`:

```
NEXT_PUBLIC_API_URL=
```

Deliberately empty. The API client falls back to relative URLs, so the browser
calls `/api/...` on the same origin. No CORS, no cookie-domain problem.

## 5. Keep both running

`/var/www/snugtalk/ecosystem.config.cjs`:

```js
module.exports = {
  apps: [
    {
      name: "snugtalk-api",
      cwd: "/var/www/snugtalk/backend",
      script: "dist/server.js",
      env: { NODE_ENV: "production" },
      max_memory_restart: "400M",
    },
    {
      name: "snugtalk-web",
      cwd: "/var/www/snugtalk/HearYouOut",
      script: "npm",
      args: "start",
      env: { NODE_ENV: "production", PORT: "3000" },
      max_memory_restart: "600M",
    },
  ],
};
```

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup        # run the command it prints, so both survive a reboot
```

## 6. nginx

`/etc/nginx/sites-available/snugtalk`:

```nginx
server {
    listen 80;
    server_name snugtalk.com www.snugtalk.com;

    client_max_body_size 2m;

    # More specific location wins, so this is matched before "/".
    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        "upgrade";
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

`X-Forwarded-Proto` is not optional — it's how Express knows the original
request was HTTPS, which the secure-cookie logic depends on.

```bash
sudo ln -s /etc/nginx/sites-available/snugtalk /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 7. HTTPS

Point your domain's A record at the VPS IP in Hostinger's DNS panel, wait for it
to resolve, then:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d snugtalk.com -d www.snugtalk.com
```

Certbot rewrites the nginx config for TLS and installs a renewal timer.

---

## Do not run the seed in production

```
npm run db:seed     # ← NEVER on the production database
```

It creates an **ADMIN account with the password `password123`**. On a public
server that is a full compromise the moment anyone guesses it.

Create your real admin instead: sign up through the site normally, then promote
that user once:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'you@yourdomain.com';
```

After that, every other role change can be done from `/admin/users`.

---

## Updating after the first deploy

```bash
cd /var/www/snugtalk
git pull
cd backend && npm ci && npx prisma generate && npm run db:deploy && npm run build
cd ../HearYouOut && npm ci && npm run build
pm2 restart all
```

## Backups

Nothing here is backed up by default, and this database holds people's private
conversations. Set up a nightly dump before you take real users:

```bash
mysqldump -u hearmeout -p --single-transaction hearmeout \
  | gzip > /var/backups/snugtalk-$(date +%F).sql.gz
```

Put it in cron, and copy the files off the VPS — a backup that only exists on
the machine it's backing up is not a backup.

---

## Before real users

- [ ] New `JWT_SECRET`, never the dev one
- [ ] Strong MySQL password; port 3306 closed to the internet
- [ ] Seed data absent; real admin promoted by hand
- [ ] HTTPS working and redirecting from HTTP
- [ ] Nightly database backups running **and restored once as a test**
- [ ] A privacy policy that matches what you actually store
- [ ] Email sending wired up — right now approving a ticket updates the database
      but sends nobody anything
