const express = require('express');
const attendanceController = require('../controllers/attendanceController');
const router = express.Router();
router.route('/')
    .get(attendanceController.getAttendance);

router.route('/:id/:month')
    .get(attendanceController.getAttendanceById);

module.exports = router;