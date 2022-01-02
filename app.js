const express = require('express');
const morgan = require('morgan');
const app = express();
const attendanceRouter = require('./routes/attendanceRoutes');
const userRouter = require('./routes/userRoutes');
const scheduleRouter = require('./routes/scheduleRoutes');
const authController = require('./controllers/authController');
const viewRouter = require('./routes/viewRoutes');
const AppError = require("./utils/appError");
const session = require('express-session');
// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static('public'));
app.use(express.static(`${__dirname}/public`));
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'shhhh, very secret'
}));
app.get('/login', (req, res, next) => {
    res.render('login')
});
app.post('/login', authController.login);
// app.use((req, res, next) => {
//     if (req.path.startsWith('/login') && req.method === 'POST') {
//         next();
//     } else if (req.session.user) {
//         next();
//     } else {
//         res.redirect('/login');
//     }
// })
app.use('/', viewRouter);
app.use('/api/v1/attendance', attendanceRouter);
app.use('/api/v1/users', userRouter);
// app.use('/api/v1/schedule', scheduleRouter);
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
module.exports = app;