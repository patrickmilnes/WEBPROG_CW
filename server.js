'use strict';

const express = require('express');
const app = express();
const port = 8080;

app.use(express.static("public"));

app.listen(port);
console.log("http://localhost:8080");

const { Client } = require('pg');
const client = new Client({
    user: "up899929",
    password: "root",
    host: "localhost",
    port: 5432,
    database: "test"
});

client.connect()
.then(() => console.log("Connection Successful"))
.then(() => client.query("SELECT NOW() as now"))
.then(results => console.log(results))
.catch(e => console.log)
.finally(() => client.end());