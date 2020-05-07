'use strict';

const ws = new WebSocket("ws://" + window.location.hostname + ":8080/");

function fromServer(e) {
    const data = JSON.parse(e.data);
    addToDom(data);
}

function addToDom(data) {
    let master = document.querySelector('#list');
    data.forEach(element => {
        let ele = document.createElement('li');
        ele.textContent = `Name: ${element.name}\tAge: ${element.age}`
        master.appendChild(ele);
    });
}

ws.addEventListener('message', fromServer);