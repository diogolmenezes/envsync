const { mongoose, connection } = require('../database');

const schema = new mongoose.Schema({ 
    name: String, 
    login: { type: String, unique: true },
    password: Object,
    projects: [Object]
});

module.exports = connection.model('Auth', schema);