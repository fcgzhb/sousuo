module.exports = {
  apps: [{
    name: 'seo-keyword-analyzer',
    script: 'server.js',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '256M',
    env: {
      PORT: 3000,
      NODE_ENV: 'production'
    }
  }]
};
