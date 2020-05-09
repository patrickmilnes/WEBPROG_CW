'use strict';

const express = require('express');
const http = require('http');
const { Pool } = require('pg');
const ws = require('ws');
const app = express();
const port = 8080;

const jsonFile = "/questionnaire.json";

app.use(express.static(__dirname + '/public'));
const server = http.createServer(app);
const wss = new ws.Server({server});



server.listen(port);
console.log("http://localhost:8080");

wss.on('connection', onConnection);

async function onConnection(ws) {
    // await connect();
    const text = JSON.stringify(await start());
    console.log(`Sending JSON DATA`);
    ws.send(text);
    // await disconnect();
}

const pool = new Pool({
    user: "up899929",
    password: "root",
    host: "localhost",
    port: 5432,
    database: "test",
    max: 10,
    connectionTimeoutMillis: 20000,
    idleTimeoutMillis:60000
    
});

async function start() {
    try {
        // await connect();
        const results = await queryDb();
        // await disconnect();
        return await results;
    } catch (error) {
        console.log(error);
    }
    // await connect();
    // console.log(await queryDb());
    // await disconnect();
}

async function connect() {
    try {
        await pool.connect();
    } catch (error) {
        console.log(`Connection Error: ${error}`);
    }
}

async function disconnect() {
    try {
        await pool.end();
    } catch (error) {
        console.log(error);
    }
}

async function queryDb() {
    try {
        const results = await pool.query("select questionnaire from jsontest where name = 'Example-Questionnaire'");
        return results.rows[0];
    } catch (error) {
        console.log(error);
    }
}

// start();

// async function getQuestionnaire() {
//     try {
//         // await client.connect();
//         const query = await client.query("select * from testtable");
//         // await client.end();
//         const json = await JSON.stringify(query.fields);
//         return await json
//     } catch (error) {
//         console.log(error);
//     }
// }

// async function openConnection() {
//     const conn = await client.connect();
//     console.log(getQuestionnaire());
//     await client.end();
// }

