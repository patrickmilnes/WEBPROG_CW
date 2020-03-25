const express = require('express');
const pouchDB = require('pouchdb');
const app = express();
const port = 8080;

app.use(express.static("public"));

app.listen(port);
console.log("http://localhost:8080");