'use strict';

const config = require('./dbconfig');
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

/**
 * Event handler for when user connects to database.
 * @param {WebSocket} ws -> Websocket object.
 */
async function onConnection(ws) {
    const text = JSON.stringify(await queryDb());
    console.log("SENDING JSON DATA");
    ws.send(text);
    // Adds messgae event from client and checks if its a download request for a push to database request.
    ws.on('message', async (e) => {
        if (e == "DOWNLOAD") {
            console.log("DOWNLOAD");
            const query = await queryResults();
            const json = JSON.stringify(extractResults(query.rows));
            ws.send(json);
        } else {
            pushToDb(e);
            console.log("PUSH TO DB");
        }
    });
}

/**
 * Convers query results from database into array.
 * @param {Object} object -> Object with results.
 */
function extractResults(object) {

    let results = [];

    object.forEach(element => {
        results.push(element.results_json);
    });
    return results;
}

/**
 * Pool to query postgres database.
 */
const pool = new Pool(config);

/**
 * Queries database for example questionnaire.
 */
async function queryDb() {
    try {
        const results = await pool.query("select questionnaire_json from questionnaire where questionnaire_name = 'Example Questionnaire'");
        return results.rows[0];
    } catch (error) {
        console.log(error);
    }
}

/**
 * Insets results data from questionnire into database.
 * @param {JSON} data -> JSON string containing results.
 */
async function pushToDb(data) {
    try {
        await pool.query("insert into results (questionnaire_id, results_json) values (1, '" + data + "')");
    } catch (error) {
        console.log(error);
    }
}

async function queryResults() {
    try {
        const results = await pool.query("select results_json from results where questionnaire_id='1'");
        return results;
    } catch (error) {
        console.log(error);
    }
    
}

