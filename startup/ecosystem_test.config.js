const PORTS = require('../services.json');

const apps = PORTS.filter((app) => app.env === 'server').map((app) => {
  let scriptLocation;
  if (app.type === 'Static') {
    scriptLocation = `./services/static-assets/${app.script}.js`;
  } else {
    scriptLocation = `./services/${app.name}/index.js`;
  }

  return {
    name: app.name,
    script: scriptLocation,
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'test',
      PORT: app.port
    },
    env_production: {
      NODE_ENV: 'test',
      PORT: app.port
    }
  };
});

module.exports = {
  apps
};
