require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes')(express);
const mongoose = require('mongoose');
const app = express();
const port = 8090

app.use(bodyParser.json());
app.use(routes);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});