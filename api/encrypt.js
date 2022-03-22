require('dotenv').config()
const SecurityService = require('./sevices/security-service');
const security =  new SecurityService();
const password = process.argv.pop();
console.log(security.encrypt(password));