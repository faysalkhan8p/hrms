const Attendance = require('./../models/attendanceModels');
const APIFeatures = require('./../utils/apiFeatures');

exports.getAttendance = async (req, res, next) => {
    try {
        const features = new APIFeatures(Attendance.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const attendance = await features.query;
        res.status(200).json({
            status: 'success',
            results: attendance.length,
            data: {
                attendance
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.getAttendanceById = async (req, res, next) => {
    try {
        id = req.params.id;
        id = parseInt(id);
        let monthlyAttendance = await Attendance.find({ "userId": id, 'year': 2021, 'month': 11 });
        let time = 0;
        let day = 0;
        let i = 0;
        while (typeof monthlyAttendance[i] != 'undefined') {
            if (typeof monthlyAttendance[i].outTime != 'undefined' && typeof monthlyAttendance[i].inTime != 'undefined') {
                time += monthlyAttendance[i].outTime - monthlyAttendance[i].inTime;
                day += 1;
            }
            i++;
        }
        time = time / 3600000;
        res.status(200).json({
            TotalTime: time,
            TotalDay: day
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}
