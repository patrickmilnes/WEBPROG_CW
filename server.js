'use strict';

const config = require('./dbconfig');

const fs = require('fs');
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

app.get('/admin', async (req, res) => {
    // console.log("ADMIN ACCESSED");
    // if(createResultsFile() == 1) {
    //     res.setHeader('Content-disposition', 'attachment; filename=results.json');
    //     res.download('results.json');
    // }
    // const text = JSON.stringify(await queryResults());
    // wss.send(text);
});

wss.on('connection', onConnection);
// wss.on('message', clientMessage);

async function clientMessage(e) {
    if (e == "DOWNLOAD") {
        console.log("DOWNLOAD");
    } else {
        pushToDb(e);
        console.log("PUSH TO DB");
    }
    
    
}

async function onConnection(ws) {
    // await connect();
    const text = JSON.stringify(await start());
    console.log("SENDING JSON DATA");
    ws.send(text);
    ws.on('message', async (e) => {
        if (e == "DOWNLOAD") {
            console.log("DOWNLOAD");
            const query = await queryResults();
            // console.log(query);
            const json = JSON.stringify(extractResults(query.rows));
            // console.log(json);
            ws.send(json);
        } else {
            pushToDb(e);
            console.log("PUSH TO DB");
        }
    });
    // await disconnect();
}

function extractResults(object) {

    let results = [];

    object.forEach(element => {
        // console.log(element);
        results.push(element.results_json);
    });
    // console.log(results);
    return results;
}

const pool = new Pool(config);

async function start() {
    try {
        const results = await queryDb();
        return await results;
    } catch (error) {
        console.log(error);
    }
}

async function queryDb() {
    try {
        const results = await pool.query("select questionnaire_json from questionnaire where questionnaire_name = 'Example Questionnaire'");
        return results.rows[0];
        // return extractResults(results.rows);
    } catch (error) {
        console.log(error);
    }
}

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

// async function createResultsFile() {
//     const data = await queryResults();
//     sconsole.log(JSON.stringify(data.rows));
//     fs.writeFile("results.json", JSON.stringify(data.rows), (err) => {
//         if (err) return console.log(err);
//     });
//     return 1;
// }
