const {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require('../../models/launches.model');
const { getPagination } = require('../../services/query');

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;
  const { mission, rocket, launchDate, target } = launch;

  if (!mission || !rocket || !launchDate || !target) {
    return res.status(400).json({
      error: 'Missing launch property',
    });
  }

  launch.launchDate = new Date(launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: 'Invalid date property',
    });
  }

  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const id = Number(req.params.id);

  const existingLaunch = await existsLaunchWithId(id);
  if (!existingLaunch) {
    return res.status(404).json({
      error: 'Launch not found!',
    });
  }

  const abortedLaunch = await abortLaunchById(id);
  if (!abortedLaunch) {
    return res.status(400).json({
      error: 'Launch not aborted!',
    });
  }

  return res.status(200).json({ ok: true });
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
