const mongoose = require('mongoose');
const connection = mongoose.createConnection(process.env.MONGO_HOST, { maxPoolSize: 10 });
module.exports = {
    mongoose,
    connection
};
