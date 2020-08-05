const PORTS = require('../services.json');

const apps = PORTS.filter((app) => {
  if (app.type !== 'Manager') {
    return false;
  }
  return true;
}).map((app) => {
  return {
    name: app.name,
    script: `./services/${app.name}/index.js`,
    instances: 1,
    autorestart: true,
    watch: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: app.port
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: app.port
    }
  };
});

module.exports = {
  apps
};
