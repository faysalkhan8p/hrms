const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ZKLib = require('node-zklib')
const upload = async (ip) => {
    console.log(ip);
    let zkInstance = new ZKLib(ip, 4370, 10000, 4000);
    let logs;
    try {
        await zkInstance.createSocket();
        logs = await zkInstance.getAttendances();
        console.log("JSON fetched");
    } catch (e) {
        console.log(e)
        if (e.code === 'EADDRINUSE') {
        }
    } finally {
        await zkInstance.disconnect();
        return logs;
    }
}

upload('103.217.110.133').then(res => {
    const Attendance = require('./models/attendanceModels');
    dotenv.config({path: './../config.env'});
    let DB = process.env.DATABASE;
    mongoose.connect(DB).then(() => {
        console.log('Server connected')
    }).catch(err => {
        console.log("failed");
        process.exit();
    });
    let record = res;
    const importData = async () => {
        try {
            let l = record.data.length;
            for (let i = 0; i < l; i++) {
                let x = record.data[i];
                let userId = x.deviceUserId;
                let utcTime = x.recordTime;
                let t = new Date(utcTime);
                let year = t.getFullYear();
                let month = t.getMonth();
                let date = t.getDate();
                let day = t.getDay();
                let time = t.getTime();
                let match = await Attendance.find({"userId": userId, "year": year, "month": month, "date": date});
                if (match.length == 0) {
                    await Attendance.create({
                        "userId": userId,
                        "year": year,
                        "month": month,
                        "date": date,
                        "day": day,
                        "inTime": time
                    });
                } else if (match[0].outTime == null && time != match[0].inTime && time > match[0].inTime) {
                    let id = match[0]._id;
                    await Attendance.findByIdAndUpdate(id, {"outTime": time}, {
                        new: true,
                        runValidators: true
                    });
                } else if (time < match[0].inTime) {
                    let id = match[0]._id;
                    await Attendance.findByIdAndUpdate(id, {"inTime": time}, {
                        new: true,
                        runValidators: true
                    });
                } else if (time > match[0].outTime) {
                    let id = match[0]._id;
                    await Attendance.findByIdAndUpdate(id, {"outTime": time}, {
                        new: true,
                        runValidators: true
                    });
                }
            }
            console.log("Data imported");
            process.exit();
        } catch (err) {
            console.log(err);
        }
    }
    importData()
})
