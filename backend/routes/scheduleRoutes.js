const express = require('express');
const {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getBoats,
  getRoutes,
} = require('../controllers/scheduleController');

const router = express.Router();

router.get('/', getSchedules);
router.post('/', createSchedule);
router.put('/:schedule_id', updateSchedule);
router.delete('/:schedule_id', deleteSchedule);
router.get('/boats', getBoats);
router.get('/routes', getRoutes);

module.exports = router;