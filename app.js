const express = require('express');
const morgan = require('morgan');
const app = express();
const attendanceRouter = require('./routes/attendanceRoutes');
const userRouter = require('./routes/userRoutes');
const scheduleRouter = require('./routes/scheduleRoutes');
const AppError = require("./utils/appError");
// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/attendance', attendanceRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/schedule', scheduleRouter);
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
module.exports = app;