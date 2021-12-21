const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path: './config.env'});
const app = require('./app');
const DB = process.env.DATABASE;
mongoose.connect(DB).then(() => {
    console.log('Server connected')
}).catch(err => {
    console.log("failed");
    process.exit();
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});