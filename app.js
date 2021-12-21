const express = require('express');
const morgan = require('morgan');
const app = express();
const attendanceRouter = require('./routes/attendanceRoutes');
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/attendance', attendanceRouter);
module.exports=app;