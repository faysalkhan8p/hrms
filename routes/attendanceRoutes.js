const express = require('express');
const attendanceController = require('../controllers/attendanceController');
const router = express.Router();
router.route('/')
    .get(attendanceController.getAttendance);

router.route('/:id/:month/:year')
    .get(attendanceController.getAttendanceById);
router.route('/daily')
    .post(attendanceController.daily);

module.exports = router;