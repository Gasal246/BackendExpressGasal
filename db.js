const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
require('dotenv').config()

mongoose.connect(process.env.mongo_URL).then(() => {
    console.log("Connected to Database")
}).catch((err) => {
    console.log(`Could not connect to DB `+err);
})