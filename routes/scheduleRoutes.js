const express = require('express');
const scheduleController = require('../controllers/scheduleControllers');


router = express.Router();
router.route('/')
    .post(scheduleController.addShift)

router.route('/:year/:month')
    .post(scheduleController.createReport);

router.route('/generate/:month')
    .get(scheduleController.generate);

module.exports = router;