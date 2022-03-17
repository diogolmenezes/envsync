const { mongoose, connection } = require('../database');

const schema = new mongoose.Schema({ 
    login: String, 
    project: String,
    environment: String,
    content: String,
    createdAt: Date,
    updatedAt: Date,
    history: [Object]
});

module.exports = connection.model('Env', schema);