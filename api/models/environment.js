const { mongoose, connection } = require('../database');

const schema = new mongoose.Schema({ 
    login: String, 
    project: String,
    environment: String,
    content: Object,
    createdAt: Date,
    updatedAt: Date,
    versions: [Object]
});

module.exports = connection.model('Environment', schema);