// PM2 process definitions. Lives in the repo so the server's setup is
// reproducible rather than something typed in once and forgotten.
module.exports = {
  apps: [
    {
      name: "snugtalk-api",
      cwd: "/var/www/snugtalk/backend",
      // tsc keeps the src/ prefix, so the entry is dist/src/, not dist/.
      script: "dist/src/server.js",
      env: { NODE_ENV: "production" },
      max_memory_restart: "400M",
    },
    {
      name: "snugtalk-web",
      cwd: "/var/www/snugtalk/frontend",
      script: "npm",
      args: "start",
      env: { NODE_ENV: "production", PORT: "3000" },
      max_memory_restart: "600M",
    },
  ],
};
