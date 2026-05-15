const { openApi } = require('../config/swagger');

const about = (_req, res) => {
  res.status(200).json({
    name: 'Notes Backend',
    version: '1.0.0',
    stack: ['Node.js', 'Express.js', 'Prisma', 'PostgreSQL'],
    uptime: process.uptime()
  });
};

const openapi = (_req, res) => {
  res.status(200).json(openApi);
};

module.exports = {
  about,
  openapi
};
