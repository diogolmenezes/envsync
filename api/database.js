const mongoose = require('mongoose');
const connection = mongoose.createConnection(process.env.MONGO_HOST, { 
    maxPoolSize: 10,
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
});
module.exports = {
    mongoose,
    connection
};
