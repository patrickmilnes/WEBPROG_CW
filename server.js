'use strict';

const express = require('express');
const http = require('http');
const { Client } = require('pg');
const ws = require('ws');
const app = express();
const port = 8080;

const jsonFile = "/questionnaire.json";

app.use(express.static(__dirname + '/public'));
const server = http.createServer(app);
const wss = new ws.Server({server});

wss.on('connection', (ws) => {
    ws.send(JSON.stringify(getJson()));
});

server.listen(port);
console.log("http://localhost:8080");

async function getJson() {
    let json;
    const questionnaire = await fetch(jsonFile)
    .then((data) => {
        json = data.json();
    })
    .catch((error) => {
        console.log(error);
    });
    
    return json;
}

const client = new Client({
    user: "up899929",
    password: "root",
    host: "localhost",
    port: 5432,
    database: "test"
});

client.connect()
.then(() => console.log("Connection Successful"))
.then(() => client.query("SELECT * FROM testTable"))
.then(results => console.table(results.rows))
.catch(e => console.log)
.finally(() => client.end());