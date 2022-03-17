require('dotenv').config()
const { Connection } = require('es6');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes')(express);
const mongoose = require('mongoose');
const app = express();
const port = 3000

app.use(bodyParser.json());
app.use(routes);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});