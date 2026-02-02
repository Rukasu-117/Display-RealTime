module.exports = {
  apps: [
    {
      name: "digital-signage-web",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: "./",
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "digital-signage-ws",
      script: "server.js",
      cwd: "./ws-server",
      instances: 1,
      autorestart: true,
      watch: false,
    },
  ],
};
