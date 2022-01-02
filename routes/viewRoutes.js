const express = require('express');
const scheduleController = require('../controllers/scheduleControllers');
const userController = require('./../controllers/userController');
const attendanceController = require('./../controllers/attendanceController');
const authController = require('./../controllers/authController');
router = express.Router();
router.route('/addshift')
    .get((req, res) => {
        res.render('addShift');
    }).post(scheduleController.addShift);

router.route('/adduser')
    .get((req, res) => {
        res.render('adduser')
    }).post(userController.addUser);

router.route('/daily')
    .get((req, res) => {
        res.render('daily')
    }).post(attendanceController.daily);

router.route('/dailyreport').get((req, res) => {
    res.render('dailyreport');
})

router.route('/').get((req, res) => {
    res.render('dashboard');
})
router.route('/logout').get(authController.logout)
router.route('/monthly').get((req, res) => {
    res.render('monthly');
}).post(attendanceController.getAttendanceById);
router.route('/tools').get((req, res) => {
    res.render('tools');
});
router.route('/schedule').post(scheduleController.createReport)
router.route('/generate').post(scheduleController.generate);
router.route('/fetch').get(attendanceController.fetch);

module.exports = router;