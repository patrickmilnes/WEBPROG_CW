const express = require('express');
const app = express();
const port = 8080;

app.use(express.static("public"));

app.listen(port);
console.log("http://localhost:8080");

const { Client } = require('pg')
const client = new Client({
    user: "up899929",
    password: "raspberry",
    host: "localhost",
    port: 5432,
    database: "test"
});

client.connect()
.then(() => console.log("Connection Successful"))
.catch(e => console.log("ERROR"))
.finally(() => client.end());
