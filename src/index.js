const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const https = require("https");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./app/controllers/index')(app);

const privateKey = fs.readFileSync(__dirname + '/key.pem');
const privateCert = fs.readFileSync(__dirname + '/cert.pem');

https.createServer({
    key: privateKey,
    cert: privateCert,
    passphrase: 'agendex'
}, app)
.listen(3000);

//app.listen(3000);

