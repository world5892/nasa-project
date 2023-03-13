const http = require('http');

require('dotenv').config();

const app = require('./app');
const { loadLaunchesData } = require('./models/launches.model');
const { loadPlanetsData } = require('./models/planets.model');
const { mongoConnect } = require('./services/mongo');

const PORT = process.env.PORT || 9299;

const server = http.createServer(app);

const startServer = async () => {
  await mongoConnect();
  await loadLaunchesData();
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
  });
};

startServer();
