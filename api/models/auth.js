const { mongoose, connection } = require('../database');

const schema = new mongoose.Schema({ 
    name: String, 
    login: String,
    password: String
});

module.exports = connection.model('Auth', schema);